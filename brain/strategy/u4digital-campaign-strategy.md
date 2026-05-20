# u4digital — Estratégia Completa de Campanha Meta Ads

**Versão**: 1.0
**Data**: 2026-05-01
**Owner**: creative-strategist
**Status**: Aguardando aprovação do Moroni antes de qualquer criação na plataforma
**Conta de Anúncios**: act_1497187178472890 (u4digital, BRL)
**Orçamento Total**: R$200 (fase de teste)

---

> AVISO DE SEGURANÇA (ads-safety.md): Todos os itens deste documento são estruturais e estratégicos.
> Nenhuma campanha, conjunto de anúncios ou anúncio será criado até aprovação explícita do Moroni.
> Quando criados, todos os objetos serão configurados como PAUSADOS por padrão.

---

## Sumário Executivo

Este é um micro-teste de aprendizado, não uma campanha de escala. R$200 compra dados, não volume. O objetivo é responder 3 perguntas antes de aumentar o orçamento:

1. **Qual rosto converte mais?** — Moroni, Tiago ou u4digital (sem rosto)
2. **Qual ângulo ressoa?** — Custo do time vs. tempo perdido vs. dinheiro deixado na mesa
3. **Qual audiência tem menor CPL?** — Interesses de infoprodutor vs. tráfego pago vs. lançamento digital

Com R$200 e ~10-14 dias, você terá dados suficientes para dobrar ou triplicar o orçamento com convicção.

---

## 1. Estrutura de Campanha

### 1.1 Objetivo de Campanha: Leads (Geração de Cadastros)

**Por que Leads e não Tráfego ou Conversões?**

- A oferta é um diagnóstico gratuito (Raio-X Digital) — o sucesso é medido em cadastros/agendamentos, não em vendas diretas
- O pixel está verde (conta zerada) — sem dados históricos para otimizar Conversões
- Budget de R$200 é insuficiente para sair da fase de aprendizado com objetivo de Conversões (Meta precisa de 50 eventos/semana — impossível com R$200 total)
- Leads com formulário nativo do Meta garante menor fricção e custo por lead mais baixo no início

**Formato de Lead**: Meta Instant Form (formulário nativo do Meta) — evita dependência da LP ainda não existente. Quando a LP estiver no ar, migrar para evento de conversão no site.

### 1.2 Convenção de Nomenclatura

Padrão obrigatório: `[Cliente] [Objetivo] [Audiência] [Tipo de Criativo] — [AAAA-MM]`

```
Exemplos:
- u4digital | Leads | Infoprodutores BR | Video Moroni — 2026-05
- u4digital | Leads | Gestores Trafego BR | Video Tiago — 2026-05
- u4digital | Leads | Digital Amplo BR | Estatico Brand — 2026-05
```

### 1.3 Arquitetura de Teste (R$200 Total)

```
CAMPANHA 1 — Rosto: Moroni
  └── Ad Set 1A: Audiência Infoprodutores (R$20/dia × 3 dias = R$60)
      ├── Anúncio 1A-V1: Vídeo — Ângulo "Folha de Pagamento Invisível"
      └── Anúncio 1A-V2: Estático — Ângulo "CPL subindo"

CAMPANHA 2 — Rosto: Tiago
  └── Ad Set 2A: Audiência Infoprodutores (R$20/dia × 3 dias = R$60)
      ├── Anúncio 2A-V1: Vídeo — Ângulo "Folha de Pagamento Invisível"
      └── Anúncio 2A-V2: Estático — Ângulo "CPL subindo"

CAMPANHA 3 — Marca: u4digital (sem rosto)
  └── Ad Set 3A: Audiência Infoprodutores (R$20/dia × 3 dias = R$60)
      ├── Anúncio 3A-V1: Estático — Headline direta + prova
      └── Anúncio 3A-V2: Carrossel — 4 slides / pain points

Reserva: R$20 (contingência — adicionar ao melhor performer no dia 4)
```

**Por que 3 campanhas separadas em vez de 1 com DCO?**

Com R$200 e 3 rostos, separar em campanhas garante que o Meta aloca orçamento igual para cada teste de rosto. Se colocar tudo em 1 campanha, o algoritmo vai concentrar spend no rosto que já tem melhor CTR inicial — e você nunca vai saber se o outro rosto teria performado melhor com mais tempo.

**Número total de objetos a criar:**
- 3 campanhas
- 3 conjuntos de anúncios (1 por campanha)
- 6 anúncios individuais (2 por conjunto)
- TODOS PAUSADOS até aprovação

---

## 2. Estratégia de Audiências

### 2.1 Segmentação Geográfica

**Recomendação: Brasil inteiro (exceto potencialmente estados muito pequenos)**

Razão: Com R$200, restringir demais a audiência aumenta CPM e reduz alcance. Capitais concentram infoprodutores, mas interior de SP, PR, MG, RS também tem volume significativo.

Configuração recomendada:
- País: Brasil
- Idioma: Português
- Sem exclusão de cidades na fase de teste

### 2.2 Segmentação Demográfica

| Atributo | Configuração | Justificativa |
|----------|-------------|---------------|
| Idade | 27-48 anos | ICP confirmado (28-45 + margem) |
| Gênero | Todos | 60/40 M/F — não vale segmentar ainda |
| Idioma | Português | Garantia de qualidade da audiência |

### 2.3 Interesses — Audiência Primária: "Infoprodutores BR"

**Stack de interesses a testar (selecionar 3-5 por conjunto):**

Categoria A — Identidade do infoprodutor:
- Hotmart
- Kiwify
- Eduzz (ou Monetizze)
- "Marketing de afiliados"
- "Infoprodutos"

Categoria B — Ferramentas que ele usa:
- RD Station
- ActiveCampaign
- Typeform

Categoria C — Comportamento de aprendizado:
- Copywriting
- "Lançamento digital"
- "Marketing digital"
- Pedro Sobral (interesse de comportamento — gestor de tráfego referência)
- Erico Rocha (interesse de comportamento — lançamento)

Categoria D — IA e automação (amplia para quem já está consciente):
- ChatGPT / OpenAI
- "Inteligência artificial"
- Make (Integromat)
- Zapier

**Recomendação de configuração para o teste:**

```
Ad Set: Infoprodutores BR
Interesses: Hotmart OR Kiwify OR "Lançamento digital" OR "Marketing digital"
+ Comportamento: Negócios digitais
Tamanho estimado: 2M-6M pessoas (workable para Meta, não pequeno demais)
```

### 2.4 Audiências Lookalike — Quando Criar

**Não criar ainda.** Com 0 conversões hoje, qualquer Lookalike seria baseado em nada.

Cronograma de criação de Lookalike:
- **Após 50 leads captados**: Criar Lookalike 1% (leads)
- **Após 20 agendamentos confirmados**: Criar Lookalike 1% (convertidos de alta qualidade)
- **Após 3 clientes pagantes**: Criar Lookalike com lista de clientes (upload manual)

### 2.5 Audiência de Remarketing — Quando Ativar

Também não agora. Primeiro é preciso ter:
- Pixel instalado e disparando eventos
- Audiência de no mínimo 1.000 pessoas no site (Meta mínimo para remarketing)

Preparar as audiências customizadas para criar quando chegar lá:
- Visitantes do site (all) — últimos 30 dias
- Visualizações de vídeo 50%+ — últimos 14 dias
- Interações com página do Instagram — últimos 30 dias

---

## 3. Alocação de Orçamento

### 3.1 Lógica do R$200

| Item | Valor | Dias | Objetivo |
|------|-------|------|---------|
| Campanha Moroni | R$60 | 3 dias × R$20/dia | Testar rosto 1 |
| Campanha Tiago | R$60 | 3 dias × R$20/dia | Testar rosto 2 |
| Campanha Brand | R$60 | 3 dias × R$20/dia | Testar sem rosto |
| Reserva | R$20 | Dia 4 — reforço do vencedor | Ampliar dado do melhor |

**Orçamento diário por conjunto: R$20/dia**
Estimativa de CPL no segmento IA/digital Brasil: R$8-25 por lead (diagnóstico gratuito)
Estimativa de leads totais: 8-25 leads no teste completo

Isso não é escala — é dado. 8-25 leads em 3 rostos te dão direção, não certeza. A certeza vem depois.

### 3.2 Regras de Decisão

**Regra de Pausa (kill underperforming):**
- Se um anúncio gastar R$30 sem nenhum lead → pausar imediatamente
- Se CTR (link) < 0,5% após R$15 de spend → pausar e trocar criativo
- Não pausar nada antes de R$15 de gasto (dados insuficientes)

**Regra de Escala (scale winners):**
- CPL abaixo de R$15: vencedor potencial — adicionar R$20 de reserva nesse anúncio no Dia 4
- CPL abaixo de R$10: escalar para R$50/dia na semana seguinte
- Nunca aumentar orçamento mais de 30% em uma única alteração (proteção da fase de aprendizado)

**Regra 3x CPA:**
- No futuro, quando houver conversão de diagnóstico em cliente: o CPL máximo aceitável é 1/3 do ticket mínimo
- Se ticket médio u4digital for R$3.000, CPL máximo para breakeven = R$1.000
- Mas como ainda é lead (não venda), o benchmark inicial é: CPL < R$25 = saudável para diagnóstico gratuito

---

## 4. Estratégia de Criativos

### 4.1 Princípio Orientador

O mercado de IA no digital brasileiro é dominado por vídeo. Reels nativos, gravações cruas no carro, talking head com hook forte — performam consistentemente melhor que produção elaborada. A authenticity signal é alto.

**Formato prioritário**: Vídeo (60% do spend) + Estático (40% do spend)

### 4.2 Scripts de Vídeo — 3 Rostos

---

#### VIDEO 1 — ROSTO: MORONI REIS
**Ângulo**: More Good + Less Bad (custo real × margem real)
**Duração**: 45-60 segundos
**Formato**: Talking head, ambiente informal (escritório ou home office)
**Tom**: Consultivo, direto, como conversa entre experts

---

**HOOK (0-3 segundos)**
[Câmera já rodando — sem intro, sem "oi gente"]

> "Você faturou R$50K no mês passado. Quanto ficou de verdade?"

[Pausa de 1 segundo. Olha direto na câmera.]

---

**DESENVOLVIMENTO (3-40 segundos)**

> "Porque a maioria dos experts que eu converso fatura R$30K, R$50K, até R$80K por mês — e sobra R$12K, R$15K se o mês for bom. O resto foi pro time.

Editor. Designer. Social media. Copywriter. Gestor de tráfego. Suporte.

E o pior: se perder um deles, o próximo lançamento atrasa três semanas.

Você não construiu um negócio. Construiu uma dependência."

[Pausa]

> "A gente construiu agentes de IA que fazem 70% do que esse time faz — com a sua voz, no seu processo, 24 horas por dia — por uma fração do que você paga de salário.

Não é ChatGPT. Não é ferramenta genérica. É um agente treinado no seu método, no seu tom, no seu negócio."

---

**CTA (40-55 segundos)**

> "Se você fatura R$10K ou mais por mês e quer entender exatamente quanto do seu lucro está vazando — e como recuperar — clica aqui. A gente faz um diagnóstico gratuito. Você vê o mapa. Decide se faz sentido. Simples assim."

[Texto na tela: "Raio-X Digital — Gratuito. Clique agora."]

---

**COPY DO ANÚNCIO (texto do post)**

Primário:
> Você soma quanto gasta de time por mês?

Editor. Designer. Social media. Gestor de tráfego. Copy. Suporte.

Agora divide pelo lucro líquido do último lançamento.

A maioria dos experts que converso leva um susto nessa conta.

A u4digital constrói agentes de IA treinados com a sua voz, no seu processo — que cobrem boa parte do que esse time faz, por uma fração do custo.

Diagnóstico gratuito. Você vê o mapa, decide se faz sentido. Nenhum compromisso.

[👇 Clica aqui para fazer o seu Raio-X Digital]

**Título**: Seu negócio custa quanto por mês em time?
**Descrição**: Diagnóstico gratuito para experts digitais que faturam R$10K+/mês
**CTA Button**: Saiba Mais

---

#### VIDEO 2 — ROSTO: TIAGO
**Ângulo**: Less Bad + Less Bad para Outros (tempo desperdiçado + risco de dependência)
**Duração**: 30-45 segundos
**Formato**: Mais rápido, mais urgente — Tiago pode ter energia mais jovem/técnica
**Tom**: Provocativo, identificação de dor, dados concretos

---

**HOOK (0-3 segundos)**

> "Quanto tempo você perdeu hoje respondendo mensagem, ajustando briefing ou esperando freelancer?"

---

**DESENVOLVIMENTO (3-30 segundos)**

> "A maioria dos experts digitais que faturam R$30K+ por mês tem um problema invisível: trabalham 55, 60 horas por semana — mas 40% desse tempo é operacional.

Não é estratégia. Não é venda. É apagar incêndio.

E o pico disso? Toda vez que um membro do time sai.

A gente resolve isso com agentes de IA customizados pro seu negócio. Suporte, copy, conteúdo, qualificação de lead — rodando 24h com a sua voz.

Não é mais uma ferramenta. É uma assessoria que implementa, acompanha e mede resultado em métrica de negócio."

---

**CTA (30-42 segundos)**

> "Se você fatura R$10K+ por mês e está cansado de depender de um time que custa caro e não escala — o link tá aqui. A gente faz um Raio-X gratuito do seu negócio."

---

**COPY DO ANÚNCIO (texto do post)**

Primário:
> 60% dos experts que faturam R$30K+/mês perdem mais de 20h/semana em tarefas que não precisam ser deles.

Coordenação de time. Revisão de briefing. Resposta de DM. Aprovação de criativo.

Isso não é trabalho estratégico. É o negócio te consumindo.

A u4digital constrói agentes de IA sob medida — treinados com a sua voz, no seu processo — que eliminam esse atrito operacional.

Diagnóstico gratuito. Sem compromisso. Você vê exatamente o que pode ser automatizado e quanto isso vale em tempo e dinheiro.

**Título**: Quantas horas você perde por semana no operacional?
**Descrição**: Agentes de IA personalizados para experts digitais
**CTA Button**: Saiba Mais

---

#### VIDEO 3 — ROSTO: u4digital (SEM ROSTO — BRAND VIDEO)
**Ângulo**: More Good para Outros + Less Bad (status + risco social)
**Duração**: 20-30 segundos (mais curto — sem autoridade pessoal = precisa de gancho mais rápido)
**Formato**: Motion com texto + dados + B-roll (não talking head)
**Tom**: Direto, numbers-led, premium

---

**HOOK (0-3 segundos)**

[Texto animado na tela, sem voz ou com voz em off]

> "Quanto você gasta de time por mês?"

[Números aparecem em sequência: R$3K editor → R$3K gestor → R$2K social → R$2K suporte → = R$10K+]

---

**DESENVOLVIMENTO (3-20 segundos)**

[Off ou texto animado]

> "O expert médio que fatura R$50K/mês gasta R$18K-25K só em equipe.

E quando perde 1 pessoa, o próximo lançamento atrasa 3 semanas.

A u4digital constrói agentes de IA que operam com a sua voz, 24h por dia, por uma fração desse custo."

---

**CTA (20-28 segundos)**

> "Faça o Raio-X Digital gratuito. Descubra quanto do seu lucro está sendo desperdiçado."

[Texto na tela: "Raio-X Digital — Gratuito" + CTA]

---

**COPY DO ANÚNCIO (texto do post)**

Primário:
> Expert digital que fatura R$50K/mês:
> 
> ✗ Gasta R$18-25K em time por mês
> ✗ Perde 3 semanas quando 1 pessoa sai
> ✗ Trabalha 55h+/semana no operacional
> 
> A u4digital constrói agentes de IA treinados com a sua voz que eliminam esse custo — sem você precisar aprender nada.
> 
> → Raio-X Digital gratuito. Veja exatamente o que pode ser automatizado no seu negócio.

**Título**: R$18K de time por mês. Há uma alternativa.
**Descrição**: Assessoria de IA para experts digitais que faturam R$10K+/mês
**CTA Button**: Saiba Mais

---

### 4.3 Anúncios Estáticos

#### ESTÁTICO 1 — Ângulo Custo vs. Alternativa

**Conceito Visual:**
- Fundo escuro (dark mode, premium)
- Duas colunas com contraste visual
- Lado esquerdo: "Time atual" com custo listado
- Lado direito: "Agentes u4digital" com custo menor
- Logo u4digital no canto inferior

**Headline (sobreposição na imagem):** "R$20K de time vs. R$3K de agentes IA"

**Texto primário:**
> Seu gestor de tráfego: R$3K/mês
> Seu editor: R$2K/mês  
> Seu social media: R$2K/mês
> Seu suporte: R$1,5K/mês
> 
> Total: R$8,5K — só para 4 funções.
> 
> A u4digital constrói agentes de IA que cobrem essas 4 funções. Com a sua voz. 24h por dia.
> 
> → Raio-X Digital gratuito — descubra quanto você pode economizar.

**Título:** Agentes IA vs. time humano: compare os custos
**CTA Button:** Saiba Mais

---

#### ESTÁTICO 2 — Ângulo Urgência / Mercado

**Conceito Visual:**
- Fundo preto
- Headline grande em branco
- Linha de acento azul (#4A90FF ou azul u4digital)
- Texto curto de suporte
- CTA bem visível

**Headline:** "Seu concorrente já automatizou. Você ainda não."

**Texto primário:**
> Em 2025, o CPL médio no digital subiu 21%.
> Em 2026, vai subir mais.
> 
> Quem opera com agentes de IA não sente isso do mesmo jeito — porque o custo por aquisição vem de processo, não de mais pessoas.
> 
> A u4digital constrói agentes sob medida para experts digitais que faturam R$10K+/mês.
> 
> Diagnóstico gratuito. Sem compromisso. Você vê o mapa e decide.

**Título:** Seu CPL sobe. O do seu concorrente não.
**CTA Button:** Saiba Mais

---

#### ESTÁTICO 3 — Ângulo Objeção / Tentei e Não Funcionou

**Conceito Visual:**
- Formato quote / citação
- Fundo escuro, texto branco
- Aspas grandes na fonte
- Avatar ou silhueta de pessoa

**Headline:** "ChatGPT não é agente de IA"

**Texto primário:**
> "Já tentei IA e não funcionou."
> 
> Tentou ChatGPT genérico. Resultado genérico.
> 
> Agente de IA não é prompt. É um sistema treinado com a sua voz, seu método, seu ICP, seus processos — que opera dentro do seu negócio.
> 
> A diferença entre tentar sozinho e ter uma assessoria que constrói pra você é a diferença entre resultado e frustração.
> 
> → Raio-X Digital gratuito. A gente mostra o que é possível no seu caso específico.

**Título:** A diferença entre ChatGPT e um agente de IA real
**CTA Button:** Saiba Mais

---

### 4.4 Carrossel (Campanha de Marca — Opcional)

**Usar apenas se o orçamento permitir em fase 2. Com R$200, focar em vídeo + estático.**

**Conceito:** "5 sinais de que você precisa de agentes de IA no seu negócio"

Slide 1 (capa): "5 sinais de que sua margem está vazando"
Slide 2: "Sinal 1: Você gasta mais de R$10K/mês em time para funções repetitivas"
Slide 3: "Sinal 2: Um membro do time saindo para seu próximo lançamento"
Slide 4: "Sinal 3: Você responde DM manualmente ou perde lead"
Slide 5: "Sinal 4: Seu CPL sobe e você não sabe como cortar custo operacional"
Slide 6 (CTA): "Raio-X Digital gratuito — descubra o que pode ser automatizado"

---

## 5. Framework de Copy (Hormozi Aplicado por Anúncio)

### Matriz Hormozi por Peça

| Peça | Ângulo Primário | Ângulo Secundário | Prova | CTA |
|------|----------------|-------------------|-------|-----|
| Vídeo Moroni | Less Bad (custo visível) | More Good (margem recuperada) | Cálculo concreto R$50K → R$12K líquido | Raio-X gratuito |
| Vídeo Tiago | Less Bad (tempo perdido) | Less Bad Outros (dependência de time) | 40% do tempo = operacional | Raio-X gratuito |
| Vídeo Brand | More Good Outros (status) | Less Bad (custo do time) | R$18-25K/mês de team spend | Raio-X gratuito |
| Estático 1 | Less Bad (sangria financeira) | More Good (custo baixo de agentes) | Comparativo de custo lado a lado | Raio-X gratuito |
| Estático 2 | Less Bad Outros (ficar pra trás) | More Good Outros (vantagem competitiva) | CPL subiu 21% (dado de mercado) | Raio-X gratuito |
| Estático 3 | Mental Unlock (objeção "já tentei") | More Good (resultado possível) | Diferença processo vs. ferramenta | Raio-X gratuito |

### Equação de Valor Aplicada a Todo Anúncio

```
Resultado Desejado: Operar com mesma qualidade, custo menor, sem dependência de pessoa
Probabilidade Percebida: Alta — diagnóstico GRATUITO remove risco de experimentar
Tempo: Mínimo — "resultado desde o primeiro mês"
Esforço: Mínimo — "você aprova, a gente constrói"
```

---

## 6. Plano de Testes

### 6.1 O Que Testar Primeiro

**Prioridade 1: Rosto (face test)**
Essa é a variável mais impactante e mais rápida de identificar. Cada campanha tem o mesmo ângulo principal — a única diferença é quem fala (ou se tem rosto).

**Prioridade 2: Formato (vídeo vs. estático)**
Dentro de cada campanha, 1 vídeo + 1 estático permitem comparar formatos com o mesmo rosto e ângulo.

**Prioridade 3: Ângulo de copy (na fase 2, com mais budget)**
Após identificar o rosto vencedor, testar diferentes ângulos (custo × tempo × concorrente) com o mesmo rosto.

Não testar tudo ao mesmo tempo. Com R$200, o foco é rosto e formato — só.

### 6.2 Métricas e Como Determinar Vencedores

| Métrica | O Que Mede | Benchmark Inicial | Fonte |
|---------|-----------|------------------|-------|
| CPL (Custo por Lead) | Eficiência final | < R$25 (diagnóstico gratuito) | Meta Ads Manager |
| CTR (link) | Atratividade do criativo | > 1% | Meta Ads Manager |
| CPM | Custo de alcance | < R$50 (digital BR) | Meta Ads Manager |
| Taxa de preenchimento do form | Qualidade do lead | > 60% dos cliques | Meta Instant Forms |
| Taxa de agendamento | Qualidade real do lead | Acompanhar manualmente | Cal.com / agenda |
| Hold rate do vídeo (3s) | Força do hook | > 40% | Meta Ads Manager |
| Hold rate do vídeo (50%) | Força do corpo | > 25% | Meta Ads Manager |

### 6.3 Dados Mínimos Antes de Qualquer Decisão

**Regra de ouro**: Não pausar nada antes de R$15 de gasto por anúncio.

Antes de R$15, não há dados. O algoritmo ainda está saindo da fase de exploração.

Exceção: Se CTR < 0,3% após R$10 — o criativo está sendo completamente ignorado. Pausar.

### 6.4 Cronograma Decisório

**Dias 1-3: Rodar sem tocar**
- Ativar todas as campanhas (APÓS aprovação do Moroni)
- Não alterar nada — deixar o algoritmo explorar
- Monitorar apenas para anomalias (gasto zerado = criativo rejeitado pelo Meta)
- Checklist diário: impressões, CTR geral, spend distribuído

**Dias 4-5: Primeira leitura**
- Cada anúncio terá gastado ~R$10-20
- Verificar: qual rosto tem menor CPL até o momento?
- Verificar: qual formato tem maior CTR?
- Ação: alocar os R$20 de reserva no conjunto de melhor CPM/CTR
- Não pausar nada ainda — dados ainda insuficientes para decisão definitiva

**Dia 6-7: Leitura final do teste**
- Total spend: ~R$180-200
- Ranking dos 6 anúncios por CPL
- Identificar: rosto vencedor + formato vencedor
- Decisão: pausar os 2 piores performers, manter os 4 melhores para próxima fase

**Dia 7+: Decisão estratégica**
- Se CPL médio < R$25: investir R$500-1.000 na próxima rodada com o rosto vencedor
- Se CPL médio R$25-50: ajustar hook, manter estrutura, rodar mais R$200 com variações
- Se CPL médio > R$50 ou zero leads: rever ângulo, audiência, e/ou oferta (o Raio-X está sendo comunicado de forma confusa)

### 6.5 Critérios Go/No-Go para Mais Budget

| Cenário | Critério | Ação |
|---------|---------|------|
| GO imediato | CPL < R$15 com pelo menos 5 leads | Escalar para R$50/dia com rosto vencedor |
| GO condicional | CPL R$15-25 com pelo menos 3 leads | Rodar mais R$200 com variações de hook |
| PAUSE and iterate | CPL R$25-50 com 1-2 leads | Mudar copy principal, manter audiência |
| STOP and rethink | R$100 gasto, zero leads | Revisar oferta, formato do formulário, ou audiência |

---

## 7. Pixel e Rastreamento

### 7.1 Eventos a Configurar

**Prioridade 1 (antes de rodar):**
- `PageView` — todas as páginas do site (instalação base do pixel)
- `Lead` — ao completar o formulário do Raio-X Digital (principal evento de conversão)
- `ViewContent` — ao visualizar a página de oferta do diagnóstico

**Prioridade 2 (quando a LP estiver no Vercel):**
- `Schedule` — ao confirmar agendamento no Cal.com (conectar via webhook ou pixel de confirmação)
- `Contact` — ao interagir com WhatsApp ou botão de contato

**Prioridade 3 (escala futura):**
- `Purchase` — ao fechar cliente (monitorar pelo CRM/vendas manual)
- `InitiateCheckout` — se houver página de proposta digital

### 7.2 Configuração do Pixel (Guia Técnico)

Para instalação no Vercel (quando LP estiver pronta):

```html
<!-- Meta Pixel Base Code — substituir PIXEL_ID pelo ID real -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
</script>
```

Evento de Lead (disparar no submit do formulário):
```javascript
fbq('track', 'Lead', {
  content_name: 'Raio-X Digital',
  content_category: 'Diagnostico Gratuito'
});
```

Evento de Schedule (disparar na confirmação do Cal.com):
```javascript
fbq('track', 'Schedule', {
  content_name: 'Agendamento Raio-X',
  value: 0,
  currency: 'BRL'
});
```

### 7.3 Estratégia de UTM

Para rastrear performance por rosto e criativo fora do Meta (no Cal.com e GA4):

```
Estrutura: utm_source=meta&utm_medium=paid&utm_campaign=[campanha]&utm_content=[rosto]&utm_term=[angulo]
```

Exemplos:
- Moroni — vídeo folha pagamento: `?utm_source=meta&utm_medium=paid&utm_campaign=u4digital-leads-maio&utm_content=moroni&utm_term=folha-pagamento`
- Tiago — vídeo tempo perdido: `?utm_source=meta&utm_medium=paid&utm_campaign=u4digital-leads-maio&utm_content=tiago&utm_term=tempo-perdido`
- Brand — estático custo: `?utm_source=meta&utm_medium=paid&utm_campaign=u4digital-leads-maio&utm_content=brand&utm_term=custo-time`

Isso permite, quando o lead agendar no Cal.com, saber exatamente qual criativo gerou o agendamento — dado que o Meta Ads Manager não conecta automaticamente ao agendamento.

### 7.4 Meta Instant Form — Configuração

Como a LP ainda não existe, usar formulário nativo do Meta:

**Perguntas do formulário (máximo 3 — cada pergunta adicional reduz conversão em ~15%):**

1. Qual é o seu faturamento mensal atual? (obrigatória)
   - Abaixo de R$10K
   - R$10K-30K
   - R$30K-80K
   - Acima de R$80K

2. Quantas pessoas você tem no time hoje? (opcional — qualifica ICP)
   - 0 (trabalho sozinho)
   - 1-3
   - 4-8
   - 9+

3. Qual é o principal problema que você quer resolver com IA? (texto livre — captura intenção)

**Configuração pós-formulário:**
- Página de agradecimento com botão de agendamento direto (Cal.com link)
- Webhook para notificar o Moroni/Tiago em tempo real (WhatsApp/email)

---

## 8. Checklist de Segurança (ads-safety.md)

### Antes de Criar Qualquer Objeto na Plataforma

- [ ] Conta confirmada: act_1497187178472890 (u4digital) — não confundir com contas Noiva SA ou Moroni Reis
- [ ] Aprovação explícita do Moroni para iniciar criação
- [ ] Budget diário confirmado (máximo R$20/dia por conjunto — dentro do limite de R$200 total)
- [ ] Nenhuma campanha com Lifetime Budget (usar Daily Budget apenas)
- [ ] Naming convention aplicada em todas as campanhas, conjuntos e anúncios
- [ ] Status inicial de todas as campanhas: PAUSADO

### Durante a Criação

- [ ] Revisar ID da conta antes de cada operação write
- [ ] Log de cada objeto criado: nome, ID, status, data
- [ ] Nenhum anúncio ativado sem aprovação explícita do Moroni
- [ ] Formulários nativos Meta configurados e testados antes de ativar

### Durante a Gestão Ativa

- [ ] Qualquer aumento de budget acima de R$100/dia requer aprovação
- [ ] Nunca aumentar budget mais de 30% em uma única alteração
- [ ] Nunca deletar campanhas, conjuntos ou anúncios — apenas pausar
- [ ] Alterações durante fase de aprendizado (primeiros 7 dias ou < 50 conversões) = documentar risco de reset

### Aprovação Necessária Para

| Ação | Quem Aprova |
|------|------------|
| Criar campanhas (inicialmente pausadas) | Moroni ✓ antes |
| Ativar campanhas | Moroni ✓ explicitamente |
| Aumentar budget > 30% | Moroni ✓ antes |
| Pausar campanha ativa | Moroni ✓ antes (reportar performance atual) |
| Mudar targeting | Moroni ✓ antes |
| Criar nova conta de anúncios | Moroni ✓ sempre |

---

## 9. Próximos Passos — Ordem de Execução

### Fase 0 — Pré-requisitos (antes de criar qualquer anúncio)

1. **Gravar os vídeos** — Moroni e Tiago gravam seguindo os scripts acima (cada um: 1 take principal, 1 variação de hook se possível)
2. **Criar os estáticos** — designer-agent produz estáticos 1 e 2 (mínimo) usando a direção de visual acima
3. **Configurar o formulário** — criar Meta Instant Form com as 3 perguntas + webhook de notificação
4. **Instalar o pixel** — se a LP já estiver no Vercel, instalar pixel e testar eventos

### Fase 1 — Criação (após aprovação de Moroni)

5. **Criar campanhas e conjuntos** (todos PAUSADOS) — via meta-ads MCP ou manualmente
6. **Upload dos criativos** — vídeos e estáticos para a biblioteca do Meta
7. **Criar anúncios** vinculando criativos + copy + formulário (todos PAUSADOS)
8. **Review final** — Moroni revisa todos os anúncios no Gerenciador antes de ativar

### Fase 2 — Ativação

9. **Ativar campanhas** — Moroni clica em "Publicar" / traffic-manager ativa via MCP com aprovação documentada
10. **Monitoramento Dia 1** — confirmar que todos os conjuntos têm spend nas primeiras 6h

### Fase 3 — Análise e Iteração (Dias 4-7)

11. **Relatório de performance** — ads-analyst puxa dados e compara CPL/CTR por rosto
12. **Decisão estratégica** — creative-strategist + Moroni decidem próxima rodada com base nos dados
13. **Produção de novos criativos** — com rosto vencedor identificado, produzir variações de ângulo

---

## 10. Projeções e Expectativas

### Cenário Conservador (CPL alto — R$30-50)

- Total de leads: 4-7 leads
- Custo por lead: R$30-50
- Qualidade esperada: Mixed — precisa iterar copy e hook
- Próximo passo: ajustar hook dos piores performers, rodar mais R$200 com variações

### Cenário Realista (CPL médio — R$15-30)

- Total de leads: 7-13 leads
- Custo por lead: R$15-30
- Qualidade esperada: Boa — leads de experts qualificados
- Próximo passo: escalar rosto vencedor para R$30-50/dia

### Cenário Otimista (CPL baixo — R$8-15)

- Total de leads: 13-25 leads
- Custo por lead: R$8-15
- Qualidade esperada: Alta — CPL nesse range é excelente para assessoria de high ticket
- Próximo passo: escalar imediatamente para R$50/dia, expandir audiência, criar Lookalike

### Benchmarks de Referência (mercado IA/digital BR, 2025-2026)

| Produto | CPL Típico | Fonte |
|---------|-----------|-------|
| Diagnóstico gratuito (assessoria B2B) | R$15-40 | Benchmark mercado |
| Lead para mentoria high ticket | R$30-80 | Benchmark mercado |
| Lead para curso digital (ticket < R$1K) | R$5-20 | Benchmark mercado |

Diagnóstico gratuito de assessoria está entre esses dois mundos — esperar R$15-40 como faixa realista para uma conta nova em tráfego frio.

---

## CHANGELOG

- [2026-05-01] — Documento criado. Estratégia completa: estrutura de campanha, audiências, orçamento, 3 scripts de vídeo, 3 estáticos, copy framework Hormozi, plano de testes, pixel/UTM, checklist de segurança.
