# ZNITH — Estrategia Completa: Meta Ads + Landing Pages + Cadastro + Diagnostico + Low-Ticket

Last updated: 2026-05-18

> **Owner**: CMO Strategist (Reis IA Agency)
> **Client**: ZNITH / Leilaine Campioto Messias
> **Status**: v1.0 — Estrategia completa para ativacao de trafego pago
> **Escopo**: Funil 1 (Mestre) + Funil 2 (IA) — foco no caminho ADS → LP → CADASTRO → DIAGNOSTICO + sugestoes low-ticket

---

## 0. Resumo Executivo

Este documento detalha a estrategia operacional para colocar os dois funis da ZNITH em trafego pago via Meta Ads. Cobre seis dimensoes:

1. **CAMPANHA** — Estrutura de campanhas, publicos, orcamento, criativos
2. **PAGINA** — Arquitetura das landing pages por funil
3. **CADASTRO** — Formularios, micro-compromissos, reducao de friccao
4. **DIAGNOSTICO** — Quiz Raio-X Comercial, logica de scoring, pagina de resultado, PDF
5. **LOW-TICKET** — 5 produtos entre R$27 e R$197 para monetizar entre BAIT e MIDDLE
6. **NUMEROS** — CPL, conversao, cenarios de orcamento, projecao de receita

Premissa fundamental: **80%+ do trafego Meta e mobile.** Toda decisao de pagina, formulario e quiz prioriza a experiencia no celular.

---

## 1. CAMPANHA — Estrategia de Meta Ads

### 1.1 Visao Geral da Estrutura

Dois funis rodando simultaneamente, com budgets separados e objetivos distintos:

| Funil | Objetivo | Publico Primario | Ticket de Saida |
|-------|----------|-----------------|-----------------|
| **Funil 1 — Mestre** | Gerar leads qualificados para Raio-X Comercial | Donos de vidracarias, serralherias, construtoras | R$35K (Expansao) |
| **Funil 2 — IA** | Capturar volume no hype de IA, qualificar e rotear | Empresarios buscando IA para comercial | R$785/mes (Agente) ou redirect pro Funil 1 |

### 1.2 Objetivo de Campanha Recomendado

**Funil 1 (Mestre) — Conversoes (Leads)**

- Objetivo: Conversoes, otimizando para "Lead" (evento customizado disparado no submit do cadastro)
- Motivo: O ICP e restrito (construcao civil, donos, R$1M-R$15M). Precisamos que o algoritmo aprenda rapido quem converte. Trafego puro traz clique barato mas lead lixo.
- Pixel event: `Lead` no submit do cadastro (antes do quiz), `CompleteRegistration` ao completar o Raio-X.
- Alternativa de partida: Se o pixel for novo (zero historico), comecar com **Trafego** otimizando para Landing Page Views por 5-7 dias para aquecer o pixel, depois migrar para Conversoes.

**Funil 2 (IA) — Conversoes (Leads)**

- Objetivo: Conversoes, otimizando para "Lead"
- Motivo: Volume maior esperado, mas queremos leads que completam o quiz de qualificacao rapida, nao apenas visitantes.
- Pixel event: `Lead` no submit do cadastro, `CompleteRegistration` ao completar o quiz de 5-7 perguntas.

### 1.3 Estrutura de Campanhas

#### FUNIL 1 — MESTRE (Raio-X Comercial)

```
CAMPANHA 1: [ZNITH] Raio-X Comercial — Prospecção Fria
├── Adset 1: Interesses — Construção Civil + Gestão
│   ├── Criativo A (Video — Dor do Follow-up)
│   ├── Criativo B (Carrossel — 5 Gargalos)
│   └── Criativo C (Imagem — Receita Invisível)
├── Adset 2: Interesses — Vidraçaria + Serralheria + CRM
│   ├── Criativo A
│   ├── Criativo B
│   └── Criativo C
└── Adset 3: Broad (Aberto 25-60, Brasil, Dono de Negócio)
    ├── Criativo A
    ├── Criativo B
    └── Criativo C

CAMPANHA 2: [ZNITH] Raio-X Comercial — Retargeting
├── Adset 1: Visitou LP mas não cadastrou (7d)
│   ├── Criativo D (Video — Prova Social / Case)
│   └── Criativo E (Imagem — "Já viu o Raio-X?")
├── Adset 2: Cadastrou mas não completou o Raio-X (14d)
│   ├── Criativo F (Imagem — "Seu resultado está esperando")
│   └── Criativo G (Video — O que o Raio-X revela)
└── Adset 3: Engajou conteúdo Leilaine (IG/FB 30d)
    ├── Criativo D
    └── Criativo E
```

#### FUNIL 2 — IA (Implementar IA)

```
CAMPANHA 3: [ZNITH] Implementar IA — Prospecção Fria
├── Adset 1: Interesses — IA + Automação + Empresários
│   ├── Criativo H (Video — "IA sem processo = caos")
│   ├── Criativo I (Imagem — Quiz "Sua empresa está pronta?")
│   └── Criativo J (Carrossel — "3 erros ao implementar IA")
├── Adset 2: Interesses — WhatsApp Business + CRM + Vendas B2B
│   ├── Criativo H
│   ├── Criativo I
│   └── Criativo J
└── Adset 3: Lookalike 1% de quem completou Raio-X (ativar mês 2+)
    ├── Criativo H
    ├── Criativo I
    └── Criativo J

CAMPANHA 4: [ZNITH] Implementar IA — Retargeting
├── Adset 1: Visitou LP IA mas não cadastrou (7d)
│   └── Criativos de prova social + case IA em vidraçaria
└── Adset 2: Cadastrou mas não completou quiz IA (14d)
    └── Criativos de "Seu diagnóstico de IA está esperando"
```

### 1.4 Estrategia de Publicos

#### Publicos de Prospeccao Fria (Funil 1)

**Adset 1 — Construcao Civil + Gestao (Interesse)**
- Idade: 30-60
- Genero: Todos (predominantemente masculino, mas nao excluir)
- Localizacao: SP, MG, RS (Caxias, Porto Alegre), PR, RJ — comecar com SP+MG+RS
- Interesses combinados (AND): 
  - Camada 1: Construcao civil OR Vidracaria OR Serralheria OR Esquadrias de aluminio OR Vidro temperado
  - Camada 2: Gestao empresarial OR Empreendedorismo OR Administracao de empresas
- Exclusoes: Funcionarios publicos, estudantes, CLT (excluir "emprego")
- Tamanho estimado: 200K-400K

**Adset 2 — Vidracaria + Serralheria + CRM (Nicho)**
- Mesma demo de cima
- Interesses combinados:
  - Camada 1: Vidracaria OR Serralheria OR Metalurgia OR Fachadas
  - Camada 2: CRM OR Pipedrive OR RD Station OR Gestao de vendas OR Funil de vendas
- Tamanho estimado: 80K-150K

**Adset 3 — Broad (Algoritmo decide)**
- Idade: 25-60
- Localizacao: Brasil inteiro (SP, MG, RS, PR, RJ, SC, BA, PE, GO, DF)
- Sem interesses — confia na IA do Meta com base no criativo + pixel
- Motivo: Broad frequentemente supera interesses em 2026, especialmente com criativos bem segmentados no hook. O hook do criativo faz a segmentacao.
- Tamanho: 30M+

#### Publicos de Prospeccao Fria (Funil 2)

**Adset 1 — IA + Automacao**
- Idade: 28-55
- Interesses: Inteligencia artificial OR Automacao comercial OR ChatGPT OR Agentes de IA + Empreendedorismo OR Gestao empresarial
- Localizacao: Brasil (aberto — IA atrai geografia mais ampla)

**Adset 2 — WhatsApp Business + Vendas**
- Interesses: WhatsApp Business OR CRM OR Vendas B2B OR Processo comercial
- Localizacao: Mesma

**Adset 3 — Lookalike (ativar mes 2+)**
- Base: Custom Audience de quem completou o Raio-X Comercial (Funil 1)
- Lookalike 1%: melhor qualidade
- Lookalike 1-3%: volume para Funil 2

#### Publicos de Retargeting

| Publico | Janela | Uso |
|---------|--------|-----|
| Visitou LP Raio-X | 7 dias | Retargeting Campanha 2 |
| Cadastrou mas nao completou quiz | 14 dias | Retargeting Campanha 2 |
| Engajou perfil IG/FB Leilaine | 30 dias | Retargeting ambas campanhas |
| Assistiu 50%+ video | 14 dias | Retargeting com prova social |
| Completou Raio-X (Movimento/Maturacao) | 60 dias | Lookalike seed + exclusao de prospeccao |
| Email list (clientes + leads) | Ongoing | Lookalike seed + exclusao |

#### Custom Audiences para Criar (Dia 1)

1. **Website visitors** — Raio-X LP (pixelados)
2. **Website visitors** — Implementar IA LP (pixelados)
3. **Facebook/IG engagement** — 30 dias
4. **Video viewers 50%+** — 14 dias
5. **Lead list upload** — lista de emails existente da Leilaine
6. **Quiz completers** — evento CompleteRegistration

### 1.5 Orcamento e Protocolo de Teste

#### Fase 1: Validacao (Semanas 1-4)

| Campanha | Budget Diario | Budget Mensal | Nota |
|----------|--------------|---------------|------|
| Campanha 1 (Funil 1 — Fria) | R$100/dia | R$3.000 | 3 adsets x R$33/dia |
| Campanha 2 (Funil 1 — Retargeting) | R$30/dia | R$900 | Ativa a partir do dia 5 |
| Campanha 3 (Funil 2 — Fria) | R$0 | R$0 | Nao ativa na fase 1 |
| **Total Fase 1** | **R$130/dia** | **~R$3.900** | |

**Racional**: Comecar APENAS com o Funil 1 (Mestre). Validar o caminho completo — ad → LP → cadastro → quiz → resultado — antes de abrir um segundo funil. Funil 2 entra na fase 2.

#### Fase 2: Expansao (Semanas 5-8)

| Campanha | Budget Diario | Budget Mensal |
|----------|--------------|---------------|
| Campanha 1 (Funil 1 — Fria) | R$150/dia | R$4.500 |
| Campanha 2 (Funil 1 — Retargeting) | R$50/dia | R$1.500 |
| Campanha 3 (Funil 2 — Fria) | R$80/dia | R$2.400 |
| Campanha 4 (Funil 2 — Retargeting) | R$20/dia | R$600 |
| **Total Fase 2** | **R$300/dia** | **~R$9.000** |

#### Fase 3: Escala (Mes 3+)

- Escalar o que prova CPL < R$30 (Funil 1) ou CPL < R$15 (Funil 2)
- Regra: aumento maximo de 20-30% por semana em budget (proteger learning phase)
- Budget total: R$10K-R$15K/mes dependendo de ROI comprovado

#### Protocolo de Teste de Criativos

**Ordem de teste (hierarquia de impacto):**

1. **Hook (3 primeiros segundos)** — Testar 3 hooks por conceito
2. **Formato** — Video vs. Imagem vs. Carrossel
3. **Angulo** — Hormozi More Good vs. Less Bad vs. Status
4. **Copy do corpo** — Long vs. Short
5. **CTA** — Variacoes de texto

**Regra de kill**: 
- Se CPL > 2x target apos R$150 gastos (ou 500 impressoes): pausar
- Se CTR < 1% apos 1.000 impressoes: pausar
- Se taxa de cadastro < 20%: problema na LP, nao no criativo

**Regra de escala**:
- Se CPL < target e CTR > 2%: aumentar 20% budget a cada 3 dias
- Se ROAS comprovado no funil completo: duplicar adset (nao aumentar — duplicar)

### 1.6 Conceitos Criativos

#### FUNIL 1 — 5 Conceitos para o Raio-X Comercial

**Criativo A — "O Orcamento que Morreu" (Video, 30-60s)**
- Angulo Hormozi: **Less Bad** (o que evitam)
- Hook (3 opcoes para testar):
  1. "Voce mandou 40 orcamentos esse mes. Sabe quantos morreram sem resposta?"
  2. "35% dos orcamentos da sua vidracaria morreram essa semana. Sem follow-up."
  3. "Aquele orcamento de R$15 mil que voce mandou quinta-feira? Seu concorrente ja fechou."
- Corpo: Visual de WhatsApp com mensagens "visto" sem resposta. Contador subindo mostrando dinheiro perdido. Leilaine aparece: "Isso e o que eu chamo de Receita Invisivel. Quer ver quanto a sua empresa ta perdendo?"
- CTA: "Descubra em 6 minutos com o Raio-X Comercial gratuito"
- Formato: Video vertical (9:16) para Reels/Stories + horizontal (1:1) para Feed
- Direção de copy: Especifico para construcao civil. Mencionar "orcamento", "follow-up", "WhatsApp" — linguagem do ICP.

**Criativo B — "5 Gargalos" (Carrossel, 5-7 slides)**
- Angulo Hormozi: **More Good** (o que ganham)
- Hook slide: "5 gargalos que toda vidracaria/serralheria enfrenta (e nao sabe)"
- Slides:
  1. "O dono que vende e instala ao mesmo tempo"
  2. "Follow-up que nao existe — orcamento manda e esquece"
  3. "CRM? A gente usa WhatsApp e caderno"
  4. "Receita que oscila e ninguem sabe por que"
  5. "Um vendedor sai e leva a carteira inteira"
- Slide final: "O Raio-X Comercial mostra exatamente onde voce ta perdendo dinheiro. Gratuito, 6 minutos."
- CTA: "Fazer meu Raio-X"
- Direção de copy: Cada slide = 1 dor reconhecivel. Linguagem simples, direta. Visual escuro (navy), tipografia Cinzel headlines.

**Criativo C — "Receita Invisivel" (Imagem estatica)**
- Angulo Hormozi: **Less Bad** (custo da inacao)
- Visual: Numero grande "R$756.000/ano" com subtitulo "Quanto uma vidracaria perde em receita invisivel"
- Copy do ad:
  - Headline: "Sua vidracaria esta perdendo dinheiro que voce nao ve"
  - Primary text: "Orcamento sem follow-up. Lead que sumiu. Cliente antigo sem contato ha 6 meses. Isso tudo tem um numero. O Raio-X Comercial calcula o seu em 6 minutos. Gratuito."
  - CTA button: "Saiba Mais"
- Formato: 1080x1080 para Feed, 1080x1920 para Stories

**Criativo D — "Case Vidracaria" (Video Retargeting, 30-45s)**
- Angulo Hormozi: **Status** (como sao vistos)
- Hook: "Uma vidracaria em BH estava perdendo 35% dos orcamentos. Em 60 dias mudou completamente."
- Corpo: Leilaine conta o caso (anonimizado). Antes: caos no WhatsApp, sem CRM, dono trabalhando 14h. Depois: processo estruturado, follow-up automatico, dono focando em relacionamento. "O resultado? 12 propostas recuperadas que tinham morrido."
- CTA: "Quer ver onde ta o dinheiro que voce ta perdendo? Faz o Raio-X."
- Direção: Prova social para quem ja viu o primeiro ad mas nao converteu.

**Criativo E — "O Concorrente Que Cresce" (Imagem Retargeting)**
- Angulo Hormozi: **Risco Social** (Less Bad para Outros)
- Visual: Split screen — esquerda "Sua empresa" (WhatsApp bagunca, caderno), direita "Seu concorrente" (pipeline organizado, follow-up rodando)
- Copy: "Enquanto voce 'vai pensar', seu concorrente esta respondendo lead em 5 minutos com processo. Cada semana sem estrutura e receita que vai pra ele."
- CTA: "Fazer o Raio-X Comercial"

#### FUNIL 2 — 5 Conceitos para Implementar IA

**Criativo H — "IA sem Processo = Caos" (Video, 30-45s)**
- Angulo: **Less Bad** (o que evitam)
- Hook: "Todo mundo quer IA na empresa. 80% vai se frustrar. E o motivo e simples."
- Corpo: Leilaine explica que IA sem processo comercial estruturado so automatiza o caos. "E como colocar turbo num carro sem direcao." Quiz rapido pra descobrir se a empresa ta pronta.
- CTA: "Descubra em 3 minutos se sua empresa esta pronta para IA"

**Criativo I — "Quiz: Pronta pra IA?" (Imagem)**
- Angulo: **More Good** (o que ganham)
- Visual: Pergunta grande "Sua empresa esta pronta para IA no comercial?" com icone de quiz
- Copy: "7 perguntas. 3 minutos. Voce descobre se faz sentido implementar IA agora ou se tem um passo anterior que vai te economizar R$50 mil."
- CTA: "Fazer o Quiz"

**Criativo J — "3 Erros com IA" (Carrossel)**
- Angulo: **Less Bad**
- Slides:
  1. "Erro 1: Comprar chatbot sem ter processo de vendas"
  2. "Erro 2: Automatizar follow-up quando nao existe cadencia manual"
  3. "Erro 3: Esperar que IA substitua vendedor quando o problema e estrutural"
  4. "O caminho certo: diagnostico → arquitetura → so depois IA"
  5. "Descubra em 3 minutos se sua empresa esta pronta"
- CTA: "Fazer o Quiz de IA"

**Criativo K — "WhatsApp 24h" (Video)**
- Angulo: **More Good**
- Hook: "Seu cliente mandou mensagem as 23h. Quem respondeu?"
- Corpo: Demonstracao do conceito — agente ZNITH.AI respondendo no WhatsApp, qualificando, agendando. "Nao e chatbot generico. E um agente treinado no seu processo comercial."
- CTA: "Descubra se sua empresa esta pronta"

**Criativo L — "Concorrente com IA" (Imagem Retargeting)**
- Angulo: **Risco Social**
- Visual: "Enquanto voce pesquisa sobre IA, seu concorrente ja implementou e esta respondendo leads de madrugada."
- CTA: "Descubra em 3 minutos"

### 1.7 Camadas de Retargeting

```
CAMADA 1 (Quente — 7 dias)
├── Visitou LP mas nao cadastrou
├── Frequencia: max 2x/dia
└── Criativos: Case + Prova social + "Ja viu?"

CAMADA 2 (Morna — 14 dias)
├── Cadastrou mas nao completou quiz
├── Frequencia: max 1x/dia
└── Criativos: "Seu resultado esta esperando" + Receita Invisivel

CAMADA 3 (Engajamento — 30 dias)
├── Engajou IG/FB da Leilaine
├── Video viewers 50%+
├── Frequencia: max 1x/dia
└── Criativos: Conteudo educacional → CTA quiz

CAMADA 4 (Lookalike seed — ongoing)
├── Completou Raio-X (Movimento + Maturacao)
├── NAO e retargeting — e seed para Lookalike
└── Excluir de prospeccao
```

---

## 2. PAGINA — Estrategia de Landing Pages

### 2.1 Landing Page 1: Raio-X Comercial (/raio-x)

**Objetivo**: Converter visitante frio em cadastro + inicio do quiz
**Audiencia**: Dono/CEO construcao civil vindo de Meta Ads
**Tempo medio esperado na pagina**: 45-90 segundos antes do cadastro
**Device**: 80%+ mobile

#### Estrutura da Pagina (Secoes em ordem)

**ABOVE THE FOLD (Mobile-first — tudo que aparece antes do scroll)**

1. **Pre-headline** (1 linha, Montserrat, 14px, gold)
   - "Diagnostico comercial gratuito para vidracarias, serralherias e construtoras"

2. **Headline** (Cinzel, 28-32px mobile, branco)
   - Opcao A: "Quanto da sua receita esta escapando sem voce ver?"
   - Opcao B: "Sua operacao comercial tem um custo invisivel. Descubra qual."
   - Opcao C: "O Raio-X que mostra onde sua empresa esta perdendo dinheiro"

3. **Sub-headline** (Montserrat, 16px, cinza claro)
   - "15 perguntas. 6 minutos. Um relatorio com os 3 maiores gargalos da sua operacao comercial — gratis."

4. **CTA Button** (Gold #DF9F3E, 100% width mobile)
   - "Fazer Meu Raio-X Comercial →"
   - Subtexto abaixo do botao (12px, cinza): "Gratuito. Resultado imediato."

5. **Prova social rapida** (1 linha)
   - Foto pequena Leilaine + "Leilaine Campioto | 20+ anos estruturando operacoes comerciais | R$500M+ em vendas influenciadas"

**SCROLL 1 — Sintomas Reconheciveis (Problem Agitation)**

6. **Mini-headline**: "Reconhece algum desses sinais?"
7. **3 Cards de Sintoma** (icone gold + texto curto):
   - "Manda orcamento e nao sabe se voltaram" (follow-up ausente)
   - "Se voce tirar ferias, a empresa para" (dono-gargalo)
   - "Faturamento bom num mes, ruim no outro — sem saber por que" (imprevisibilidade)
8. **Texto de ponte**: "Se marcou pelo menos 1, sua operacao tem receita invisivel — dinheiro que escapa por falta de processo. O Raio-X mostra exatamente onde."

**SCROLL 2 — Como Funciona**

9. **3 Passos Visuais** (timeline vertical mobile):
   - Passo 1: "Responda 15 perguntas sobre sua operacao (6 min)"
   - Passo 2: "Receba seu perfil comercial + score instantaneo"
   - Passo 3: "Baixe o relatorio PDF com os 3 maiores gargalos e um plano de acao"

**SCROLL 3 — Autoridade**

10. **Bloco Leilaine** (foto, bio curta, credential):
    - "20+ anos no campo, nao no escritorio. R$500M+ em vendas estruturadas. Ja atendi vidracarias, serralherias e construtoras que faturavam bem mas improvisavam no comercial. O Raio-X e o mesmo diagnostico que eu faco em consultoria de R$35K — adaptado para voce fazer sozinho em 6 minutos."

**SCROLL 4 — CTA Final**

11. **CTA Repetido** (mesmo botao gold, 100% width)
    - "Fazer Meu Raio-X Comercial Gratuito →"

**O QUE NAO TEM NA PAGINA:**
- Menu de navegacao (zero distracao)
- Link para outras paginas
- Preco de qualquer produto
- Texto longo (cada secao e 3-5 linhas max)
- Depoimentos extensos (nao ha cases publicaveis ainda — usar credential da Leilaine)
- Footer com links (apenas logo + rodape minimo)

#### Headline Variations para Teste A/B

| Variacao | Headline | Angulo |
|----------|----------|--------|
| A (controle) | "Quanto da sua receita esta escapando sem voce ver?" | Receita Invisivel |
| B | "O dono que trabalha 14h e ainda perde venda: descubra por que" | Dono-gargalo |
| C | "Sua vidracaria manda orcamento e reza pro cliente voltar?" | Follow-up (nicho) |

Testar A vs B por 7 dias, vencedor vs C por mais 7 dias. Metrica de decisao: taxa de cadastro (nao de clique no ad — a conversao na pagina).

### 2.2 Landing Page 2: Implementar IA (/implementar-ia)

**Objetivo**: Converter visitante interessado em IA → cadastro + quiz de qualificacao rapida
**Audiencia**: Empresario com FOMO de IA, vindo de Meta Ads do Funil 2
**Device**: 80%+ mobile

#### Estrutura da Pagina

**ABOVE THE FOLD**

1. **Pre-headline**: "Quiz de diagnostico — 3 minutos"
2. **Headline** (3 opcoes):
   - A: "Sua empresa esta pronta para IA no comercial? Descubra em 3 minutos."
   - B: "Antes de gastar R$50K em IA, responda 7 perguntas."
   - C: "IA sem processo so acelera o caos. Voce esta do lado certo?"
3. **Sub-headline**: "7 perguntas rapidas para saber se faz sentido implementar IA agora — ou se tem um passo anterior que vai te economizar dinheiro."
4. **CTA Button** (Gold + Tech Blue accent): "Fazer o Quiz de IA →"
5. **Prova rapida**: Logo ZNITH.AI + "Diagnostico gratuito"

**SCROLL 1 — Os 2 Caminhos**

6. **Visual de bifurcacao**:
   - Caminho A: "Sua empresa JA tem processo comercial → IA vai acelerar"
   - Caminho B: "Sua empresa ainda improvisa → IA vai amplificar o problema"
   - "O quiz descobre em qual voce esta."

**SCROLL 2 — Por que nao pular direto pra IA**

7. **3 Bullet points**:
   - "80% das implementacoes de IA falham por falta de processo, nao de tecnologia"
   - "Um agente de WhatsApp sem cadencia de follow-up e um chatbot bonito que ninguem usa"
   - "A ZNITH primeiro diagnostica, depois implementa. Nessa ordem."

**SCROLL 3 — CTA Final**

8. **CTA Repetido**: "Descobrir Minha Prontidao para IA →"

**Pagina mais curta que a do Raio-X.** Funil 2 e volume — menos leitura, mais acao rapida. O quiz esta acima do fold em mobile (embed ou redirect imediato no CTA).

---

## 3. CADASTRO — Estrategia de Registro

### 3.1 Formulario do Raio-X Comercial (Funil 1)

**Filosofia**: Capturar o minimo para iniciar + qualificar pelo quiz. Nao pedir tudo upfront.

#### Step 1 — Pre-Quiz (Gate de Cadastro)

| Campo | Obrigatorio | Por que |
|-------|-------------|---------|
| Nome | Sim | Personalizacao do resultado |
| Email | Sim | Entrega do PDF + nurture |
| WhatsApp | Sim | Canal primario desse ICP — follow-up vai por aqui |
| Nome da empresa | Sim | Personalizacao do relatorio |
| Faturamento mensal | Sim (range) | Qualificacao basica + personalizacao de benchmarks |

**Faturamento — Opcoes de Range:**
- Ate R$50K/mes
- R$50K - R$150K/mes
- R$150K - R$500K/mes
- R$500K - R$1M/mes
- Acima de R$1M/mes

**Filtro automatico**: Faturamento "Ate R$50K/mes" recebe o quiz completo mas resultado diferente (Formacao invite, sem Leitura). Nao bloquear — mas nao direcionar para Expansao.

#### Design do Formulario

- **Layout**: Single column, 100% width mobile
- **Campos**: Input minimalista, fundo dark (#0D1828), borda gold sutil no focus
- **Labels**: Acima do campo, nao placeholder-only (acessibilidade + usabilidade)
- **Botao submit**: Gold #DF9F3E, texto "Comecar Meu Raio-X →"
- **Barra de progresso**: "Passo 1 de 2 — Seus dados" (cria expectativa de que o quiz e o passo 2)
- **Micro-copy abaixo do botao**: "Seus dados sao confidenciais. Nao compartilhamos com terceiros."
- **Erro de validacao**: Inline, imediato, cor vermelha suave com icone

#### Micro-Compromisso Strategy

**O cadastro NAO e o momento de vender.** O cadastro e o momento de criar investimento emocional:

1. **Antes do formulario**: "Em 6 minutos voce vai ter o diagnostico mais honesto que ja fizeram da sua operacao comercial."
2. **No formulario**: Barra de progresso visual mostra que o quiz e o proximo passo
3. **No submit**: Animacao suave → transicao para a primeira pergunta do quiz (sem pagina intermediaria desnecessaria)
4. **Durante o quiz**: Cada pergunta revelada progressivamente. Barra mostrando "Pergunta 3 de 15"
5. **No final do quiz**: "Calculando seu perfil..." (loading animado de 3-5 segundos — cria expectativa)

### 3.2 Formulario Implementar IA (Funil 2)

#### Step 1 — Pre-Quiz (Gate de Cadastro)

| Campo | Obrigatorio | Por que |
|-------|-------------|---------|
| Nome | Sim | Personalizacao |
| Email | Sim | Nurture |
| WhatsApp | Sim | Canal primario |
| Segmento | Sim (dropdown) | Routing — construcao civil vs. outros |
| Faturamento | Sim (range) | Qualificacao |

**Segmento — Opcoes:**
- Vidracaria / Serralheria
- Construtora
- Servicos B2B
- Industria
- Outro

**Motivo do campo "Segmento"**: Funil 2 atrai publico mais amplo que Funil 1. Precisamos saber se e construcao civil (ICP core) ou outro vertical para ajustar messaging e routing.

### 3.3 Thank You / Next Step Strategy

**Apos cadastro do Raio-X (Funil 1):**
- NAO mostrar pagina de "obrigado" estatica
- Transicao DIRETA para o quiz (primeira pergunta)
- Envio automatico de email + WhatsApp de confirmacao em background:
  - Email: "Seu Raio-X Comercial esta em andamento. Complete para receber o resultado."
  - WhatsApp (automatico via Evolution API): "Oi [nome]! Aqui e da ZNITH. Voce comecou o Raio-X Comercial. Responde as 15 perguntas e recebe seu diagnostico na hora."

**Apos cadastro do Quiz IA (Funil 2):**
- Transicao DIRETA para o quiz de 7 perguntas
- Mesmo padrao de email + WhatsApp em background

**Se abandonar no meio do quiz:**
- Trigger apos 24h sem completar:
  - WhatsApp: "Vi que voce comecou o Raio-X mas nao terminou. Faltam [X] perguntas pro resultado. Quer retomar de onde parou?"
  - Email: Subject "Seu Raio-X Comercial esta esperando" + link de retomada

### 3.4 Valor Imediato Entregue

**Regra**: O lead recebe valor ANTES de qualquer pitch.

| Momento | Valor Entregue |
|---------|---------------|
| Apos cadastro | Confirmacao + expectativa do que vai descobrir |
| Durante o quiz | Cada pergunta ja provoca reflexao ("Ha quanto tempo voce nao contata um cliente antigo?") |
| Resultado instantaneo | Score + perfil + top 3 gargalos na tela |
| PDF por email (< 5 min) | Relatorio completo com benchmarks e plano de acao |
| WhatsApp (< 1h) | Mensagem personalizada com destaque do perfil |

---

## 4. DIAGNOSTICO — Quiz / Scorecard Strategy

### 4.1 Raio-X Comercial — Design das Perguntas

**15 perguntas divididas em 5 blocos tematicos.** Cada bloco mapeia uma dimensao da arquitetura comercial:

#### Bloco 1: Pipeline e Prospeccao (3 perguntas)

**P1**: "Como novos clientes chegam ate voce hoje?"
- ( ) Quase 100% indicacao/boca a boca
- ( ) Maioria indicacao + alguma busca ativa
- ( ) Mix equilibrado entre indicacao e prospecao ativa
- ( ) Tenho canais ativos gerando leads constantemente
*Score: 0 / 1 / 2 / 3*

**P2**: "Voce sabe quantos orcamentos/propostas sua empresa enviou no ultimo mes?"
- ( ) Nao tenho esse numero
- ( ) Tenho uma ideia mas nao e preciso
- ( ) Sei o numero exato
- ( ) Sei o numero, a taxa de conversao e o ticket medio
*Score: 0 / 1 / 2 / 3*

**P3**: "Quanto tempo em media leva para responder um novo lead?"
- ( ) Mais de 24 horas (ou nao tenho controle)
- ( ) Entre 4 e 24 horas
- ( ) Entre 1 e 4 horas
- ( ) Menos de 1 hora, com processo definido
*Score: 0 / 1 / 2 / 3*

#### Bloco 2: Follow-up e Cadencia (3 perguntas)

**P4**: "O que acontece depois que voce manda um orcamento?"
- ( ) Espero o cliente retornar
- ( ) Faco follow-up quando lembro
- ( ) Tenho uma rotina de follow-up mas nao e sistematica
- ( ) Tenho cadencia definida: 1o contato em X dias, 2o em Y, etc.
*Score: 0 / 1 / 2 / 3*

**P5**: "Dos orcamentos enviados nos ultimos 3 meses, qual % voce estima que 'sumiu' sem resposta?"
- ( ) Mais de 40%
- ( ) Entre 25% e 40%
- ( ) Entre 10% e 25%
- ( ) Menos de 10% (acompanho todos)
*Score: 0 / 1 / 2 / 3*

**P6**: "Quantos clientes antigos (que ja compraram) voce contactou nos ultimos 6 meses?"
- ( ) Nenhum ou quase nenhum
- ( ) Alguns, quando lembro ou quando eles me procuram
- ( ) Tenho uma rotina de reativacao parcial
- ( ) Todos sao contactados sistematicamente
*Score: 0 / 1 / 2 / 3*

#### Bloco 3: Processo e Playbook (3 perguntas)

**P7**: "Sua empresa tem um processo de vendas documentado (com etapas claras do primeiro contato ao fechamento)?"
- ( ) Nao, cada um vende do seu jeito
- ( ) Temos uma ideia geral mas nao esta escrito
- ( ) Temos documentado mas nao e seguido consistentemente
- ( ) Documentado, treinado e seguido pela equipe
*Score: 0 / 1 / 2 / 3*

**P8**: "Se um novo vendedor entrar amanha, em quanto tempo ele consegue vender sozinho?"
- ( ) Meses — depende de aprender na pratica comigo
- ( ) Algumas semanas — tenho que treinar pessoalmente
- ( ) 1-2 semanas — tenho material parcial de treinamento
- ( ) Menos de 1 semana — tenho playbook, scripts, processo documentado
*Score: 0 / 1 / 2 / 3*

**P9**: "Quem faz os orcamentos e propostas na empresa?"
- ( ) So eu, o dono
- ( ) Eu na maioria + alguem ajuda as vezes
- ( ) Tenho pessoa(s) designada(s) mas ainda dependo para os maiores
- ( ) Equipe faz orcamentos com autonomia e criterio definido
*Score: 0 / 1 / 2 / 3*

#### Bloco 4: Ferramentas e Dados (3 perguntas)

**P10**: "Qual ferramenta voce usa para gerenciar clientes e vendas?"
- ( ) Caderno / agenda / memoria
- ( ) WhatsApp + planilha
- ( ) CRM (Pipedrive, RD Station, HubSpot, outro) — uso parcial
- ( ) CRM integrado com dados confiaveis e atualizados
*Score: 0 / 1 / 2 / 3*

**P11**: "Voce consegue prever com confianca quanto vai faturar no proximo mes?"
- ( ) Nao, e sempre surpresa
- ( ) Tenho uma ideia vaga baseada no feeling
- ( ) Consigo estimar com +/- 30% de precisao
- ( ) Sim, com base no pipeline e historico — precisao de +/- 15%
*Score: 0 / 1 / 2 / 3*

**P12**: "Voce sabe qual o custo de aquisicao de um novo cliente (quanto gasta para trazer cada cliente)?"
- ( ) Nunca pensei nisso
- ( ) Sei que gasto mas nao tenho o numero
- ( ) Tenho uma estimativa aproximada
- ( ) Sei exatamente, por canal
*Score: 0 / 1 / 2 / 3*

#### Bloco 5: Equipe e Governanca (3 perguntas)

**P13**: "Se voce tirasse 2 semanas de ferias, o que aconteceria com as vendas?"
- ( ) Param quase totalmente
- ( ) Caem significativamente (mais de 50%)
- ( ) Funcionam parcialmente — perco as negociacoes maiores
- ( ) Continuam normalmente — equipe e processo funcionam sem mim
*Score: 0 / 1 / 2 / 3*

**P14**: "As informacoes sobre clientes e negociacoes estao na cabeca de alguem ou em um sistema?"
- ( ) 90%+ na cabeca de uma ou duas pessoas
- ( ) Maioria na cabeca, algo em planilha/WhatsApp
- ( ) Dividido entre sistema e cabeca das pessoas
- ( ) 90%+ em sistema acessivel a todos que precisam
*Score: 0 / 1 / 2 / 3*

**P15**: "Com que frequencia voce analisa seus numeros comerciais (propostas, conversao, faturamento)?"
- ( ) Quase nunca — vejo quando o contador fecha o mes
- ( ) Mensalmente, de forma rapida
- ( ) Quinzenalmente, com alguma estrutura
- ( ) Semanalmente, com reuniao e indicadores definidos
*Score: 0 / 1 / 2 / 3*

### 4.2 Logica de Scoring

**Score maximo**: 45 pontos (15 perguntas x 3 pontos max)

| Perfil | Score | % | Descricao |
|--------|-------|---|-----------|
| **Operacao em Caos** | 0-15 | 0-33% | Sem processo, sem dados, dono = empresa |
| **Operacao em Movimento** | 16-27 | 34-60% | Algo funciona, mas sem direcao |
| **Operacao em Maturacao** | 28-38 | 61-84% | Base solida, falta arquitetura integrada |
| **Operacao em Governo** | 39-45 | 85-100% | Estrutura completa, governada |

**Sub-scores por bloco** (para o PDF):
- Pipeline e Prospeccao: /9
- Follow-up e Cadencia: /9
- Processo e Playbook: /9
- Ferramentas e Dados: /9
- Equipe e Governanca: /9

O PDF mostra o radar chart com as 5 dimensoes. O gap visual entre o score atual e o benchmark e mais persuasivo que qualquer copy.

### 4.3 Pagina de Resultado — Estrategia por Perfil

#### Perfil CAOS (0-15 pontos)

**Headline**: "Sua operacao esta no modo sobrevivencia. A boa noticia: tem solucao."
**Tom**: Educacional sem ser condescendente. Validar o esforco. Mostrar o caminho.
**Conteudo**:
- Score visual + radar chart mostrando gaps
- "Os 3 gargalos mais criticos da sua operacao:" (gerados dinamicamente baseado nas respostas mais baixas)
- Benchmarks: "Empresas do seu porte com processo estruturado convertem 35-40% dos orcamentos. Sua operacao indica que voce esta abaixo de 20%."
- "Seu proximo passo": Convite para workshop/formacao gratuita (nao para Leitura Estrategica — nao esta pronto)
**CTA**: "Baixar meu Relatorio Completo (PDF)" + "Conhecer a Formacao ZNITH"
**NAO mostrar**: Preco de consultoria, oferta direta de Expansao

#### Perfil MOVIMENTO (16-27 pontos)

**Headline**: "Sua operacao tem energia. Falta direcao."
**Tom**: Direto, com urgencia calibrada. Esse perfil e o sweet spot.
**Conteudo**:
- Score visual + radar chart
- "Os 3 gargalos que mais custam na sua operacao:" (dinamico)
- Receita Invisivel estimada: "Baseado nas suas respostas, estimamos que sua operacao perde entre R$[X] e R$[Y] por ano em receita invisivel." (calculado com base no faturamento informado + gaps de follow-up e pipeline)
- Case anonimizado: "Uma vidracaria com perfil similar ao seu recuperou R$[Z] em 90 dias ao estruturar o processo comercial."
**CTA Principal**: "Agendar Leitura Estrategica com Leilaine (45 min, gratuito)" → /agendar
**CTA Secundario**: "Baixar meu Relatorio Completo (PDF)"

#### Perfil MATURACAO (28-38 pontos)

**Headline**: "Sua operacao tem base. Falta a arquitetura que transforma base em escala."
**Tom**: Premium. Esse lead e o mais valioso. Tratar como par.
**Conteudo**:
- Score visual + radar chart
- "Voce ja esta a frente de 80% das empresas do seu porte. Os gaps que restam sao os mais caros — e os mais invisiveis."
- Receita Invisivel: Calculo refinado (gaps menores mas de alto valor em empresas maiores)
- Posicionamento premium: "A Leitura Estrategica e normalmente reservada para empresas ja em movimento. Sua operacao se qualifica."
**CTA Principal**: "Agendar Leitura Estrategica Prioritaria" → /agendar
**CTA Secundario**: "Baixar Relatorio" + "Conhecer o ZNITH.AI OS"

#### Perfil GOVERNO (39-45 pontos)

**Headline**: "Parabens. Sua operacao e referencia."
**Tom**: Celebratorio. Esse nao e prospect de Expansao — e parceiro ou indicador potencial.
**Conteudo**:
- Score visual
- "Voce esta entre os 5% de empresas com operacao comercial estruturada."
- Convite para rede de referencia / Lideres Leoes
- Oferta de ZNITH.AI OS como aceleracao (nao como correcao)
**CTA**: "Conhecer o Programa de Parceria ZNITH" + "Baixar Relatorio"

### 4.4 Engenharia de Valor do PDF

O PDF e o entregavel mais importante de todo o funil. Se ele parecer um lead magnet generico, o funil morre. Se parecer um entregavel de consultoria de R$5K, o funil converte.

#### Estrutura do PDF (5-7 paginas)

**Capa**:
- Logo ZNITH
- "Raio-X Comercial"
- Nome da empresa
- Data
- "Diagnostico confidencial"

**Pagina 1 — Resumo Executivo**:
- Score geral: [X] de 45
- Perfil: [Caos / Movimento / Maturacao / Governo]
- Radar chart com 5 dimensoes
- 1 paragrafo de interpretacao (gerado dinamicamente)

**Pagina 2 — Receita Invisivel Estimada**:
- Calculo baseado nos dados informados
- Follow-up leakage (formula com numeros do lead)
- Dormant client leakage
- Total anual estimado
- Visual do template "Receita Invisivel" (ver objection-mapping.md)

**Pagina 3 — Os 3 Maiores Gargalos**:
- Top 3 perguntas com menor score
- Para cada uma: o que significa, qual o custo, e o benchmark do setor

**Pagina 4 — Benchmarks do Setor**:
- Comparacao do score do lead vs. media do setor (construcao civil)
- Comparacao por dimensao
- Dados de referencia (SEBRAE, ABRAVIDRO, benchmarks ZNITH)

**Pagina 5 — Plano de Acao Recomendado**:
- 3 acoes prioritarias (baseadas nos gaps)
- Timeline sugerida (30/60/90 dias)
- "Proximo passo recomendado:" (CTA especifico por perfil)

**Pagina 6 — Sobre a ZNITH** (meia pagina):
- Leilaine bio (3 linhas)
- R$500M+
- "A ZNITH nao vende ferramenta. Constroi arquitetura comercial."
- CTA final com link para agendar

**Pagina 7 (opcional) — Metodologia**:
- As 5 fases do ZNITH.AI OS (visual)
- "O Raio-X e a fase 0 — a porta de entrada para quem quer governar, nao improvisar."

**Design do PDF**:
- Dark theme (navy base) — coerente com a marca
- Tipografia Cinzel + Montserrat
- Gold accents nos destaques
- Limpo, profissional, 0% de "lead magnet generico"
- Precisa parecer que foi feito sob medida (mesmo sendo automatizado)

### 4.5 CTA Strategy por Perfil de Resultado

| Perfil | CTA Primario | CTA Secundario | Email Sequence | WhatsApp Follow-up |
|--------|-------------|----------------|----------------|-------------------|
| Caos | Formacao gratuita | PDF download | Sequencia B (nurture longo) | Sim, educacional |
| Movimento | Leitura Estrategica | PDF download | Sequencia A (Arq. Invisivel, 7 emails) | Sim, ativo |
| Maturacao | Leitura Estrategica Prioritaria | ZNITH.AI OS info | Sequencia A (versao premium) | Sim, prioritario |
| Governo | Programa Parceria | PDF download | Carta da Leilaine | Sim, networking |

---

## 5. LOW-TICKET — 5 Sugestoes de Produto (R$27-R$197)

### Racional Estrategico

O gap entre o BAIT gratuito (Raio-X) e o MIDDLE de R$35K (Expansao) e enorme. A Leitura Estrategica (gratis, 45 min) funciona como bridge, mas tem dois problemas:

1. **Nao escala** — depende 100% do tempo da Leilaine
2. **Nao gera receita** — e custo puro ate converter

Low-ticket resolve ambos: gera receita para financiar trafego (self-liquidating offer) e qualifica pelo comportamento de compra (quem paga R$47 e infinitamente mais qualificado que quem so preenche um form).

### Produto 1: ZNITH Mapa Comercial (R$47)

**O que e**: Template interativo (Notion ou Google Sheets) para mapear a operacao comercial da empresa em 1 hora. O lead preenche e sai com o "mapa" visual da operacao — pipeline, equipe, ferramentas, gaps.

**O que entrega**:
- Template pre-formatado com 6 secoes (Pipeline, Follow-up, Equipe, Ferramentas, Metricas, Governanca)
- Video guia de Leilaine (20 min) explicando como preencher
- Checklist "15 sinais de que sua operacao esta desgovernada"
- Bonus: Planilha "Calculadora de Receita Invisivel" (a mesma formula do Raio-X, autopreenchivel)

**Por que funciona para o ICP**:
- Dono de vidracaria quer algo pratico, nao teoria
- "Mapear" e tangivel — ele sai com um documento real
- R$47 e impulso — nao precisa pensar
- O mapa que ele preenche mostra os gaps que a Expansao resolve

**Bridge para Expansao**: O video guia termina com: "Se voce preencheu e viu mais de 3 gaps vermelhos, a Leitura Estrategica e o proximo passo. Agende aqui."

**Fluxo do funil**:
Ad → LP Raio-X → Resultado (Movimento/Maturacao) → "Quer ir mais fundo? O Mapa Comercial mostra cada detalhe." → Checkout R$47 → Entrega + upsell para Leitura

### Produto 2: ZNITH Playbook Express (R$97)

**O que e**: Playbook comercial template para construcao civil — pronto para personalizar. Documento editavel com scripts de venda, cadencia de follow-up, regras de pipeline, e dashboard basico.

**O que entrega**:
- Playbook editavel (Google Docs) com 25+ paginas
- 5 scripts de abordagem especificos para vidracaria/serralheria
- Cadencia de follow-up de 7 toques (template WhatsApp + email)
- Dashboard de metricas comerciais (Google Sheets)
- Video guia de Leilaine (30 min) sobre como personalizar e implantar
- Bonus: Template de proposta comercial premium (editavel)

**Por que funciona**:
- "Playbook" e aspiracional — todo dono quer ter um mas nunca fez
- Especifico para construcao civil (nao generico) — valida a autoridade da ZNITH no nicho
- R$97 = "se resolver 1 follow-up perdido ja pagou"
- O ato de tentar implantar sozinho gera a percepcao de que precisa de ajuda profissional

**Bridge para Expansao**: "O Playbook Express e 20% do que a Expansao entrega. Se voce quer a arquitetura completa — implantada, nao apenas documentada — a Leitura Estrategica e o proximo passo."

**Fluxo do funil**:
Ad direto (ou pos-Raio-X) → LP Playbook Express → Checkout R$97 → Thank You Page com OTO (oferta unica) do Masterclass → Entrega → upsell Leitura

### Produto 3: ZNITH Masterclass "Receita Invisivel" (R$147)

**O que e**: Aula gravada de Leilaine (90 min) ensinando como calcular a Receita Invisivel da operacao e montar um plano de acao de 30 dias. Nao e teoria — e workshop pratico com exercicios.

**O que entrega**:
- Video aula (90 min) em modulo unico
- Planilha de calculo de Receita Invisivel (a mesma metodologia do objection-mapping, auto-preenchivel)
- Checklist "30 dias para parar de perder orcamento"
- Template de cadencia de follow-up (7 toques)
- Acesso a comunidade fechada WhatsApp (90 dias) — networking com outros donos

**Por que funciona**:
- "Receita Invisivel" e o conceito mais poderoso da ZNITH — quantifica a dor
- R$147 filtra o curioso do comprometido
- A comunidade WhatsApp cria prova social em tempo real
- O exercicio de calcular a propria receita invisivel e o "aha moment" que converte pra Expansao

**Bridge para Expansao**: Ao final da masterclass, Leilaine apresenta: "Agora voce sabe o numero. Quer que eu construa a arquitetura que resolve? A Leitura Estrategica e o proximo passo."

**Fluxo do funil**:
Ad dedicado (ou Order Bump do Playbook) → LP Masterclass → Checkout R$147 → Thank You + Upsell Leitura Estrategica → Entrega → Comunidade WhatsApp → Nurture → Leitura

### Produto 4: ZNITH Kit Orcamento que Fecha (R$67)

**O que e**: Kit completo para transformar a forma como a empresa faz e acompanha orcamentos. Especifico para construcao civil.

**O que entrega**:
- Template de proposta comercial premium (3 modelos: vidracaria, serralheria, construtora)
- Script de apresentacao do orcamento (o que falar antes de mandar o PDF)
- Cadencia de follow-up pos-orcamento (5 mensagens WhatsApp template)
- Video "Por que 35% dos orcamentos morrem" (15 min, Leilaine)
- Calculadora: "Quanto voce perde por orcamento sem follow-up"

**Por que funciona**:
- "Orcamento" e a linguagem nativa do ICP — nao e "proposta comercial", e "orcamento"
- Dor especifica e aguda: todo dono de vidracaria sabe que manda orcamento e nao ve resposta
- R$67 = preco de 1 hora de trabalho — baixissima fricao
- Resultado imediato: comecar a usar no mesmo dia

**Bridge para Expansao**: "O Kit resolve o sintoma mais urgente. A Expansao resolve a causa — toda a arquitetura comercial, nao apenas o orcamento."

### Produto 5: ZNITH Auditoria Flash (R$197)

**O que e**: Auditoria em video da operacao comercial do lead, feita pela equipe ZNITH com base em dados que o lead preenche. Entrega: video gravado de 15-20 min com diagnostico personalizado.

**O que entrega**:
- Formulario detalhado de 25 perguntas (mais profundo que o Raio-X)
- Video personalizado (gravado por Leilaine ou Arquiteto Comercial ZNITH) com:
  - Analise dos 3 maiores gaps
  - Estimativa de Receita Invisivel com os numeros reais da empresa
  - Plano de acao recomendado
- PDF resumo da auditoria

**Por que funciona**:
- E o mais proximo de "contratar consultoria" sem o compromisso de R$35K
- Video personalizado tem taxa de conversao brutal — o lead vê que alguem olhou a operacao dele
- R$197 filtra para leads altamente comprometidos
- 80%+ dos que compram a Auditoria Flash vao agendar Leitura

**Bridge para Expansao**: O video termina com: "Esse diagnostico e um raio-x. O que a Expansao faz em 8 semanas e a cirurgia. Se faz sentido, agende a Leitura."

**Fluxo do funil**:
Pos-Raio-X (perfil Maturacao apenas) → Email/WhatsApp ofertando → Checkout R$197 → Formulario detalhado → Producao do video (48h) → Entrega → Leitura Estrategica

### 5.1 Resumo dos Low-Tickets e Sequencia de Oferta

```
RAIO-X GRATUITO (resultado na tela + PDF)
    │
    ├── Perfil CAOS → Nurture → Formacao (eventual)
    │
    ├── Perfil MOVIMENTO → 
    │   ├── Oferta imediata: Kit Orcamento (R$67) — Order Bump
    │   ├── Upsell: Playbook Express (R$97) — Thank You Page
    │   ├── Email D+3: Masterclass Receita Invisivel (R$147)
    │   └── Email D+7: CTA Leitura Estrategica (gratis)
    │
    └── Perfil MATURAÇÃO →
        ├── Oferta imediata: Auditoria Flash (R$197) — resultado page
        ├── Email D+1: CTA Leitura Estrategica Prioritaria
        └── Se nao agenda: Masterclass (R$147) como fallback
```

### 5.2 Tabela Comparativa

| Produto | Preco | Formato | Esforco ZNITH | Bridge Quality | SLO Potential |
|---------|-------|---------|--------------|----------------|---------------|
| ZNITH Mapa Comercial | R$47 | Template + video | Baixo (1x) | Medio | Alto |
| ZNITH Kit Orcamento | R$67 | Templates + scripts | Baixo (1x) | Alto (dor aguda) | Alto |
| ZNITH Playbook Express | R$97 | Documento editavel + video | Medio (1x) | Alto | Alto |
| ZNITH Masterclass | R$147 | Video gravado + comunidade | Medio (1x) | Muito Alto | Medio |
| ZNITH Auditoria Flash | R$197 | Video personalizado | Alto (por lead) | Altissimo | Baixo (nao escala) |

**SLO (Self-Liquidating Offer) Potential**: Capacidade de gerar receita suficiente para cobrir o custo de aquisicao do lead. Kit Orcamento e Mapa Comercial sao os melhores SLOs por serem produzidos 1 vez e vendidos infinitamente.

---

## 6. NUMEROS E PROJECOES

### 6.1 CPL Esperado por Funil

| Metrica | Funil 1 (Raio-X) | Funil 2 (IA) |
|---------|------------------|---------------|
| CPC estimado | R$3-6 | R$2-4 |
| CTR estimado (ad) | 1.5-3% | 2-4% |
| Taxa de cadastro (LP) | 25-35% | 30-40% |
| **CPL (cadastro)** | **R$10-20** | **R$6-12** |
| Taxa de completacao quiz | 65-75% | 75-85% |
| **CPL (quiz completo)** | **R$15-28** | **R$8-15** |

**Racional**: 
- Funil 1 tem CPC maior (nicho restrito, menos volume) mas lead mais qualificado
- Funil 2 tem CPC menor (IA e trending, mais volume) mas lead menos qualificado
- Taxa de cadastro do Funil 1 menor porque pede mais campos (WhatsApp, faturamento)
- Taxa de completacao do quiz IA maior porque sao 7 perguntas vs 15

### 6.2 Taxas de Conversao por Estagio

#### Funil 1 (Mestre — Raio-X → Expansao)

| Estagio | Conversao | Acumulado |
|---------|-----------|-----------|
| Ad → Clique | 1.5-3% CTR | — |
| Clique → Cadastro | 25-35% | — |
| Cadastro → Quiz completo | 65-75% | — |
| **Quiz → Lead qualificado (Movimento/Maturacao)** | **30-40%** | — |
| Lead qualificado → Leitura agendada | 20-30% | — |
| Leitura agendada → Show-up | 75-85% | — |
| Show-up → Proposta enviada | 70-80% | — |
| Proposta → Contrato Expansao | 40-50% | — |
| **Cadastro → Contrato** | — | **~2-4%** |

#### Funil 2 (IA → Agente ou Redirect)

| Estagio | Conversao |
|---------|-----------|
| Cadastro → Quiz completo | 75-85% |
| Quiz → Qualificado IA (score alto) | 20-25% |
| Quiz → Redirect Funil 1 | 45-50% |
| Quiz → Desqualificado | 25-30% |
| Qualificado IA → Call agendada | 25-35% |
| Call → Contrato ZNITH.AI | 30-40% |
| Redirect → Raio-X completo | 25-35% |

### 6.3 Cenarios de Orcamento

#### CENARIO 1: R$3.000/mes (Conservador — Fase 1)

| Metrica | Funil 1 Only |
|---------|-------------|
| Budget mensal | R$3.000 |
| Cliques (CPC R$4.5 medio) | 667 |
| Cadastros (30% conv) | 200 |
| Quiz completos (70%) | 140 |
| Leads qualificados (35%) | 49 |
| Leituras agendadas (25%) | 12 |
| Show-ups (80%) | 10 |
| Propostas (75%) | 7-8 |
| **Contratos Expansao (45%)** | **3-4** |
| **Receita bruta** | **R$105K-R$140K** |
| **ROI** | **35x-47x** |

**Nota**: Esses numeros assumem funil validado. Nos primeiros 30 dias, esperar 50-60% dessas taxas enquanto o pixel aprende e a LP e otimizada.

#### CENARIO 2: R$5.000/mes (Moderado — Fase 2)

| Metrica | Funil 1 | Funil 2 | Total |
|---------|---------|---------|-------|
| Budget | R$3.000 | R$2.000 | R$5.000 |
| Cadastros | 200 | 250 | 450 |
| Quiz completos | 140 | 200 | 340 |
| Leads qualificados F1 | 49 | 50 (redirect) | 99 |
| Leads qualificados F2 (IA) | — | 45 | 45 |
| Leituras agendadas | 15 | — | 15 |
| Contratos Expansao | 4-5 | — | 4-5 |
| Contratos ZNITH.AI | — | 3-4 | 3-4 |
| **Receita Expansao** | **R$140-175K** | — | **R$140-175K** |
| **Receita ZNITH.AI** | — | **R$24-32K** | **R$24-32K** |
| **Receita total** | — | — | **R$164-207K** |
| **ROI total** | — | — | **33x-41x** |

Low-ticket adicional estimado (20% dos leads qualificados compram algo R$47-R$197):
- 99 leads qualificados x 20% x R$80 ticket medio = **R$1.584/mes** (ajuda a subsidiar o trafego)

#### CENARIO 3: R$10.000/mes (Agressivo — Fase 3)

| Metrica | Funil 1 | Funil 2 | Total |
|---------|---------|---------|-------|
| Budget | R$6.000 | R$4.000 | R$10.000 |
| Cadastros | 400 | 500 | 900 |
| Quiz completos | 280 | 400 | 680 |
| Leads qualificados F1 | 98 | 100 (redirect) | 198 |
| Leads qualificados F2 (IA) | — | 90 | 90 |
| Leituras agendadas | 30 | — | 30 |
| Contratos Expansao | 8-10 | — | 8-10 |
| Contratos ZNITH.AI | — | 6-8 | 6-8 |
| **Receita Expansao** | — | — | **R$280-350K** |
| **Receita ZNITH.AI** | — | — | **R$48-64K** |
| **Receita low-ticket** | — | — | **~R$3.2K** |
| **Receita total** | — | — | **R$331-417K** |
| **ROI total** | — | — | **33x-42x** |

**ATENCAO — Bottleneck da Leilaine**: Com R$10K/mes, o funil gera ~30 Leituras/mes. Isso e 7-8 por semana, cada uma de 45 min. Leilaine precisa dedicar 6-8 horas/semana SO para Leituras. Se nao tem essa disponibilidade, nao escalar para esse nivel sem segundo Arquiteto Comercial.

### 6.4 Analise de Break-Even

**Pergunta**: Quanto preciso investir para fechar 1 Expansao?

| Variavel | Valor |
|----------|-------|
| CPL (quiz completo) | R$20 (media) |
| Leads qualificados necessarios para 1 Leitura | 4-5 |
| Leituras necessarias para 1 Expansao | 2.5-3 |
| **Leads qualificados por Expansao** | **10-15** |
| **Quizzes completos por Expansao** | **30-40** |
| **Custo de aquisicao por Expansao (CAC)** | **R$600-R$800** |
| **Ticket medio Expansao** | **R$35.000** |
| **ROI por contrato** | **44x-58x** |

O break-even acontece no PRIMEIRO contrato fechado. 1 Expansao = R$35K. Custo de trafego para gerar 1 Expansao = R$600-R$800. Isso significa que com R$3K/mes, se fechar pelo menos 1 contrato, o trafego ja se pagou 44x.

**Break-even em low-ticket (para SLO)**:
- Se 20% dos cadastros compram low-ticket medio de R$67:
- 200 cadastros x 20% x R$67 = R$2.680/mes
- Budget do funil: R$3.000/mes
- Self-liquidation ratio: 89% (quase break-even SO com low-ticket)
- Com 25% de conversao ou ticket medio de R$80: **SLO positivo** — o trafego se paga antes de qualquer Expansao

### 6.5 Metricas de Monitoramento Semanal

| Metrica | Target | Alarme |
|---------|--------|--------|
| CPL (cadastro) | < R$20 | > R$30 |
| CPL (quiz completo) | < R$28 | > R$40 |
| CTR do ad | > 1.5% | < 1% |
| Taxa cadastro LP | > 25% | < 18% |
| Taxa completacao quiz | > 65% | < 50% |
| % qualificados (Mov+Mat) | > 30% | < 20% |
| Leituras agendadas / qualificados | > 20% | < 12% |
| Show-up rate | > 75% | < 60% |
| Custo por Leitura agendada | < R$150 | > R$250 |
| Conversao low-ticket | > 15% | < 8% |

**Quando os alarmes disparam:**

| Alarme | Diagnostico Provavel | Acao |
|--------|---------------------|------|
| CPL alto | Publico errado ou criativo fraco | Testar novos hooks, revisar targeting |
| CTR baixo | Hook nao funciona | Testar 3 novos hooks, pausar criativos < 1% |
| Taxa cadastro baixa | LP nao converte | Testar headlines, simplificar form, checar mobile |
| Completacao quiz baixa | Quiz longo demais ou confuso | Revisar UX, testar 12 perguntas vs 15 |
| Poucos qualificados | Trafego errado | Restringir targeting, mais nichado |
| Leituras baixas | Nurture fraco ou CTA fraco | Revisar sequencia email/WhatsApp |
| Show-up baixo | Falta de confirmacao/lembrete | Adicionar WhatsApp 24h + 1h antes |

---

## 7. TIMELINE DE IMPLEMENTACAO

### Semana 1-2: Infraestrutura
- [ ] Pixel Meta instalado + eventos configurados (Lead, CompleteRegistration, Purchase)
- [ ] LP Raio-X Comercial construida e publicada
- [ ] Quiz Raio-X Comercial funcional (15 perguntas + scoring)
- [ ] Paginas de resultado (4 variantes) prontas
- [ ] PDF automatizado gerado por perfil
- [ ] Integracao email (confirmacao + Sequencia A)
- [ ] Integracao WhatsApp (boas-vindas automatica)
- [ ] Custom Audiences criadas no Meta

### Semana 3-4: Lancamento Fase 1
- [ ] Criativos A, B, C produzidos (Funil 1)
- [ ] Campanha 1 criada (PAUSED) → aprovacao Moroni/Leilaine → ativar
- [ ] Campanha 2 (retargeting) preparada → ativar dia 5
- [ ] Monitoramento diario nos primeiros 7 dias
- [ ] Primeiro ciclo de kill/scale de criativos

### Semana 5-6: Otimizacao + Low-Ticket
- [ ] LP Implementar IA construida
- [ ] Quiz IA funcional (7 perguntas)
- [ ] Primeiro low-ticket produzido (Kit Orcamento R$67 — mais rapido de criar)
- [ ] Checkout integrado (Hotmart, Eduzz ou Kiwify)
- [ ] Order bump configurado na pagina de resultado do Raio-X

### Semana 7-8: Expansao Fase 2
- [ ] Campanhas 3 e 4 (Funil 2) ativadas
- [ ] Segundo low-ticket produzido (Playbook Express R$97)
- [ ] Review completo de metricas das primeiras 4 semanas
- [ ] Decisao de escala baseada em dados

### Mes 3+: Escala
- [ ] Masterclass Receita Invisivel gravada (R$147)
- [ ] Auditoria Flash estruturada (R$197)
- [ ] Lookalike audiences ativadas
- [ ] Budget scaling conforme ROI

---

## CHANGELOG

| Data | Versao | Autor | Alteracoes |
|------|--------|-------|-----------|
| 2026-05-18 | v1.0 | CMO Strategist (Reis IA) | Estrategia completa: 6 secoes, campanhas Meta Ads, LPs, cadastro, diagnostico, 5 low-tickets, projecoes financeiras |
