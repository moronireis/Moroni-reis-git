# u4digital — Arquitetura Completa de Funil

Last updated: 2026-05-01

> **Owner**: funnel-architect
> **Status**: Draft — aguardando validacao do Moroni
> **Client**: u4digital (Assessoria de IA para Negocios Digitais)
> **Depends on**: `brain/strategy/u4digital-icp-positioning.md`, `.claude/rules/hormozi-framework.md`
> **Budget de teste**: R$200 (fase de validacao)
> **Trafego**: 100% frio — sem base existente

---

## 1. Value Ladder — u4digital

```
                                    BACKEND
                                   R$5-15K/mes
                              Assessoria Continuada
                            (acompanhamento mensal +
                             novos agentes + otimizacao)
                                      |
                                  [BRIDGE: Resultado do primeiro projeto
                                   + proposta de retainer mensal]
                                      |
                                  MIDDLE TICKET
                                   R$3-8K
                            Projeto de Implementacao
                          (agentes sob medida + setup +
                           treinamento do time do expert)
                                      |
                              [BRIDGE: Raio-X Digital mostra
                               exatamente o que construir +
                               projecao de economia]
                                      |
                                  FRONTEND
                                  R$0 (gratis)
                              Raio-X Digital
                           (diagnostico de 35-45 min)
                         Deliverable: PDF personalizado
                                      |
                              [BRIDGE: Anuncio/conteudo
                               desperta consciencia do
                               custo da Folha Invisivel]
                                      |
                                    BAIT
                               Conteudo organico +
                              Anuncios pagos (Meta)
                           "Quanto custa seu time vs.
                            quanto custaria com agentes?"
```

**Regra critica**: Nao ha dead ends. Quem faz o Raio-X e nao compra entra em sequencia de follow-up. Quem compra o projeto entra em pipe de upsell para assessoria continuada. Quem recusa tudo recebe conteudo de nurture por 30 dias.

---

## 2. Tipo de Funil: Application + Diagnostico

Dado que u4digital e high-ticket (R$3-15K), servico customizado, sem base existente e com orcamento de teste de R$200:

**Funil escolhido**: Trafego Frio → Landing Page → Pre-qualificacao → Agendamento (Cal.com) → Diagnostico (Raio-X Digital) → Proposta → Fechamento

**Por que este formato**:
- Application funnel e o padrao para high-ticket no Brasil
- O diagnostico gratuito funciona como "lead magnet experiencial" — valor antes do dinheiro
- Pre-qualificacao filtra curiosos e economiza tempo de Moroni/Tiago
- WhatsApp-first (realidade brasileira, nao depende de email)
- Nao precisa de checkout, plataforma de curso ou infra complexa

---

## 3. Flow Diagram Completo

```
                         ┌─────────────────────────┐
                         │    FONTE DE TRAFEGO      │
                         │  Meta Ads (R$200 budget) │
                         │  3 faces: Moroni/Tiago/  │
                         │  u4digital brand         │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                    ①    │    LANDING PAGE (LP)     │
                         │  u4digital.vercel.app    │
                         │  CTA: "Agende seu        │
                         │  Raio-X Digital Gratis"  │
                         └────────────┬────────────┘
                                      │
                              Conv: 15-25%
                                      │
                                      ▼
                         ┌─────────────────────────┐
                    ②    │   PRE-QUALIFICACAO       │
                         │  Formulario embutido     │
                         │  (5 perguntas)           │
                         │  Filtra: faturamento,    │
                         │  time, produto, urgencia │
                         └──────┬──────────┬───────┘
                                │          │
                       Qualificado    Desqualificado
                        (score ≥3)     (score <3)
                                │          │
                                ▼          ▼
                    ┌──────────────┐  ┌────────────────┐
               ③a  │  CAL.COM     │  │  PAGINA DE     │
                    │  Agendamento │  │  REDIRECIONAMENTO│
                    │  do Raio-X   │  │  "No momento    │
                    │  Digital     │  │  nosso foco e   │
                    │              │  │  experts 10K+.  │
                    │              │  │  Siga no IG     │
                    │              │  │  pra conteudo." │
                    └──────┬──────┘  └────────────────┘
                           │
                   Conv: 50-70% dos
                   qualificados agendam
                           │
                           ▼
                    ┌──────────────┐
               ③b  │  CONFIRMACAO  │
                    │  WhatsApp     │
                    │  automatico   │
                    │  + lembrete   │
                    │  24h antes    │
                    └──────┬──────┘
                           │
                   Show-up: 60-75%
                           │
                           ▼
                    ┌──────────────┐
               ④   │  RAIO-X      │
                    │  DIGITAL     │
                    │  (35-45 min) │
                    │  Google Meet │
                    │  ou Zoom     │
                    └──────┬──────┘
                           │
                  ┌────────┼────────┐
                  │        │        │
              Comprou  Pensando  Nao comprou
                  │        │        │
                  ▼        ▼        ▼
           ┌──────────┐ ┌──────────┐ ┌──────────┐
      ⑤a  │ONBOARDING│ │FOLLOW-UP │ │ NURTURE  │
           │48h       │ │WhatsApp  │ │ Conteudo │
           │Kickoff   │ │7 dias    │ │ 30 dias  │
           │do projeto│ │5 msgs    │ │ (IG/YT)  │
           └──────────┘ └──────────┘ └──────────┘
```

---

## 4. Detalhamento de Cada Step

### Step ① — Landing Page

**Proposito**: Converter visitante frio em lead pre-qualificado. Comunicar a proposta de valor da u4digital e levar ao formulario de pre-qualificacao.

**Input**: Trafego de Meta Ads (clique no anuncio)
**Output**: Lead que preenche formulario de pre-qualificacao
**Pagina**: `u4digital.vercel.app` (ou subdominio de moronireis.com.br)
**CTA principal**: "Agende seu Raio-X Digital Gratis"
**CTA secundario**: Nenhum. Uma pagina, um objetivo.
**Owning agent**: dev-agent (build), direct-response-copywriter (copy), designer-agent (layout)
**Taxa de conversao esperada**: 15-25% (formulario preenchido / visitantes)

**Estrutura da LP (secao por secao)**:

```
SECAO 1 — HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Capturar atencao + comunicar proposta de valor em 5 segundos
Headline: [Varia por face — ver secao 4.1]
Sub-headline: "Agentes de IA construidos sob medida para o seu
negocio digital — com a sua voz, no seu processo."
CTA: "Quero meu Raio-X Digital Gratis →"
Visual: Foto/video do Moroni ou Tiago (depende da face do anuncio)
Badge: "Diagnostico gratuito • 35 minutos • Sem compromisso"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 2 — PROBLEMA (Inimigo Narrativo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Fazer o lead se reconhecer na dor
Conteudo: "A Folha de Pagamento Invisivel" — o custo real
de manter o time que nao escala.
Formato: 3-4 bullets com cenarios concretos:
• "Gestor de trafego: R$3K/mes pra gerenciar 2 campanhas"
• "Social media: 3 dias pra fazer 5 posts"
• "Suporte: responde 40 DMs e erra metade"
• "Se um sai, o negocio trava"
Frase de transicao: "E se existisse uma forma de operar com
1/3 do custo, sem depender de ninguem?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 3 — SOLUCAO (O Que Fazemos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Mostrar o que a u4digital entrega (nao o como)
Conteudo: 4-5 icones com descricao curta
• Agente de Copy — escreve com a sua voz, no seu tom
• Agente de Design — cria criativos no seu padrao visual
• Agente de Trafego — gerencia campanhas com regras suas
• Agente SDR — qualifica e responde leads 24h no WhatsApp
• Agente de Suporte — atende alunos/clientes sem voce
Frase-chave: "Nao e ferramenta generica. Sao agentes treinados
COM o seu metodo, PARA o seu negocio."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 4 — COMO FUNCIONA (3 Passos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Reduzir atrito mostrando simplicidade do processo
Formato: 3 colunas/cards numerados
1. "Agende o Raio-X Digital" — diagnostico gratuito de 35 min
2. "Receba o mapa da sua operacao" — PDF com custos reais vs.
   custos com agentes + demonstracao ao vivo
3. "Decida com clareza" — proposta personalizada. Se fizer
   sentido, a gente constroi. Se nao, voce leva o PDF.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 5 — PROVA SOCIAL (sem cases ainda)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Gerar credibilidade mesmo sem depoimentos de clientes
Estrategia para fase zero (sem cases):
• Credenciais do Moroni: "R$300K+ em contratos de IA entregues"
• Numeros do ecossistema: "100+ profissionais treinados em IA"
• Logo wall: logos de ferramentas/plataformas que domina
  (OpenAI, Anthropic, Meta, Supabase, Vercel, etc.)
• Frase: "Construimos agentes para nosso proprio negocio
  primeiro. Funciona. Agora construimos pro seu."
• Screenshot de agente real funcionando (blur no conteudo
  sensivel, mas mostra a interface real)
Evolucao: substituir por depoimentos reais assim que tiver
os 2-3 primeiros clientes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 6 — O QUE ACONTECE NO RAIO-X DIGITAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Vender o diagnostico como algo de valor (nao como
call de vendas disfarçada)
Conteudo:
• "Nos primeiros 10 min: mapeamos quanto voce gasta hoje na
  operacao. A maioria se assusta com o numero."
• "Nos proximos 10 min: identificamos 3-5 pontos que podem
  ser automatizados com agentes de IA."
• "Nos 10 min seguintes: mostramos ao vivo 1 agente funcionando
  — com a voz de um expert real."
• "Nos ultimos 5 min: projetamos quanto voce economizaria."
• "Voce sai com um PDF de 2-3 paginas com o diagnostico
  completo. Mesmo que nao contrate nada."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 7 — FAQ (4-5 perguntas)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Matar objecoes que sobraram
Perguntas:
1. "E gratuito mesmo? Qual e a pegadinha?"
   → "Sem pegadinha. O diagnostico e gratuito porque nosso
   modelo e assessoria — ganhamos quando voce contrata o
   projeto. Se nao fizer sentido, voce leva o PDF e pronto."
2. "Funciona pro meu nicho?"
   → "Se voce tem produto digital, time e fatura R$10K+/mes,
   funciona. Nossos agentes sao customizados pro seu mercado."
3. "Preciso saber de tecnologia?"
   → "Zero. Voce nao aprende. A gente constroi. Seu unico
   trabalho e aprovar."
4. "Quanto custa se eu decidir contratar?"
   → "Depende do que o diagnostico revelar. Cada projeto e
   sob medida. No Raio-X a gente projeta o investimento e
   o retorno esperado com transparencia total."
5. "Em quanto tempo vejo resultado?"
   → "Primeiro agente funcionando em 7-14 dias. Resultado
   mensuravel (economia ou receita) no primeiro mes."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECAO 8 — CTA FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Objetivo: Ultimo push para conversao
Headline: "Seu concorrente ja esta automatizando. Voce vai
esperar ate quando?"
Sub: "35 minutos. Zero custo. Zero compromisso. Maximo de
clareza sobre o que IA pode fazer pelo seu negocio."
CTA: "Agendar meu Raio-X Digital →"
Micro-copy abaixo do CTA: "Diagnostico gratuito • Vagas
limitadas por semana"
(Escassez real — Moroni/Tiago tem agenda finita)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Logo u4digital + REIS [IA]
"Assessoria de IA para Negocios Digitais"
Instagram | WhatsApp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 4.1 Headlines por Face de Anuncio

| Face | Headline da LP | Justificativa |
|------|---------------|---------------|
| Moroni | "Eu gasto R$2K/mes em agentes de IA. Meu concorrente gasta R$20K em time. Quem voce acha que tem mais margem?" | Prova pessoal + calculo mental |
| Tiago | "Construi agentes de IA que fazem em 2 horas o que seu time faz em 2 semanas." | Angulo tecnico + resultado concreto |
| u4digital (marca) | "Seu negocio digital nao precisa de mais gente. Precisa de agentes inteligentes." | Mensagem central da marca |

**Nota**: A LP deve ter variantes (ou conteudo dinamico) para manter congruencia entre anuncio e pagina. Se o anuncio tem o Moroni, a LP mostra o Moroni. Se tem o Tiago, mostra o Tiago. Consistencia face-a-face e critica para taxa de conversao.

---

### Step ② — Pre-Qualificacao

**Proposito**: Filtrar leads que tem perfil para o Raio-X Digital (faturamento R$10K+, tem time, tem produto) e descartar curiosos.

**Input**: Visitante da LP que clicou no CTA
**Output**: Lead qualificado (rota para Cal.com) ou desqualificado (rota para redirect)
**Formato**: Formulario embutido na LP (scroll suave para formulario, sem redirecionar)
**Owning agent**: dev-agent (implementacao), funnel-architect (logica de scoring)
**Taxa de conversao esperada**: 60-70% de quem comecou preenchem ate o fim (formulario curto)

**Campos do formulario (5 perguntas)**:

```
PERGUNTA 1 (obrigatoria)
"Qual e o seu faturamento mensal?"
[ ] Menos de R$5K/mes
[ ] R$5K - R$10K/mes
[ ] R$10K - R$30K/mes        ← qualifica
[ ] R$30K - R$80K/mes        ← qualifica (prioridade)
[ ] Mais de R$80K/mes        ← qualifica (prioridade maxima)

PERGUNTA 2 (obrigatoria)
"Quantas pessoas tem no seu time hoje?"
[ ] So eu
[ ] 1-2 pessoas
[ ] 3-5 pessoas              ← qualifica
[ ] 6-8 pessoas              ← qualifica (prioridade)
[ ] Mais de 8 pessoas        ← qualifica

PERGUNTA 3 (obrigatoria)
"Voce ja tem produto digital gerando vendas?"
[ ] Sim, vendo todo mes       ← qualifica
[ ] Sim, mas irregular        ← qualifica
[ ] Estou lancando agora      ← borderline
[ ] Ainda nao tenho produto   ← desqualifica

PERGUNTA 4 (obrigatoria)
"Qual area mais te toma tempo hoje?"
[ ] Criacao de conteudo (copy, design, video)
[ ] Gestao de trafego e campanhas
[ ] Atendimento e suporte
[ ] Vendas e qualificacao de leads
[ ] Tudo um pouco (estou no operacional inteiro)
→ (Nao filtra — informa qual agente demonstrar no Raio-X)

PERGUNTA 5 (obrigatoria)
"Como podemos te contactar?"
Nome: [___________]
WhatsApp: [___________]
Instagram: [___________] (opcional)
```

**Logica de qualificacao**:

| Criterio | Pontos |
|----------|--------|
| Faturamento R$10K+ | +2 |
| Faturamento R$30K+ | +3 |
| Time 3+ pessoas | +2 |
| Produto vendendo (regular ou irregular) | +2 |
| **Score minimo para agendar**: 3 pontos | |

**Leads desqualificados (score < 3)**:
- Redirect para pagina: "Obrigado pelo interesse. No momento estamos focados em experts que faturam R$10K+/mes e tem time. Mas se voce quer comecar a usar IA no seu negocio, siga a @u4digital no Instagram — postamos conteudo gratuito toda semana."
- Nao gasta tempo de call com quem nao tem perfil
- Esses leads podem ser reativados no futuro quando u4digital tiver produto de ticket menor

**Taxa de qualificacao esperada**: 40-60% (com targeting de ads correto)

---

### Step ③a — Agendamento (Cal.com)

**Proposito**: Lead qualificado agenda horario para o Raio-X Digital.

**Input**: Lead que passou na pre-qualificacao (score ≥ 3)
**Output**: Sessao agendada no calendario
**Ferramenta**: Cal.com (free tier, sem branding)
**Owning agent**: executor-agent (setup Cal.com)
**Taxa de conversao esperada**: 50-70% dos qualificados agendam

**Configuracao do Cal.com**:

```
TIPO DE EVENTO: "Raio-X Digital — u4digital"
DURACAO: 45 minutos
BUFFER: 15 min entre sessoes
DISPONIBILIDADE:
  - Seg-Sex: 09:00-12:00, 14:00-18:00
  - Sabado: 09:00-12:00 (opcional)
  - Maximo 3 Raio-X por dia (proteger qualidade)
LEMBRETES:
  - WhatsApp 24h antes (manual ou Evolution API)
  - WhatsApp 1h antes
LINK: cal.com/u4digital/raio-x-digital
INTEGRACAO: Google Meet (auto-gerar link)
CAMPOS EXTRAS NO CAL.COM:
  - "Qual seu Instagram?" (pre-pesquisar antes da call)
  - "Qual e o principal produto que voce vende hoje?"
```

---

### Step ③b — Confirmacao + Pre-Call

**Proposito**: Confirmar agendamento, aumentar show-up rate, e preparar o lead para a call.

**Input**: Lead que acabou de agendar
**Output**: Lead preparado e engajado antes da call
**Canal**: WhatsApp (principal) + email Cal.com (automatico)
**Owning agent**: integration-engineer (automacao WhatsApp)
**Show-up rate esperado**: 60-75%

**Sequencia de confirmacao (WhatsApp)**:

```
MSG 1 — Imediatamente apos agendamento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Opa, [NOME]! Aqui e o [Moroni/Tiago] da u4digital.

Seu Raio-X Digital ta confirmado:
📅 [DATA] as [HORA]
📍 Link: [GOOGLE MEET]

Antes da nossa conversa, me manda:
1. Quanto voce gasta por mes com time (estimativa)
2. Qual area mais te toma tempo

Isso me ajuda a preparar o diagnostico
especificamente pro seu negocio.

Ate [DIA]!"

MSG 2 — 24h antes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[NOME], lembrete: amanha as [HORA] temos o
seu Raio-X Digital.

Separei um tempo pra estudar o seu perfil.
Vai ser uma conversa produtiva.

Link: [GOOGLE MEET]

Confirma que vai estar la? 👍"

MSG 3 — 1h antes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[NOME], em 1h temos nosso Raio-X.
Link: [GOOGLE MEET]

Te vejo la."
```

**Pre-call prep (para quem conduz o Raio-X)**:
- Checar Instagram do lead (conteudo, audiencia, engajamento)
- Checar respostas do formulario (faturamento, time, produto)
- Preparar 1 demonstracao de agente relevante para o nicho do lead
- Ter template do PDF Raio-X Digital pronto para preencher durante a call

---

### Step ④ — Raio-X Digital (A Call)

**Proposito**: Diagnosticar a operacao do lead, demonstrar valor ao vivo, e apresentar proposta.

**Input**: Lead qualificado que apareceu na call
**Output**: Proposta aceita (comprou) / proposta em consideracao (pensando) / PDF entregue (nao comprou)
**Duracao**: 35-45 minutos
**Plataforma**: Google Meet ou Zoom
**Owning agent**: Moroni/Tiago (execucao humana)
**Taxa de conversao esperada**: 20-30% fecham na call ou em ate 7 dias

**Roteiro do Raio-X Digital**:

```
BLOCO 1 — MAPEAMENTO DE CUSTOS (10 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Perguntas-chave:
• "Me conta como e o dia a dia da sua operacao hoje."
• "Quantas pessoas voce tem e o que cada uma faz?"
• "Quanto voce gasta por mes com time (CLT + freelancers)?"
• "Qual o seu custo por lancamento? E quanto sobra de margem?"
→ ANOTAR: custo total mensal de operacao

BLOCO 2 — GARGALOS AUTOMATIZAVEIS (10 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Perguntas-chave:
• "O que acontece quando voce perde um membro do time?"
• "Quais tarefas sao repetitivas e poderiam rodar sem voce?"
• "Onde voce perde mais tempo pessoalmente?"
→ IDENTIFICAR: 3-5 pontos automatizaveis
→ PRIORIZAR: qual gera mais economia ou resultado

BLOCO 3 — DEMONSTRACAO AO VIVO (10 min) ← AHA MOMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Mostrar 1 agente real funcionando
  (adaptar ao nicho do lead — se e fitness, mostrar agente
  respondendo lead de academia; se e lancamento, mostrar
  agente de copy escrevendo com voz de expert)
• Deixar o lead interagir se possivel
• "Esse agente foi construido em 3 dias. Funciona 24h.
  Custa uma fracao do que voce paga pelo [funcao equivalente]."

BLOCO 4 — PROJECAO DE ECONOMIA (5 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• "Hoje voce gasta R$[X]/mes em operacao."
• "Com agentes cobrindo [areas identificadas], o custo
  cairia pra R$[Y]/mes."
• "Isso e uma economia de R$[X-Y]/mes — R$[12*(X-Y)]/ano."
• "O investimento pra construir esses agentes e [range]."
• "O payback e de [N] meses."

BLOCO 5 — PROPOSTA (5-10 min, se o lead demonstrou interesse)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Apresentar escopo personalizado baseado no diagnostico
• Investimento: R$[X] (adaptar ao caso)
• Prazo de entrega: 2-4 semanas
• Entregaveis claros: quais agentes, o que cada um faz
• Garantia: "Se em 30 dias os agentes nao estiverem
  funcionando como combinado, devolvemos o investimento."
• CTA: "Quer que a gente comece?"
```

**Deliverable obrigatorio**: PDF "Raio-X Digital" enviado por WhatsApp apos a call, independente de ter fechado ou nao. Conteudo:
- Resumo da operacao atual (custos mapeados)
- Gargalos identificados (3-5 pontos)
- Projecao de economia com agentes
- Proximos passos recomendados

---

### Step ⑤a — Pos-Compra: Onboarding

**Proposito**: Ativar o cliente nas primeiras 48h para maximizar entusiasmo e reduzir arrependimento.

**Input**: Cliente que fechou (pagamento confirmado)
**Output**: Kickoff do projeto realizado, expectativas alinhadas
**Canal**: WhatsApp + Google Meet
**Owning agent**: integration-engineer (automacao), Moroni/Tiago (execucao)

**Sequencia de onboarding (48h)**:

```
HORA 0 — Imediatamente apos pagamento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhatsApp:
"[NOME], parabens pela decisao. Isso vai mudar a forma
como voce opera o negocio.

Proximos passos:
1. Vou te adicionar no grupo do projeto (WhatsApp)
2. Em ate 24h agendamos o kickoff (30 min)
3. No kickoff defino exatamente o que preciso de voce
   (conteudos, acessos, voz) pra comecar a construir.

Qualquer duvida, manda aqui."

HORA 2-4 — Criar grupo WhatsApp do projeto
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Grupo: "[NOME] x u4digital — Projeto IA"
Membros: Cliente + Moroni + Tiago (se aplicavel)
Mensagem fixada: escopo do projeto + cronograma

24H — Agendar kickoff (30 min Google Meet)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pauta do kickoff:
• Revisar escopo e entregaveis
• Coletar materiais: exemplos de voz do expert, acessos
  a plataformas, exemplos de conteudo que gosta
• Definir marco 1 (primeiro agente funcional)
• Alinhar cronograma de entregas

48H — Confirmar inicio dos trabalhos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhatsApp no grupo do projeto:
"[NOME], ja estamos trabalhando no [primeiro agente].
Previsao de entrega do primeiro prototipo: [DATA].
Vou te mandar um video mostrando o progresso."
```

---

### Step ⑤b — Pos-Diagnostico: Follow-Up (Nao Comprou)

**Proposito**: Reengajar leads que fizeram o Raio-X mas nao fecharam. Sem pressao — com valor.

**Input**: Lead que fez o Raio-X e nao fechou na call
**Output**: Reativacao do lead ou saida limpa
**Canal**: WhatsApp (5 mensagens em 7 dias)
**Owning agent**: integration-engineer (automacao WhatsApp)
**Taxa de conversao esperada**: 10-15% dos que nao fecharam na call fecham no follow-up

**Sequencia de follow-up WhatsApp (7 dias)**:

```
MSG 1 — Dia 0 (apos a call, 2-4h depois)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[NOME], foi muito bom conversar com voce.

Segue o seu Raio-X Digital em PDF: [LINK]

Qualquer duvida sobre o que conversamos, me manda
aqui. Sem pressa."

[ANEXAR PDF DO RAIO-X DIGITAL]

MSG 2 — Dia 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[NOME], fiquei pensando depois da nossa conversa.

Aquele ponto que voce mencionou sobre [GARGALO
ESPECIFICO DO LEAD] — tem uma forma de resolver
isso em menos de 7 dias.

Se quiser, te mostro como ficaria na pratica.
Sem compromisso."

MSG 3 — Dia 4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ENVIAR CONTEUDO DE VALOR]
Video curto (1-2 min) mostrando um agente em acao
— de preferencia similar ao que o lead precisaria.

"[NOME], gravei esse video rapido mostrando um
agente de [TIPO] que construimos essa semana.
Achei que ia te interessar."

MSG 4 — Dia 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[NOME], pergunta direta:
O que te impediu de avancar?

Se for timing, sem problema — fico a disposicao.
Se for duvida sobre resultado, posso te mandar
mais detalhes.
Se nao fez sentido pro seu momento, tudo bem
tambem. Prefiro honestidade."

MSG 5 — Dia 7 (ultima)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[NOME], vou parar de te mandar mensagem (prometo).

So queria dizer: o Raio-X que fizemos nao tem
validade. Se daqui a 1 mes, 3 meses, voce olhar
aquele PDF e pensar 'agora e a hora' — me manda
um oi. Vai ser um prazer retomar.

Sucesso no seu negocio."
```

**Regras da sequencia**:
- Se o lead responder qualquer mensagem, sai da automacao e entra em conversa humana
- Se o lead pedir para parar, para imediatamente
- Mensagem 4 e a mais importante — pergunta direta que revela objecao real
- Mensagem 5 encerra com elegancia (nao queima a ponte)

---

### Step ⑤c — Nurture de Longo Prazo (Nao Agendou ou Nao Apareceu)

**Proposito**: Manter contato minimo com leads que nao avancaram. Custo zero — conteudo organico.

**Input**: Lead que preencheu formulario mas nao agendou, ou agendou e nao apareceu
**Output**: Lead reativado no futuro (ou perdido definitivamente)
**Canal**: Instagram (seguir de volta, interagir) + conteudo organico
**Owning agent**: social-media-director (conteudo)
**Taxa de reativacao esperada**: 3-5% em 90 dias

**Acoes**:
- Seguir o lead no Instagram (se informou no formulario)
- Interagir organicamente com o conteudo dele (likes, comentarios reais)
- Postar conteudo que reforce a mensagem do funil (dor + solucao + prova)
- Nao mandar mensagem direta a menos que o lead interaja primeiro

---

## 5. Metricas e Benchmarks (para R$200 de Budget)

### Premissas

| Variavel | Valor Estimado | Justificativa |
|----------|---------------|---------------|
| CPM Meta Ads Brasil | R$25-35 | Audiencia ampla, nicho digital, video |
| CTR do anuncio | 1.5-3% | Video com hook forte, 3 faces testando |
| CPC | R$1.50-3.00 | Derivado de CPM / CTR |
| Budget total | R$200 | Fase de teste |
| Dias de campanha | 5-7 dias | R$30-40/dia |

### Projecao Conservadora (CPC R$2.50)

```
R$200 de budget
÷ R$2.50 CPC
= 80 cliques na LP
━━━━━━━━━━━━━━━━━━━━━━━━━━━

80 cliques na LP
× 20% conversao do formulario
= 16 leads pre-qualificados
━━━━━━━━━━━━━━━━━━━━━━━━━━━

16 leads pre-qualificados
× 50% taxa de qualificacao
= 8 leads qualificados
━━━━━━━━━━━━━━━━━━━━━━━━━━━

8 leads qualificados
× 60% agendamento
= ~5 agendamentos
━━━━━━━━━━━━━━━━━━━━━━━━━━━

5 agendamentos
× 65% show-up
= ~3 Raio-X realizados
━━━━━━━━━━━━━━━━━━━━━━━━━━━

3 Raio-X realizados
× 25% conversao (call + follow-up)
= ~1 venda
━━━━━━━━━━━━━━━━━━━━━━━━━━━

CPL (custo por lead qualificado): R$25
CPA (custo por agendamento): R$40
CPD (custo por diagnostico): R$67
CAC (custo por cliente): R$200
```

### Projecao Otimista (CPC R$1.50)

```
R$200 ÷ R$1.50 = 133 cliques
× 25% formulario = 33 leads
× 55% qualificacao = 18 qualificados
× 65% agendamento = 12 agendamentos
× 70% show-up = 8 Raio-X
× 30% conversao = 2-3 vendas

CAC: R$67-100
```

### Break-Even

| Cenario | Vendas | Ticket Minimo p/ Break-Even | Ticket Real Estimado | Resultado |
|---------|--------|----------------------------|---------------------|-----------|
| Conservador | 1 venda | R$200 | R$3-8K | Lucrativo (ROI 15-40x) |
| Otimista | 2-3 vendas | R$67-100 | R$3-8K | Muito lucrativo (ROI 30-120x) |

**Conclusao**: Com R$200 de budget, UMA venda ja paga o investimento 15-40 vezes. O funil e viavel mesmo no cenario mais conservador. O gargalo nao e o budget — e a qualidade da LP e dos anuncios.

---

## 6. Automacoes e Tecnologia

### Stack Tecnologico Necessario

| Step | Ferramenta | Custo | Prioridade |
|------|-----------|-------|------------|
| Landing Page | Vercel (deploy) + Astro | R$0 | P0 — critica |
| Formulario | Embutido na LP (HTML + Supabase ou Formspree) | R$0 | P0 — critica |
| Agendamento | Cal.com (free tier) | R$0 | P0 — critica |
| Videochamada | Google Meet | R$0 | P0 — critica |
| WhatsApp confirmacao | Manual (fase 1) / Evolution API (fase 2) | R$0 inicialmente | P1 — importante |
| WhatsApp follow-up | Manual (fase 1) / Evolution API (fase 2) | R$0 inicialmente | P1 — importante |
| PDF Raio-X | Template Canva ou Google Docs | R$0 | P1 — importante |
| Meta Ads | Conta existente (act_1690330771143511) | R$200 (budget) | P0 — critica |
| Pixel Meta | Pixel no LP + evento de lead/agendamento | R$0 | P0 — critica |
| CRM | Planilha Google Sheets (fase 1) | R$0 | P2 — nice-to-have |
| Pagamento | Pix manual + nota fiscal | R$0 | P0 — critica |
| Email | Nao necessario nesta fase | R$0 | P3 — futuro |

**Custo total de infra: R$0** (alem do budget de ads)

### Especificacoes de Automacao (para integration-engineer)

**Fase 1 (lancamento — manual)**:
- LP hospedada na Vercel
- Formulario salva dados em Google Sheets (via fetch para Sheets API ou Formspree)
- Scoring feito manualmente (olhar respostas, decidir)
- WhatsApp: mensagens enviadas manualmente por Moroni/Tiago
- Cal.com: link enviado manualmente apos qualificacao
- PDF: preenchido manualmente em template

**Fase 2 (apos validacao — automatizado)**:
- Formulario salva em Supabase (tabela `u4d_leads`)
- Scoring automatico via edge function
- Lead qualificado → redirect automatico para Cal.com
- Lead desqualificado → redirect para pagina de redirecionamento
- Webhook Cal.com → dispara mensagem WhatsApp via Evolution API
- Sequencia de follow-up automatizada via Evolution API
- PDF gerado automaticamente com dados da call

### Eventos de Pixel (para Meta Ads)

| Evento | Quando Dispara | Onde |
|--------|---------------|------|
| `PageView` | Ao carregar a LP | LP |
| `Lead` | Ao enviar formulario | LP (formulario) |
| `Schedule` (custom) | Ao confirmar agendamento | Cal.com thank-you page |
| `Purchase` | Ao confirmar pagamento | Manual (CAPI via server) |

**Nota**: Na fase 1 com R$200, o pixel nao vai ter dados suficientes para otimizar. Otimizar para `Lead` (formulario preenchido) e a melhor estrategia. Quando tiver volume, migrar para otimizar por `Schedule` ou `Purchase`.

---

## 7. Specs de Anuncios (3 Faces)

### Formato Recomendado
- Video curto (30-60 segundos)
- Formato vertical 9:16 (Reels/Stories)
- 3 criativos por face = 9 criativos totais
- Budget dividido: R$70 por face (teste de 5-7 dias)

### Angulos por Face

**Face Moroni (autoridade + prova pessoal)**:
1. "A Folha de Pagamento Invisivel" — mostra calculo do custo real
2. "Eu substitui [funcao] por um agente de IA" — bastidores reais
3. "35 minutos que podem mudar sua operacao" — vende o diagnostico

**Face Tiago (tecnico + demonstracao)**:
1. "Olha o que esse agente faz em 2 minutos" — screencast rapido
2. "Seu time demora 3 dias nisso. Meu agente faz em 3 minutos." — comparacao
3. "Construi isso em 1 dia. Roda 24h." — velocidade de implementacao

**Face u4digital (marca + conceito)**:
1. Narrador + B-roll: "O expert digital de 2026 nao contrata mais. Ele automatiza."
2. Antes/depois: custo com time vs. custo com agentes (numeros na tela)
3. Depoimento sintetico: reconstrucao do que um cliente diria (se nao tiver real)

### Estrutura do Script (30-60s)

```
[0-3s]  HOOK — Frase que para o scroll
[3-10s] PROBLEMA — "Voce gasta R$X em time e sobra R$Y"
[10-25s] SOLUCAO — "Agentes de IA que fazem isso por 1/3"
[25-35s] PROVA — Demonstracao rapida ou calculo
[35-45s] CTA — "Link na bio" ou "Clica no botao"
[45-60s] REFORCO — Repetir o hook ou adicionar urgencia
```

---

## 8. Copy Briefs (para direct-response-copywriter)

### Brief 1 — Landing Page

| Campo | Conteudo |
|-------|---------|
| **Peca** | Landing page completa (8 secoes) |
| **Objetivo** | Converter visitante frio em lead que preenche formulario |
| **WHO x WHEN** | O proprio expert, HOJE — "para de alimentar a Folha de Pagamento Invisivel" |
| **Angulo principal** | LESS BAD — custo invisivel do time que nao escala |
| **Angulo secundario** | MORE GOOD — margem real, tempo livre, independencia operacional |
| **Objecoes a matar** | "E gratis mesmo?", "Funciona pro meu nicho?", "Preciso ser tecnico?" |
| **Prova** | Credenciais Moroni (R$300K contratos), 100+ profissionais, stack tecnologico |
| **Tom** | Consultivo premium. Direto. Sem hype. Confiante. |
| **CTA** | "Agendar meu Raio-X Digital" |
| **Restricoes** | Sem emojis no corpo. Sem SaaS patterns. Sem preco na LP. |

### Brief 2 — Anuncios (9 criativos)

| Campo | Conteudo |
|-------|---------|
| **Peca** | 9 scripts de video (3 por face) |
| **Objetivo** | Clique para a LP |
| **Formato** | 30-60 segundos, vertical 9:16 |
| **Angulos** | Distribuidos entre os 4 Hormozi (ver secao 7) |
| **Hooks obrigatorios** | Primeiro frame deve ser pergunta ou afirmacao provocativa |
| **Tom** | Moroni: executivo confiante. Tiago: tecnico entusiasmado. Marca: editorial. |
| **Restricoes** | Sem palavras proibidas (humanization-rules.md). Sem promessas genericas. |

### Brief 3 — Sequencia WhatsApp Follow-Up

| Campo | Conteudo |
|-------|---------|
| **Peca** | 5 mensagens WhatsApp (ver secao 4 Step 5b) |
| **Objetivo** | Reengajar lead que nao comprou no Raio-X |
| **Angulo** | Valor primeiro, venda depois. MSG 4 e a chave (pergunta direta). |
| **Tom** | Informal, humano, sem pressao. Como colega mandando mensagem. |
| **Restricoes** | Maximo 4-5 linhas por mensagem. Sem links de vendas. Sem urgencia falsa. |

---

## 9. Design Specs (para designer-agent)

### Landing Page

| Aspecto | Especificacao |
|---------|--------------|
| **Estetica** | Dark mode. Minimal. Premium. Inspiracao Apple/Stripe. |
| **Cores** | Background #000000 ou #0A0A0A. Texto branco. Accent #4A90FF. |
| **Tipografia** | Inter. Headings weight 600-700. Body weight 400. |
| **Layout** | Single column, max-width 1200px. Generous whitespace. |
| **Mobile** | Mobile-first. CTA sticky no mobile (bottom bar). |
| **Imagens** | Fotos reais de Moroni/Tiago. Screenshots de agentes (blur sensivel). |
| **Animacoes** | Minimas. Fade-in on scroll. Nada que atrapalhe a leitura. |
| **Formulario** | Embutido. Background levemente diferente (#111). Border sutil. |
| **Proibido** | Emojis, gradientes chamativos, SaaS tier cards, pricing tables. |

### PDF Raio-X Digital

| Aspecto | Especificacao |
|---------|--------------|
| **Formato** | 2-3 paginas, A4 |
| **Estetica** | Mesma identidade visual da LP. Dark bg, accent blue, Inter. |
| **Conteudo** | Resumo operacional, gargalos, projecao de economia, proximos passos |
| **Personalizacao** | Nome do lead, numeros especificos da operacao dele |

---

## 10. Dados Necessarios (para data-engineer)

### Fase 1 — Google Sheets (MVP)

Nao precisa de banco nesta fase. Uma planilha Google Sheets com:

| Coluna | Tipo |
|--------|------|
| `data_lead` | date |
| `nome` | text |
| `whatsapp` | text |
| `instagram` | text |
| `faturamento` | select |
| `tamanho_time` | select |
| `tem_produto` | select |
| `area_gargalo` | select |
| `score` | number (auto) |
| `status` | select: lead / qualificado / agendado / show / no-show / proposta / fechado / perdido |
| `data_agendamento` | date |
| `data_raio_x` | date |
| `valor_proposta` | currency |
| `data_fechamento` | date |
| `fonte_anuncio` | text (UTM) |
| `face_anuncio` | text (Moroni/Tiago/Marca) |
| `notas` | text |

### Fase 2 — Supabase (quando validar)

Tabela `u4d_leads` com os mesmos campos + RLS + timestamps + foreign key para `u4d_projetos`.

---

## 11. Riscos e Premissas

### Riscos

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| R$200 nao gera volume suficiente para testar | Pode ter apenas 3-5 diagnosticos | Otimizar LP obsessivamente. 1 venda ja paga. |
| Nenhum dos 3 criativos (faces) funciona | Zero leads | Testar 3 angulos diferentes por face = 9 chances. Iterar rapido. |
| Show-up rate baixo (< 50%) | Poucos diagnosticos realizados | WhatsApp lembretes. Escassez real (3 vagas/dia). |
| Lead nao fecha na call | Zero vendas | Follow-up WhatsApp forte. PDF de valor. Garantia. |
| Sem prova social (zero depoimentos) | Conversao mais baixa | Usar credenciais pessoais, numeros do ecossistema, demo ao vivo. |
| Concorrente (Altaa.ai) domina o espaço | Dificuldade de diferenciacao | Posicionar como assessoria (parceiro), nao agencia (fornecedor). |

### Premissas

| Premissa | Se Nao For Verdade |
|----------|-------------------|
| Expert digital com time gasta R$10-25K/mes em operacao | A narrativa da "Folha de Pagamento Invisivel" nao ressoa |
| Agentes de IA podem substituir 40-70% do trabalho operacional | A promessa de economia nao se sustenta na demonstracao |
| Moroni/Tiago conseguem conduzir 3 Raio-X/dia com qualidade | Capacidade limitada — pode virar gargalo |
| WhatsApp e o canal principal do ICP | Se o ICP for mais email-driven, sequencia muda |
| R$3-8K e um ticket acessivel para quem fatura R$10-80K/mes | Se for percebido como caro, precisa de risk reversal mais forte |

---

## 12. Metricas de Sucesso

### Por Step

| Step | Metrica | Meta Conservadora | Meta Otimista |
|------|---------|-------------------|---------------|
| Anuncio → LP | CTR | 1.5% | 3%+ |
| LP → Formulario | Conversao | 15% | 25% |
| Formulario → Qualificado | Taxa | 40% | 60% |
| Qualificado → Agendamento | Taxa | 50% | 70% |
| Agendamento → Show-up | Taxa | 60% | 75% |
| Show-up → Venda (call + follow-up) | Taxa | 20% | 35% |
| **End-to-end: Clique → Venda** | **Taxa** | **0.5-1%** | **2-3%** |

### Overall (para R$200 de teste)

| Metrica | Meta |
|---------|------|
| Leads (formulario preenchido) | 10-30 |
| Diagnosticos realizados | 3-8 |
| Vendas | 1-3 |
| CAC | R$67-200 |
| ROI (se 1 venda de R$5K) | 25x |
| Tempo de teste | 7-10 dias |

---

## 13. Proximos Passos (Sequencia de Execucao)

```
SEMANA 1 — Construcao
━━━━━━━━━━━━━━━━━━━━━
□ 1. Brief de copy para direct-response-copywriter (LP + anuncios)
□ 2. Brief de design para designer-agent (LP)
□ 3. Setup Cal.com (executor-agent)
□ 4. Criar template PDF Raio-X Digital
□ 5. Criar planilha Google Sheets de CRM

SEMANA 2 — Build + Lancamento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ 6. dev-agent constroi LP na Vercel
□ 7. Instalar pixel Meta na LP
□ 8. Gravar 9 criativos de video (Moroni + Tiago + marca)
□ 9. Subir campanha Meta Ads (R$200 budget, PAUSED)
□ 10. Moroni aprova → ativar campanha

SEMANA 3 — Teste + Iteracao
━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ 11. Monitorar metricas diariamente
□ 12. Primeiros Raio-X realizados
□ 13. Ajustar LP/anuncios com base em dados
□ 14. Primeira venda (meta)
□ 15. Coletar primeiro depoimento (se possivel)
```

---

## 14. Notas para o Orchestrator

1. **Este funil e deliberadamente simples.** Com R$200 de budget e zero audiencia, complexidade mata. Cada step a mais e uma taxa de conversao a mais que pode falhar. O funil minimo viavel e: anuncio → LP → formulario → agendamento → call → proposta.

2. **WhatsApp-first e inegociavel para o mercado brasileiro.** Email e secundario. Toda a comunicacao critica (confirmacao, lembretes, follow-up) deve ser via WhatsApp.

3. **A demonstracao ao vivo no Raio-X e o momento decisivo.** Se o lead VER um agente funcionando com a voz de um expert real, a conversao sobe drasticamente. Investir tempo em preparar demos reais, nao slides.

4. **Prova social vai ser o gargalo ate o 3o cliente.** As primeiras vendas vao ser as mais dificeis. Depois do primeiro case real com numeros, o funil fica significativamente mais forte. Priorizar pedir depoimento (video, se possivel) dos primeiros clientes.

5. **As 3 faces (Moroni/Tiago/marca) sao um teste de posicionamento, nao apenas de criativo.** O resultado vai mostrar se o mercado responde melhor a autoridade pessoal (Moroni), demonstracao tecnica (Tiago), ou marca institucional. Isso define a estrategia de longo prazo.

6. **Fase 2 automacao so apos validar conversao.** Nao investir em Evolution API, Supabase, ou automacao complexa antes de ter pelo menos 3-5 vendas manuais. O manual funciona. A automacao otimiza.

---

## CHANGELOG
- [2026-05-01] — Documento criado. Funil completo: value ladder, flow diagram, 5 steps detalhados, LP wireframe, pre-qualificacao, booking, follow-up WhatsApp, onboarding, metricas, stack tecnologico, copy briefs, design specs, riscos.
