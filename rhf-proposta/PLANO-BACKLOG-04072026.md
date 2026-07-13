# Plano de Atualizações — RHF Talentos (Backlog Checkpoint 04/07/2026)

> Fonte: `~/Downloads/Backlog — RHF Talentos (Checkpoint 04072026).pdf`
> Elaborado em: 08/07/2026 — **FASE 1 IMPLANTADA E DEPLOYADA EM 08/07/2026**
> Produção: `rhf-talentos-plataforma.vercel.app` — deploy SEMPRE via `vercel --prod` + atualização do alias

## STATUS FASE 1 (08/07/2026)

| Item | Status |
|------|--------|
| 1.1 Remover módulo Conversas (chat.html, messages.js, webhook/meta.js, navs, vercel.json) | ✅ FEITO — 12→10 funções |
| 1.2 Spike ChatGuru | ✅ FEITO — descobriu `message_file_send` (file_url + caption). `file_send`/`chat_list`/`chat_read`/`chat_info` NÃO existem na API. Coleta da Fase 2 será via webhook, não polling. Escritas existem: `chat_update_custom_fields`, `note_add`, `chat_update_context`, `chat_update_name` |
| 1.3 Upload PDF Pandapé + import com IA | ✅ FUNCIONANDO EM PRODUÇÃO (09/07) — card na aba Gerador, pdf.js client-side, `action=import-pdf` (**OpenAI `gpt-4o-mini` + structured outputs estritos, conta U4D** — trocado de Claude em 09/07 por decisão do Moroni), grava `raw_data` no formato Pandapé (geração consome sem mudanças). `OPENAI_API_KEY` configurada no Vercel. Testado E2E em produção: candidato criado a partir de texto de PDF (~1,2K tokens ≈ R$0,002/currículo). Override de modelo via env `OPENAI_IMPORT_MODEL` |
| 1.4 Enviar arquivo PDF no ChatGuru | ✅ FEITO — PDF client-side (html2pdf via iframe do cv-print) → bucket `rhf-cvs` (Supabase Storage, público) → `message_file_send` com caption. Testado E2E até a entrega (número fake → "Chat não existe", parâmetros aceitos). Fallback texto preservado (`sent_status='chatguru_texto'`) |
| Migration 006 (sent_status/sent_at/sent_file_url/presented_at/client_response_at/client_company/vacancy_ref/created_by_name + vacancies.updated_at) | ✅ APLICADA no banco |
| Rastreio de recrutador (created_by/created_by_name no generate) | ✅ FEITO — front envia RHF_USER |
| Deploy produção + alias | ✅ dpl_9MRtJnJe8eiTMwDndmtpTXADn6bk — smoke tests todos verdes |

**Pendências para fechar a Fase 1:**
1. ~~`ANTHROPIC_API_KEY` com créditos~~ → RESOLVIDO 09/07: IA trocada para OpenAI (conta U4D), `OPENAI_API_KEY` no Vercel, E2E verde em produção
2. E2E com o Rodrigo: importar 3–5 PDFs reais do Pandapé + enviar um CV em PDF para um chat real do ChatGuru
3. Confirmar com o Rodrigo que o arquivo enviado aparece no módulo Arquivos do ChatGuru para organização por tags
4. ~~Commit do código~~ → FEITO 09/07 (`b7119b6` Fase 1 + commit da troca para OpenAI)

**Entradas manuais Pandapé — IMPLEMENTADO E DEPLOYADO 09/07 (aprovado pelo Moroni):**

| Aba | Entrada manual | Como funciona |
|-----|----------------|---------------|
| Candidatos | "Importar do Pandapé" → menu (planilha / PDF / manual) + botão "Novo candidato" | Planilha Excel/CSV lida no navegador (SheetJS CDN) → mapeamento de colunas com palpite automático + salvo em localStorage → preview → `POST /api/contacts?action=import-bulk` (dedupe por telefone normalizado/e-mail, merge só de campos vazios, lote ≤300) |
| Vagas | "Importar planilha" + "Colar texto da vaga" + campo Nº do processo no modal | Planilha → `POST /api/vacancies?action=import-bulk` (dedupe por processo_numero ou título+empresa, status normalizado aberta/fechada, ≤200). Texto colado → `action=import-text` (OpenAI estrutura) → pré-preenche o modal Nova Vaga para revisão |
| Gerador | Seletor de vaga cadastrada acima do campo livre + PDF original arquivado | `comp-vaga-select` populado de vacancies; PDF ≤3MB vai em base64 junto do import e fica no bucket `rhf-cvs/pandape/` (raw_data.pdf_import.file_url) |
| Dashboard | Card "Central Pandapé" | Atalhos para os 4 fluxos + indicador de frescor (última importação, contagem por origem) |

- Migration 007 aplicada: `candidates.source`, `vacancies.processo_numero`, `vacancies.source`
- Continuamos em 10/12 funções (tudo via actions em handlers existentes; parsing de planilha é client-side)
- E2E produção 09/07: candidatos (insert/dedupe/merge/invalid ✅), vagas (dedupe por processo + status normalizado ✅), import-text (extração perfeita ✅) — registros de teste removidos

---

## CORREÇÃO DE ROTA — Checkpoint do cliente 10/07 (IMPLEMENTADO E DEPLOYADO 10/07)

Feedback do Rodrigo (amostras reais em `~/Downloads/rhf att/` — 3 pares PDF bruto Pandapé → CV pronto RHF):
1. **Não existe planilha** — o processo é exclusivamente via PDF do Pandapé.
2. **CV NUNCA vai para conversa** — entrega é SÓ no módulo **Arquivos** do ChatGuru (lá a equipe organiza por tags).

O que mudou (tudo em produção):
- **Removido**: importação por planilha (UI candidatos/vagas/central — endpoints `import-bulk` ficam dormentes; "Novo candidato" manual continua usando o de contacts), modal "Enviar no Chat", envio de texto/arquivo para conversa, ação `upload-chatguru`, `formatCVAsWhatsApp`, SheetJS.
- **Novo fluxo de entrega**: botão "Preparar arquivo (ChatGuru)" → PDF final nomeado no padrão real `Nome - Vaga - Cidade-UF.pdf` → bucket `rhf-cvs/prontos/` → `sent_status='preparado'` → painel "Entrega — ChatGuru > Arquivos" na aba Gerador (Baixar via blob com nome certo + "Marcar como disponibilizado" → `sent_status='chatguru_arquivo'` + `sent_at`, com Desfazer). Ações novas: `cv?action=prepare-file` e `mark-delivered`.
- **Extração calibrada com os PDFs reais**: schema agora captura `processo_numero` (o PDF traz "Vaga atual: #1164 - ..."!), `etapa` do funil, `vacancy_title`/`vacancy_city` separados, `summary` (Resumo bruto) e pretensão em faixa ("Entre R$ 700 e R$ 1.200" → texto no prefill + primeiro valor numérico no banco).
- **Reescrita com IA no padrão RHF** (`gpt-4o-mini-rewrite` em `model_used`): resumo profissional reescrito + experiências em bullets ("Atendimento de...;"), estilo calibrado pelos pares reais bruto→pronto. Falha da IA nunca bloqueia (fallback = template). cv-print: seção "Resumo" → "Resumo Profissional".
- **Bugs corrigidos no caminho**: `SUPABASE_URL` no Vercel tem newline no fim → `cleanEnv()` em lib/supabase.js; chaves de storage com espaço → URL pública gravada com `encodeURI`. (Proxy Cloudfy bloqueia user-agent `Python-urllib` — browsers ok.)
- **E2E 10/07 com o PDF REAL do Jonathan**: import (processo 1164 + etapa Apresentação + 7 experiências ✅) → geração com IA (resumo idêntico em estilo ao CV pronto real ✅) → prepare-file (URL pública ok ✅) → mark-delivered/undo ✅. O CV do Jonathan ficou na fila como demonstração.

**Spike módulo Arquivos (Bloco C):** 10 nomes prováveis de ação testados na API s18 (file_upload, archive_add, media_upload...) — TODOS "ação inválida". Caminhos restantes: (a) Rodrigo pedir a doc ao suporte ChatGuru (ele se ofereceu na call de 03/07); (b) inspecionar via DevTools a requisição de upload do painel web com o login do Tiago. Se surgir endpoint, o "Preparar" passa a subir direto e o passo manual morre.

**PENDENTE:** resposta do ChatGuru sobre API de Arquivos; validação do Rodrigo no fluxo novo (importar PDF → gerar → preparar → subir no Arquivos).

---

## FASE 2 — IMPLEMENTADA E DEPLOYADA 10/07 (grupos, resumo→grupo, dashboard/SLA)

- **Migration 008 aplicada**: tabela `chatguru_groups` (chat_number único, name, empresa, processo_numero, contato, status ativo/inativo, tags, raw, source webhook/manual, last_message_at).
- **Grupos**: coleta automática pelo webhook (mensagem de grupo detectada por nome_grupo/@g.us/id≥15 dígitos → upsert em chatguru_groups e NÃO vira candidato) + cadastro manual no modal. `whatsapp?action=groups | group-upsert | group-delete` (delete é soft → status inativo).
- **Resumo → grupo** (aposenta a planilha do Rodrigo): botão "Apresentar no grupo" na fila de entrega (estado 2/3) e "Resumo p/ grupo" nas ações do CV → modal com seletor de grupo (+cadastro inline), texto gerado pela IA (`whatsapp?action=summary` — nome em negrito, vaga sem nº do processo, pontos fortes, pretensão; proibido inventar/"a combinar") **editável** → `send-summary` envia via ChatGuru e grava `sent_status='apresentado'` + `presented_at` + `client_company` (abre o SLA). Falha no ChatGuru não toca o CV.
- **SLA fecha com "Cliente respondeu"**: `cv?action=mark-response` (com desfazer) — na fila (estado 3/3) e no painel de métricas.
- **Fila de entrega agora em 3 estágios**: 1/3 preparado → 2/3 no ChatGuru>Arquivos → 3/3 apresentado (aguardando resposta com contagem de dias / respondido).
- **`api/metrics.js` (11/12 funções)**: `action=dashboard&days=90` → funil (gerados→preparados→disponibilizados→apresentados→respondidos), SLA médio vs referência 13,5d, CVs por recrutador, apresentados por empresa, aguardando resposta (top 20 por dias), processos desatualizados (>7d sem atualização). Painel "Acompanhamento de apresentações" no Dashboard consome tudo.
- **E2E produção 10/07**: grupo manual criado/listado ✅; resumo IA do CV real do Jonathan perfeito ✅; send-summary para grupo fake → erro do ChatGuru sem tocar o CV ✅; mark-response set/undo ✅; metrics com funil real e atribuição por recrutador ✅; grupo fake removido (soft).
- **PENDENTE (teste conjunto Moroni+Rodrigo)**: cadastrar um grupo real (número do grupo no ChatGuru) e enviar um resumo de verdade; primeira mensagem de grupo real via webhook para validar a coleta automática.

---

## 1. Estado atual (o que o plano precisa respeitar)

**Limite de 12 funções Vercel Hobby — hoje estamos em 12/12:**

| # | Função | Situação pós-plano |
|---|--------|--------------------|
| 1 | `api/ai-log.js` | mantém |
| 2 | `api/auth.js` | mantém |
| 3 | `api/contacts.js` | mantém (usada pela aba Candidatos do mvp) |
| 4 | `api/cv.js` | mantém + ganha `action=import-pdf` |
| 5 | `api/messages.js` | **REMOVER** (morta — nenhuma página referencia; chat.html usava `/api/whatsapp?action=messages`) |
| 6 | `api/vacancies.js` | mantém |
| 7 | `api/whatsapp.js` | **REESCREVER** → hub ChatGuru (groups/tags/summary) |
| 8 | `api/webhook/chatguru.js` | mantém (coletor de dados p/ CV e métricas) |
| 9 | `api/webhook/meta.js` | **REMOVER** (fonte das "conversas via Meta direto" — item Alta 1) |
| 10 | `api/webhook/pandape.js` | mantém |
| 11 | `api/pandape/matches.js` | mantém |
| 12 | `api/pandape/sync.js` | mantém |
| +1 | `api/metrics.js` (novo, Fase 2) | agregações do dashboard |

**Saldo final: 11/12 funções (1 slot de reserva para Kanban/Pandapé futuro).**

Pontos técnicos relevantes:
- Claude Haiku já está integrado (`api/whatsapp.js` action=suggest, `ANTHROPIC_API_KEY` em produção) → reutilizar o padrão para extração de PDF e geração de resumo.
- O envio atual de CV pro ChatGuru manda TEXTO formatado (`message_send`); `file_send` para chat retornou "ação inválida" no teste de junho.
- `generated_cvs.vacancy_id` é `bigint` (ID Pandapé) e NÃO referencia a tabela interna `vacancies` (uuid). O join real hoje é por `vacancy_name` texto — corrigir na Fase 2.
- `generated_cvs` não tem `created_by` → métrica "currículos por recrutador" exige nova coluna (quanto antes ela existir, antes o histórico acumula).
- `rhf_messages` (alimentada pelo webhook ChatGuru) é insumo do gerador de CV ("dados da conversa") — o que sai é a UI de conversas, NÃO o pipeline de dados.

---

## 2. FASE 1 — 🔴 Prioridade Alta (destravar uso imediato do Rodrigo)

### 1.1 Remover módulo de Conversas
O que sai:
- `chat.html` (página inteira) + rewrite `/chat` no `vercel.json`
- Item "Conversas" da sidebar do `mvp.html` (~linha 552)
- Card "Conversas WhatsApp" do dashboard (substituir por métrica real, ex.: "CVs esta semana")
- `api/messages.js` (morta) e `api/webhook/meta.js` (Meta direto)
- Limpeza posterior de env vars Meta (`META_VERIFY_TOKEN` etc.) — devops, sem pressa

O que FICA (não confundir):
- `api/webhook/chatguru.js` + tabela `rhf_messages` — continuam alimentando o resumo de conversa usado na geração do CV e serão os coletores das métricas da Fase 2.

Ganho: libera 2 slots de função. Fazer PRIMEIRO.

### 1.2 Spike técnico — API do repositório de Arquivos do ChatGuru (bloqueia 1.4)
Pergunta a responder com a conta real (s18.chatguru.app / Ras Consultoria):
1. A API expõe upload para o módulo **Arquivos** (repositório) com tags? (a doc pública conhecida cobre `message_send`, `chat_add`, `note_add`, `dialog_execute` — repositório de arquivos não é documentado)
2. Retestar `file_send` com variações de parâmetros (o erro de junho pode ter sido formato, não ausência da ação)
3. Como as tags de arquivo aparecem/são graváveis via API

Fallbacks em ordem de preferência se a API não expuser o repositório:
- a) Enviar o PDF como documento para um chat/grupo "Repositório RHF" dedicado (arquivos enviados pela plataforma aparecem no módulo de mídias)
- b) Ticket com o suporte ChatGuru pedindo endpoint de arquivos
- c) Manter texto formatado + PDF por e-mail enquanto isso

### 1.3 Upload manual de currículo (PDF do Pandapé)
Fluxo: Rodrigo baixa o PDF pré-formatado do Pandapé → sobe na aba "Gerador de Currículo" → sistema combina dados do PDF + conversa do ChatGuru → CV padrão RHF.

Implementação:
- **Front (`mvp.html`, aba `tab-curriculo`)**: novo card `cv-source` "PDF do Pandapé (upload manual)" ao lado de "Dados do Pandapé" e "Conversa do ChatGuru". Extração de texto **client-side com pdf.js** (CDN, mesmo espírito do processamento de foto no browser — não gasta função nem payload gigante).
- **Back (`api/cv.js`)**: novo `action=import-pdf` → recebe `{ pdf_text, candidate_phone?, vacancy_name? }` → Claude Haiku estrutura o texto em campos (nome, contato, experiências, formação, competências, idiomas) → upsert em `candidates` → segue o `handleGenerate` existente mesclando `rhf_messages` do telefone.
- Validar com 3–5 PDFs reais do Rodrigo antes de considerar pronto.
- `model_used` passa a registrar `haiku-import-pdf` para rastreio.

### 1.4 Botão "Enviar no Chat" → "Enviar para arquivos do ChatGuru"
- Gerar **PDF real** do CV client-side a partir do layout do `cv-print.html` (html2pdf.js) → base64 → `api/cv.js action=upload-chatguru` (a assinatura já prevê `file_base64`/`file_name`, hoje ignorados).
- Destino conforme resultado do spike 1.2 (repositório com tags OU fallback a).
- Nomenclatura do arquivo: `CV - {candidato} - {processo}.pdf` (casa com a organização por tags do Rodrigo).
- Registrar o envio em `generated_cvs` (novas colunas `sent_status`, `sent_at` — ver migration).
- O modal de seleção de conversa pode continuar existindo como opção secundária ("enviar texto no chat") se o Rodrigo quiser manter.

**Entrega Fase 1: deploy `vercel --prod` + E2E com o Rodrigo (upload PDF real → CV → arquivo no ChatGuru).**

---

## 3. FASE 2 — 🟡 Prioridade Média (base para dashboard e métricas)

### 2.1 Migration 006 (fazer no início da fase — histórico começa a acumular)
```sql
-- generated_cvs: rastreio de recrutador e ciclo de envio/apresentação
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS created_by_id uuid;
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS created_by_name text;
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS vacancy_ref uuid REFERENCES vacancies(id);
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS client_company text;
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS sent_status text DEFAULT 'rascunho';  -- rascunho|email|chatguru_arquivo|apresentado
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS sent_at timestamptz;
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS presented_at timestamptz;              -- data de apresentação (base do SLA)
ALTER TABLE generated_cvs ADD COLUMN IF NOT EXISTS client_response_at timestamptz;        -- resposta do cliente (fecha o SLA)

-- vacancies: última atualização por processo
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- grupos WhatsApp sincronizados do ChatGuru (número do Rodrigo, sem 1:1)
CREATE TABLE IF NOT EXISTS chatguru_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_number text UNIQUE NOT NULL,
  name text,
  processo_numero text,
  processo_nome text,
  empresa text,
  contato text,
  status text,
  tags jsonb DEFAULT '[]',
  raw jsonb,
  last_synced_at timestamptz DEFAULT now()
);
```
Aplicar via `scripts/apply-migration.js` (hook de SQL bloqueia DDL inline — lição de 01/07).

### 2.2 Sincronizar grupos do WhatsApp (sem conversas 1:1)
- Reescrever `api/whatsapp.js` como hub ChatGuru: `action=sync-groups` (chat_list → filtra grupos → upsert `chatguru_groups` com número/nome do processo, empresa, contato, status e tags), `action=list-groups`, `action=group-tags`.
- Doc do ChatGuru já foi consultada pelo time na reunião ("tranquila de integrar").
- Disparo: botão "Sincronizar" na UI + cron diário do Vercel (`vercel.json` → `crons`, Hobby permite 1 job/dia).

### 2.3 Leitura de tags (conversas + módulo arquivos)
- Tags de conversa/grupo: entram no sync 2.2 (`chat_info`/`chat_list`).
- Tags de arquivo: depende do resultado do spike 1.2 — se houver API, coletar junto; senão, o SLA se apoia nas tags de grupo + `presented_at` registrado pela plataforma.
- Convenção de tags a ALINHAR COM O RODRIGO: qual tag significa "cliente respondeu" / "aprovado" / "reprovado" — sem essa disciplina o SLA automático não fecha.

### 2.4 Botão "Gerar resumo e enviar para grupo do WhatsApp"
Substitui o fluxo manual planilha → resumo → grupo do cliente.
- Na tela do CV gerado (e na aba Candidatos): botão "Resumo p/ grupo".
- Gera resumo do candidato via Claude (mesmo padrão do `suggest`): nome, vaga/processo, empresa, pontos fortes, pretensão, disponibilidade.
- Modal com preview EDITÁVEL do resumo + seletor de grupo (de `chatguru_groups`).
- Envio via `message_send` para o `chat_number` do grupo → grava `presented_at` + `sent_status='apresentado'` + `client_company` no CV → é isso que alimenta o SLA.

### 2.5 Dashboard de acompanhamento (`api/metrics.js` + rework do dashboard)
Nova função `api/metrics.js` (`action=dashboard`) com agregações:
- **Currículos por recrutador** (`created_by_name`, período selecionável)
- **Currículos por empresa/processo** (`client_company` / `vacancy_ref`→`vacancies`)
- **Funil de envio**: gerados → enviados (arquivo/email) → apresentados → respondidos
- **SLA de resposta do cliente**: média `client_response_at - presented_at` (referência atual do Rodrigo: 13,5 dias, calculado à mão)
- **Última atualização por processo**: `vacancies.updated_at` + último CV/tag do processo → flag "atual" x "desatualizado" (> X dias)
Front: substituir os painéis estáticos do `tab-dashboard` pelos dados reais (o gráfico de 8 semanas real já existe — mantém).

**Meta da Fase 2: aposentar a planilha/pivot do Rodrigo.**

---

## 4. FASE 3 — 🔵 Futuro / dependência externa (não bloqueia nada)

1. **API Pandapé direta** — em negociação (custo x patrocínio da matriz). `lib/pandape.js` (OAuth2) está pronto desde junho; só faltam `PANDAPE_CLIENT_ID`/`SECRET`. Enquanto isso o fluxo é o upload manual de PDF (Fase 1.3) — que continua útil mesmo com a API depois.
2. **Kanban de status dos currículos enviados** — colunas a partir de `sent_status` + tags coletadas na Fase 2. Usa o slot de função reservado (ou action no `metrics.js`). Só faz sentido DEPOIS que os coletores de tags estiverem rodando.

---

## 5. Riscos e pontos de atenção

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| API do ChatGuru não expõe o repositório de Arquivos | Alta 1.4 muda de desenho | Spike ANTES de codar; fallback grupo-repositório; ticket suporte |
| Variação de layout no PDF do Pandapé | Extração falha | Extração via Claude (robusta) + validação com PDFs reais + preview editável antes de gerar |
| SLA depende de tag de "resposta do cliente" | Métrica não fecha sozinha | Alinhar convenção de tags com o Rodrigo na entrega da Fase 1 |
| Grupos sem padrão de nome (processo/empresa) | Sync com campos vazios | Parser tolerante + edição manual dos campos na UI |
| Limite 12 funções | Bloqueia endpoint novo | Remoções da Fase 1 primeiro (12→10); plano fecha em 11/12 |
| Deploy em preview perde env vars | Plataforma "quebra" | SEMPRE `vercel --prod` + alias (lição 01/07) |

## 6. Ordem de execução e estimativa

| Passo | Item | Esforço |
|-------|------|---------|
| 1 | Remover conversas (chat.html, messages.js, webhook/meta.js, nav, vercel.json) | 0,5 dia |
| 2 | Spike ChatGuru Arquivos | 0,5 dia |
| 3 | Upload PDF + import-pdf com IA | 1 dia |
| 4 | Envio p/ arquivos ChatGuru (PDF real) | 0,5–1 dia (conforme spike) |
| — | **Deploy Fase 1 + E2E com Rodrigo** | — |
| 5 | Migration 006 + created_by no generate | 0,5 dia |
| 6 | Hub ChatGuru: sync grupos + tags | 1 dia |
| 7 | Resumo → grupo (IA + modal + presented_at) | 1 dia |
| 8 | metrics.js + dashboard real | 1–1,5 dia |
| — | **Deploy Fase 2 + validação da planilha aposentada** | — |

Total: ~3 dias úteis (Fase 1) + ~4 dias úteis (Fase 2).

## CHECKPOINT 10/07 "Novos Ajustes" — IMPLEMENTADO 13/07 (commits 2c25fbb4 + 158d686f)

Fonte: `~/Downloads/Checkpoint (RHF) - 1007 - Novos Ajustes.pdf` (11 itens).

| # | Item do cliente | Entrega |
|---|-----------------|---------|
| 1/6 | Bug "getCvPdfBase64 is not defined" + card confuso | CAUSA RAIZ: a função foi cortada junto com o bloco do chat na limpeza de 10/07 — restaurada; "Preparar arquivo" funcionando de novo. Upload DIRETO no módulo Arquivos segue dependente da API (spike negativo 2×; ticket suporte via Rodrigo / DevTools com Tiago) |
| 2 | Candidatos fake | Removidos do banco: Eduarda Kern, Ermeson, Moroni Reis + Ananda (mesmo lote de maio) com 14 CVs e 39 mensagens de teste — só o Jonathan (amostra real) ficou |
| 3 | Card "Conversa do ChatGuru" | Removido (pipeline de dados por trás continua) |
| 4 | Card "Status da fila" (Aguardando Pandapé) | Removido — Pandapé em standby |
| 5 | Botão "Resumo p/ grupo" | Removido da UI (backend send-summary pronto e desligado até o Rodrigo desenhar o fluxo) |
| 6b | Fila pouco clara | Copy autoexplicativa: Passo 1 Baixar · Passo 2 Subir no ChatGuru>Arquivos com tags · Passo 3 Marcar concluído |
| 7 | Menu enxuto | Nav: Dashboard, Gerador de CV, **Funil de Vagas** (Vagas/Candidatos saem como itens) |
| 9 | Funil de vagas | Aba nova: pipeline 5 etapas (Triagem → CV gerado → No ChatGuru → Apresentado → Respondido), cards com dias na etapa + badge etapa Pandapé, filtro por vaga, clique abre no Gerador; Nova Vaga/Colar texto/Novo candidato consolidados aqui |
| 10 | Dashboard real | Mocks finais mortos ('147 no funil' etc); painel de acompanhamento (funil/SLA/recrutador/empresa/processos desatualizados) já existia da Fase 2 |
| 11 | Design do Marpe | Liquid Glass v2 portado (tokens dark + materiais glass + orbs + a11y) com acento laranja RHF em mvp/configuracoes/admin/login; cv-print intocado |
| 8 | Tags do ChatGuru | DEPENDÊNCIA EXTERNA: payloads no banco são da era Meta (sem tags); precisa de webhook ChatGuru real disparado (teste conjunto) OU doc do suporte — mesmo ticket do módulo Arquivos |

Estratégico: Pandapé em standby (zero investimento na integração); ChatGuru é a fonte primária.
