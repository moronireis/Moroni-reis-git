import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';

export const prerender = false;

/**
 * IA das Ferramentas (Conversor Mercos + Renomeador de Fotos).
 *
 * POST { action: 'map-mercos',  sample: (string|number|null)[][] }
 *   → { header_row, mapping: { [mercosIdx]: factoryIdx|null }, confidence, notes }
 *
 * POST { action: 'rename-rule', filenames: string[] }
 *   → { rule: { type:'segment', separator, index } | { type:'regex', pattern, group },
 *       confidence, examples: [{de,para}], notes }
 *
 * Privacidade: só a amostra (cabeçalhos + ~20 linhas / nomes de arquivo) sai do
 * navegador — nunca a planilha ou as fotos inteiras.
 */

// gpt-4o: o mini errava header_row e coluna de preço nas planilhas reais
// (cabeçalho enterrado, colunas quase-duplicadas). Volume é baixíssimo —
// 1 chamada por conversão, só amostra — custo por uso segue em centavos.
const MODEL = () => (import.meta.env.OPENAI_MODEL || 'gpt-4o').trim();

async function callOpenAI(system: string, user: string): Promise<Record<string, unknown>> {
  const apiKey = (import.meta.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL(),
      temperature: 0,
      max_tokens: 900,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Resposta vazia da IA');
  return JSON.parse(content);
}

// ---------------------------------------------------------------- map-mercos

const MERCOS_TARGETS = `
"0"  = Código do produto (código/referência/ref do item na fábrica)
"1"  = Nome do produto (descrição do item) — OBRIGATÓRIO
"2"  = Preço de Tabela (preço de venda/preço cheio) — OBRIGATÓRIO
"3"  = Preço Mínimo (preço/venda mínima, se existir)
"4"  = IPI em % (se existir)
"5"  = Substituição Tributária em % (se existir)
"6"  = Comissão em % (se existir)
"7"  = Informações adicionais (detalhes extras/observações)
"8"  = Unidade (ex.: PC, CX, KG, UN, M)
"9"  = Quantidade em estoque
"10" = Múltiplo de venda
"11" = Peso bruto em Kg
"16" = Categoria principal
"17" = Subcategoria nível 2`;

function sanitizeSample(sample: unknown): string[][] {
  if (!Array.isArray(sample)) return [];
  return (sample as unknown[]).slice(0, 25).map(row =>
    (Array.isArray(row) ? row : []).slice(0, 30).map(cell =>
      cell === null || cell === undefined ? '' : String(cell).slice(0, 48)
    )
  );
}

async function mapMercos(sample: unknown) {
  const rows = sanitizeSample(sample);
  if (rows.length === 0) throw new Error('Amostra vazia');

  const system =
    'Você mapeia planilhas de preço de fábricas brasileiras (móveis, decoração etc.) para o modelo de importação de produtos do Mercos. ' +
    'Responda SOMENTE com JSON válido.';

  const numbered = rows.map((r, i) => `Linha ${i}: ${JSON.stringify(r)}`).join('\n');
  const user = `Amostra da planilha da fábrica (células truncadas; índices de linha e de coluna começam em 0):

${numbered}

Colunas-alvo do Mercos (chave = índice no modelo Mercos):
${MERCOS_TARGETS}

Tarefas:
1. Detectar o índice da LINHA DE CABEÇALHO — a linha que contém os TÍTULOS das colunas (ex.: "Descrição", "Cód.", "Preço"). Planilhas de fábrica costumam ter logotipo, dados cadastrais e campos de pedido nas primeiras linhas; ignore-as. CONFIRA: a linha escolhida deve conter rótulos curtos, e a linha SEGUINTE já deve conter produtos. Se a linha que você escolheu contém um nome de produto real, você errou — o cabeçalho é a anterior.
2. Mapear cada coluna-alvo do Mercos para o índice da coluna correspondente (ou null se não existir). Priorize acertar: código, nome/descrição, preço de tabela, preço mínimo e IPI. Use os VALORES das linhas de dados para confirmar: preço é valor monetário unitário (ex.: "178.32"); código é alfanumérico curto (ex.: "MONA-001783"); NÃO confunda preço com quantidade mínima de venda (ex.: "24.0 - UN" não é preço).
3. Nunca mapeie a mesma coluna da fábrica para dois alvos diferentes, exceto Preço de Tabela e Preço Mínimo quando a fábrica tiver um único preço (nesse caso mapeie só Preço de Tabela).
4. Só mapeie um alvo quando a coluna claramente corresponder — na dúvida, use null (melhor faltar do que mapear errado).

Responda com JSON exatamente neste formato:
{"header_row": <número>, "mapping": {"0": <número|null>, "1": <número|null>, "2": <número|null>, "3": <número|null>, "4": <número|null>, "5": <número|null>, "6": <número|null>, "7": <número|null>, "8": <número|null>, "9": <número|null>, "10": <número|null>, "11": <número|null>, "16": <número|null>, "17": <número|null>}, "confidence": "alta"|"media"|"baixa", "notes": "<1 frase em pt-BR sobre o que merece revisão>"}`;

  const out = await callOpenAI(system, user);

  // Validação defensiva do que a IA devolveu
  const headerRow = Number.isInteger(out.header_row) && (out.header_row as number) >= 0 && (out.header_row as number) < rows.length
    ? (out.header_row as number) : 0;
  const rawMap = (out.mapping && typeof out.mapping === 'object') ? out.mapping as Record<string, unknown> : {};
  const nCols = Math.max(...rows.map(r => r.length), 0);
  const mapping: Record<string, number | null> = {};
  for (const key of ['0','1','2','3','4','5','6','7','8','9','10','11','16','17']) {
    const v = rawMap[key];
    mapping[key] = (Number.isInteger(v) && (v as number) >= 0 && (v as number) < nCols) ? (v as number) : null;
  }
  // Dedup: a mesma coluna da fábrica não pode alimentar dois alvos (exceção:
  // Preço de Tabela "2" + Preço Mínimo "3" podem compartilhar). Prioridade
  // para os campos críticos do fluxo da Tati (nome, preço, código, mín, IPI).
  const priority = ['1','2','0','3','4','8','10','9','11','5','6','7','16','17'];
  const used = new Set<number>();
  for (const key of priority) {
    const v = mapping[key];
    if (v === null) continue;
    const shared23 = (key === '3' && v === mapping['2']);
    if (used.has(v) && !shared23) { mapping[key] = null; continue; }
    used.add(v);
  }
  return {
    header_row: headerRow,
    mapping,
    confidence: ['alta','media','baixa'].includes(out.confidence as string) ? out.confidence : 'baixa',
    notes: typeof out.notes === 'string' ? out.notes.slice(0, 300) : '',
  };
}

// --------------------------------------------------------------- rename-rule

async function renameRule(filenames: unknown) {
  if (!Array.isArray(filenames) || filenames.length === 0) throw new Error('Nenhum nome de arquivo enviado');
  const names = (filenames as unknown[]).slice(0, 40).map(n => String(n).slice(0, 120));

  const system =
    'Você deduz a regra que extrai o CÓDIGO Mercos do produto a partir de nomes de arquivos de fotos enviados por fábricas brasileiras. ' +
    'O código extraído vira o novo nome do arquivo, para o Mercos casar a foto com o produto automaticamente. ' +
    'Responda SOMENTE com JSON válido.';

  const user = `Nomes de arquivo de fotos de UMA fábrica (sem extensão ou com extensão, como recebidos):

${JSON.stringify(names)}

Exemplos de outras fábricas (para referência do tipo de regra):
- "5_MO-15_01.jpg" → código "MO-15" (regra: separador "_", ficar com o segmento de índice 1)
- "17619_baixa.jpg" → código "17619" (regra: separador "_", ficar com o segmento de índice 0)

Deduza a regra mais simples que funcione para TODOS os nomes listados. Prefira o tipo "segment" (separador + índice do segmento, índice começa em 0, aplicado ao nome SEM a extensão). Use "regex" apenas se "segment" não resolver — a regex deve ser JavaScript válida com UM grupo de captura contendo o código.

Responda com JSON exatamente neste formato:
{"rule": {"type": "segment", "separator": "<string>", "index": <número>} OU {"type": "regex", "pattern": "<string>", "group": 1}, "confidence": "alta"|"media"|"baixa", "examples": [{"de": "<nome original>", "para": "<código extraído>"}, ...até 5], "notes": "<1 frase em pt-BR>"}`;

  const out = await callOpenAI(system, user);

  const rule = out.rule as Record<string, unknown> | undefined;
  if (!rule || (rule.type !== 'segment' && rule.type !== 'regex')) throw new Error('IA não retornou uma regra válida');
  if (rule.type === 'segment' && (typeof rule.separator !== 'string' || !Number.isInteger(rule.index) || (rule.index as number) < 0)) {
    throw new Error('Regra "segment" inválida');
  }
  if (rule.type === 'regex') {
    try { new RegExp(String(rule.pattern)); } catch { throw new Error('Regex inválida retornada pela IA'); }
  }
  return {
    rule,
    confidence: ['alta','media','baixa'].includes(out.confidence as string) ? out.confidence : 'baixa',
    examples: Array.isArray(out.examples) ? (out.examples as unknown[]).slice(0, 5) : [],
    notes: typeof out.notes === 'string' ? out.notes.slice(0, 300) : '',
  };
}

// -------------------------------------------------------------------- route

export const POST: APIRoute = async ({ request, locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  let body: any;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400 });
  }

  try {
    if (body.action === 'map-mercos')  {
      return new Response(JSON.stringify(await mapMercos(body.sample)), { status: 200 });
    }
    if (body.action === 'rename-rule') {
      return new Response(JSON.stringify(await renameRule(body.filenames)), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'action desconhecida' }), { status: 400 });
  } catch (e: any) {
    console.error('[ferramentas/ai]', body?.action, e?.message);
    return new Response(JSON.stringify({ error: e?.message || 'Falha na IA' }), { status: 502 });
  }
};
