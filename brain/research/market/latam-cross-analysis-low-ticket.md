# Análise Cruzada: Low-Ticket Brasil vs. Projeção LATAM

> Last updated: 2026-05-01
> Owner: market-research-analyst
> Status: Active
> Depends on: `latam-ai-market-analysis.md`, `funnel-low-ticket-strategy.md`, protocol_agentesia_low_ticket

---

## 1. Setup Atual Brasil (Baseline)

### Produto
| Item | Valor |
|------|-------|
| Nome | AGENTES [IA] / Agent Squad |
| Preço final | R$47 (~US$8,40 @ 5,60 BRL/USD) |
| Preço original testado | R$67 (reduzido para R$47) |
| Checkout | Ticto (checkout.ticto.app/OC6E9568E) |
| Entrega | Hub REIS IA (hub-reisia.vercel.app) + WhatsApp |
| Conteúdo | 40+ agentes, 7 squads, 12 videoaulas (~3h), templates, PDF |
| Garantia | 7 dias |

### Campanha Brasil Ativa
| Item | Valor |
|------|-------|
| Campanha | Agent Squad IA — Conversoes — 2026-04 |
| Status | ACTIVE desde 29/04/2026 |
| Budget | R$50/dia |
| Ad Account | act_1690330771143511 (Moroni Reis) |
| Pixel | 434040298956723 (AGENTES IA LOW TICKET) |
| Objetivo | OUTCOME_SALES (Purchase) |
| Criativos | 12 vídeos (Ad_01 a Ad_12) |
| Targeting | Brasil, 25-65, Advantage Audience |
| CAPI | Ticto webhook → Supabase → Meta CAPI (purchase event) |
| CTA | SHOP_NOW |

### Unit Economics Projetada Brasil
| Métrica | Valor |
|---------|-------|
| CPC médio | R$1,50-3,00 |
| CTR do anúncio | 1,5-3% |
| CPM Brasil | ~R$23,50 (US$4,20) |
| Conversão LP | 3-5% |
| CPA (custo por venda) | R$30-60 |
| Ticket | R$47 |
| Break-even | Sim com conv. >3% |
| LTV completo funil | R$214-294 (low-ticket + Hub R$497 + mentoria) |

### 5 Ângulos de Criativos Testados
1. **Desafio Direto**: "Você ainda tá usando ChatGPT como Google?"
2. **Prova de Produção**: "Isso aqui substituiu 7 profissionais"
3. **Custo da Inação**: "Sabe quanto custa um time de marketing?"
4. **Bastidores**: "Deixa eu te mostrar como toco meu negócio"
5. **Contra-narrativa**: "Quase ninguém usa IA de verdade pra ganhar dinheiro"

---

## 2. Projeção LATAM — Cenários por País

### Premissas Compartilhadas
- **Preço LATAM**: US$9 (manter em dólar, checkout converte para moeda local)
- **Moroni fala espanhol como nativo** → elimina o maior risco (conteúdo não-nativo)
- **Mesmos 12 criativos regravados em espanhol** (mesmo formato, hooks adaptados culturalmente)
- **Checkout**: Ticto Global ou Hotmart (ambos suportam moedas locais + Oxxo/Efecty/Rapipago)
- **CAPI**: mesmo webhook ticto.ts, pixel separado para LATAM
- **LP**: versão em espanhol (agentesia.moronireis.com.br/es ou domínio .com)

### 2.1 Colômbia (CPM mais barato)

**Cenário Conservador (CTR 1,5%, Conv 3%)**:
| Métrica | Valor |
|---------|-------|
| CPM | US$2,00 |
| CPC | US$0,13 |
| Cliques/dia (US$9 budget) | ~69 cliques |
| Vendas/dia | ~2,1 vendas |
| CPA | US$4,33 |
| Receita/dia | US$18,90 |
| ROAS | **2,10x** |
| Lucro bruto/dia | US$9,90 |

**Cenário Otimista (CTR 3%, Conv 5%)**:
| Métrica | Valor |
|---------|-------|
| CPC | US$0,07 |
| Cliques/dia | ~128 cliques |
| Vendas/dia | ~6,4 vendas |
| CPA | US$1,40 |
| ROAS | **6,43x** |
| Lucro bruto/dia | US$48,60 |

### 2.2 México (Maior mercado)

**Cenário Conservador (CTR 1,5%, Conv 3%)**:
| Métrica | Valor |
|---------|-------|
| CPM | US$3,92 |
| CPC | US$0,26 |
| Cliques/dia (US$9 budget) | ~35 cliques |
| Vendas/dia | ~1,0 venda |
| CPA | US$8,67 |
| Receita/dia | US$9,00 |
| ROAS | **1,04x** |
| Lucro bruto/dia | US$0,33 |

**Cenário Otimista (CTR 3%, Conv 5%)**:
| Métrica | Valor |
|---------|-------|
| CPC | US$0,13 |
| Cliques/dia | ~69 cliques |
| Vendas/dia | ~3,5 vendas |
| CPA | US$2,57 |
| ROAS | **3,50x** |
| Lucro bruto/dia | US$22,50 |

### 2.3 Argentina (Maior adoção de IA)

**Cenário Conservador (CTR 1,5%, Conv 3%)**:
| Métrica | Valor |
|---------|-------|
| CPM | ~US$2,50 |
| CPC | US$0,17 |
| Cliques/dia (US$9 budget) | ~53 cliques |
| Vendas/dia | ~1,6 vendas |
| CPA | US$5,67 |
| Receita/dia | US$14,40 |
| ROAS | **1,59x** |
| Lucro bruto/dia | US$5,40 |

**Cenário Otimista (CTR 3%, Conv 5%)**:
| Métrica | Valor |
|---------|-------|
| CPC | US$0,08 |
| Cliques/dia | ~112 cliques |
| Vendas/dia | ~5,6 vendas |
| CPA | US$1,61 |
| ROAS | **5,59x** |
| Lucro bruto/dia | US$41,40 |

### 2.4 Chile (Mais maduro em IA)

**Cenário Conservador (CTR 1,5%, Conv 3%)**:
| Métrica | Valor |
|---------|-------|
| CPM | US$2,44 |
| CPC | US$0,16 |
| Cliques/dia (US$9 budget) | ~56 cliques |
| Vendas/dia | ~1,7 vendas |
| CPA | US$5,33 |
| Receita/dia | US$15,30 |
| ROAS | **1,69x** |
| Lucro bruto/dia | US$6,30 |

**Cenário Otimista (CTR 3%, Conv 5%)**:
| Métrica | Valor |
|---------|-------|
| CPC | US$0,08 |
| Cliques/dia | ~112 cliques |
| Vendas/dia | ~5,6 vendas |
| CPA | US$1,61 |
| ROAS | **5,59x** |
| Lucro bruto/dia | US$41,40 |

---

## 3. Comparativo Direto: Brasil vs. LATAM

### CPM/CPC
| País | CPM (USD) | vs. Brasil | CPC Est. (USD) |
|------|-----------|-----------|----------------|
| **Brasil** | **$4,20** | baseline | **$0,28** |
| Colômbia | $2,00 | **-52%** | $0,13 |
| Chile | $2,44 | **-42%** | $0,16 |
| Argentina | ~$2,50 | **-40%** | $0,17 |
| México | $3,92 | **-7%** | $0,26 |

### CPA Comparado (cenário conservador)
| País | CPA | vs. Brasil | ROAS |
|------|-----|-----------|------|
| **Brasil** | **R$30-60 (~US$5,35-10,70)** | baseline | **0,78-1,57x** |
| Colômbia | US$4,33 | **-19% a -60%** | **2,10x** |
| Chile | US$5,33 | **-0,4% a -50%** | **1,69x** |
| Argentina | US$5,67 | **+6% a -47%** | **1,59x** |
| México | US$8,67 | **+62% a -19%** | **1,04x** |

### Projeção 30 dias (US$9/dia por país = US$36/dia total = ~R$200/dia)

**Cenário Conservador (todos os 4 países, US$9/dia cada)**:
| Métrica | México | Colômbia | Argentina | Chile | **TOTAL** |
|---------|--------|----------|-----------|-------|-----------|
| Budget 30d | US$270 | US$270 | US$270 | US$270 | **US$1.080** |
| Vendas | 30 | 63 | 48 | 51 | **192** |
| Receita | US$270 | US$567 | US$432 | US$459 | **US$1.728** |
| Lucro bruto | US$0 | US$297 | US$162 | US$189 | **US$648** |
| ROAS | 1,00x | 2,10x | 1,60x | 1,70x | **1,60x** |

**Cenário Otimista (CTR 3%, Conv 5%)**:
| Métrica | México | Colômbia | Argentina | Chile | **TOTAL** |
|---------|--------|----------|-----------|-------|-----------|
| Budget 30d | US$270 | US$270 | US$270 | US$270 | **US$1.080** |
| Vendas | 105 | 192 | 168 | 168 | **633** |
| Receita | US$945 | US$1.728 | US$1.512 | US$1.512 | **US$5.697** |
| Lucro bruto | US$675 | US$1.458 | US$1.242 | US$1.242 | **US$4.617** |
| ROAS | 3,50x | 6,40x | 5,60x | 5,60x | **5,28x** |

---

## 4. Vantagem Competitiva Decisiva: Moroni Fala Espanhol

Este é o fator que muda toda a equação. A análise anterior recomendava "contratar copywriter hispanófono" como primeiro passo. **Isso não é necessário.**

### O que isso elimina:
1. **Custo de tradução/adaptação**: R$0 (Moroni faz)
2. **Delay de produção**: Zero — grava os mesmos 12 vídeos em espanhol
3. **Risco de tom artificial**: Zero — fala como nativo
4. **Custo de suporte**: Moroni responde direto no WhatsApp em espanhol
5. **Credibilidade**: Brasileiro que fala espanhol = ponte cultural natural

### O que isso habilita:
1. **Velocidade de lançamento**: Pode gravar criativos em espanhol essa semana
2. **Mesma autenticidade**: O formato "Moroni fala direto pra câmera" funciona igual
3. **Personalização cultural**: Pode adaptar hooks para cada país (mexicanismos, etc.)
4. **Teste rápido**: Não precisa esperar contratação — testa com R$200/dia amanhã

---

## 5. O Que Precisa Mudar para LATAM

### 5.1 Landing Page
| Item | Brasil Atual | LATAM |
|------|-------------|-------|
| Idioma | Português | Espanhol |
| URL | agentesia.moronireis.com.br | agentesia.moronireis.com.br/es ou domínio .com |
| Preço exibido | R$47 | US$9 (com conversão local no checkout) |
| Provas sociais | R$300K em contratos | US$55K+ em contratos (converter) |
| "Time de marketing custa R$25K" | Valores em reais | Valores em dólares ou moeda local |
| FAQ | PT-BR | Espanhol |
| Pixel | 434040298956723 | Novo pixel LATAM (recomendado separar) |

### 5.2 Checkout
| Item | Brasil | LATAM |
|------|--------|-------|
| Plataforma | Ticto | Ticto Global ou Hotmart |
| Moeda | BRL | USD (com conversão local automática) |
| Métodos | Pix, cartão, boleto | Cartão, Oxxo (MX), Efecty (CO), Rapipago (AR), Mercado Pago |
| Webhook | ticto.ts (existente) | Mesmo endpoint ou novo para LATAM |
| CAPI | Pixel 434040298956723 | Novo pixel LATAM |

### 5.3 Criativos (12 vídeos)
| Item | Brasil | LATAM |
|------|--------|-------|
| Idioma | Português | Espanhol (Moroni grava) |
| Hooks | 5 ângulos PT-BR | Mesmos 5 ângulos em espanhol (adaptados) |
| Formato | Vídeo direto câmera | Idêntico |
| Duração | 30-60s | Idêntico |
| Legendas | PT-BR | Espanhol |
| Quantidade | 12 ads | 12 ads (mesma estrutura) |

### 5.4 Produto/Entrega
| Item | Brasil | LATAM |
|------|--------|-------|
| Agentes | 40+ (CLAUDE.md em PT) | 40+ (CLAUDE.md em espanhol — adaptar) |
| Videoaulas | 12 aulas PT-BR | 12 aulas em espanhol (regravar) |
| Templates | PT-BR | Espanhol |
| WhatsApp | Grupo BR | Grupo LATAM separado |
| Hub | hub-reisia.vercel.app | Mesmo hub (adicionar i18n?) ou seção separada |

---

## 6. Adaptação dos 5 Ângulos para Espanhol

### Ângulo 1 — Desafío Directo
**BR**: "Você ainda tá usando ChatGPT como Google?"
**LATAM**: "¿Sigues usando ChatGPT como si fuera Google? Mira esto."

### Ângulo 2 — Prueba de Producción Real
**BR**: "Isso aqui substituiu 7 profissionais no meu negócio."
**LATAM**: "Esto reemplazó a 7 profesionales en mi negocio."

### Ângulo 3 — El Costo de No Actuar
**BR**: "Sabe quanto custa um time de marketing? R$25K por mês no mínimo."
**LATAM**: "¿Sabes cuánto cuesta un equipo de marketing? US$5,000 al mes mínimo."

### Ângulo 4 — Detrás de Cámaras
**BR**: "Deixa eu te mostrar como eu toco o meu negócio inteiro com IA."
**LATAM**: "Déjame mostrarte cómo manejo todo mi negocio con IA."

### Ângulo 5 — Contra-Narrativa
**BR**: "Todo mundo fala de IA. Quase ninguém usa de verdade pra ganhar dinheiro."
**LATAM**: "Todos hablan de IA. Casi nadie la usa de verdad para ganar dinero."

---

## 7. Concorrência LATAM vs. Posição REIS [IA]

| Competidor | Preço | vs. REIS [IA] US$9 |
|------------|-------|---------------------|
| cursoclaudecode.com | EUR 297 (~US$320) | **35x mais caro** |
| CodeClaud.com | EUR 97 (~US$105) | **12x mais caro** |
| Platzi (assinatura) | ~US$49/mês | **5x mais caro (recorrente)** |
| Hotmart cursos agentes | US$20-100 | **2-11x mais caro** |
| NocodeHackers | Grátis | Gratuito mas básico |
| claudecodecurso.com | TBD (lista espera) | Não lançou |
| **REIS [IA] Agentes** | **US$9** | **Preço mais baixo do mercado com conteúdo comparável ao de US$100+** |

**Gap competitivo**: Ninguém oferece a combinação US$9 + Claude Code + monetização + 40 agentes + 3h vídeo + comunidade. A REIS [IA] entra como o produto de entrada mais agressivo da categoria.

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Bot traffic 20-30% | Alta | Médio | Otimizar para Purchase, nunca tráfego/cliques |
| Conversão LP menor (público frio, novo mercado) | Média | Alto | Testar LP localizada, não apenas traduzida |
| Suporte em espanhol sobrecarrega Moroni | Média | Médio | Grupo WhatsApp com FAQ pinado + automação |
| Ticto/Hotmart taxa internacional maior | Baixa | Baixo | Margem de US$9 absorve taxa de 10-15% |
| Volatilidade cambial Argentina | Alta | Baixo | Preço em USD, checkout converte automaticamente |
| Produto precisa adaptação (agentes em PT) | Certa | Médio | Adaptar CLAUDE.md e prompts para espanhol |
| Pirataria/compartilhamento | Média | Baixo | Preço tão baixo que não vale piratear |
| Pixel novo sem dados/learning phase | Certa | Médio | Começar com Advantage+ amplo, deixar o Meta otimizar |

---

## 9. Plano de Execução Prático

### Semana 1 — Preparação (custo: R$0)
- [ ] Renovar token Meta (expirou 29/04)
- [ ] Criar LP em espanhol (clonar agent-squad-lp, traduzir)
- [ ] Configurar checkout LATAM no Ticto Global (ou Hotmart) — US$9
- [ ] Criar pixel Meta separado para LATAM
- [ ] Gravar 4-6 criativos de vídeo em espanhol (dos 5 ângulos)
- [ ] Adaptar CLAUDE.md dos agentes para espanhol (produto entregue)

### Semana 2 — Lançamento Teste
- [ ] Criar campanha Meta: "Agentes IA — LATAM — Conversoes — 2026-05"
- [ ] 2 ad sets: México (US$9/dia) + Colômbia (US$9/dia) = ~R$100/dia total
- [ ] 4-6 criativos em espanhol por ad set
- [ ] Advantage Audience, 25-65, otimização Purchase
- [ ] Configurar CAPI (webhook ticto → pixel LATAM)
- [ ] Criar grupo WhatsApp LATAM

### Semana 3-4 — Análise e Decisão
- [ ] Analisar: CPA, ROAS, CTR, conv rate por país
- [ ] **GO se**: CPA < US$5 em pelo menos 1 país, ROAS > 1,5x
- [ ] **ESCALAR se GO**: adicionar Argentina + Chile (US$9/dia cada)
- [ ] **NO-GO se**: CPA > US$8 em ambos após otimização de criativos
- [ ] Testar variações de hook/criativo nos winners

### Mês 2 — Escala (se GO)
- [ ] Aumentar budget 20%/semana nos países validados
- [ ] Target: R$200-300/dia LATAM total
- [ ] Gravar mais criativos em espanhol (6-12 novos)
- [ ] Iniciar upsell LATAM (Hub em espanhol? Ou mentoria?)
- [ ] Explorar parcerias com influenciadores locais

---

## 10. Projeção Financeira 90 Dias

### Cenário Conservador (ROAS 1,6x médio LATAM)

| Mês | Budget LATAM | Vendas | Receita | Lucro Bruto |
|-----|-------------|--------|---------|-------------|
| Mês 1 | US$540 (~R$3.024) | 96 | US$864 | US$324 |
| Mês 2 | US$900 (~R$5.040) | 160 | US$1.440 | US$540 |
| Mês 3 | US$1.350 (~R$7.560) | 240 | US$2.160 | US$810 |
| **Total** | **US$2.790 (~R$15.624)** | **496** | **US$4.464** | **US$1.674** |

**+ Backend (Hub + Mentoria)**:
- 496 compradores × 7,5% conv Hub × US$89 = US$3.319
- 37 membros Hub × 4% conv mentoria × US$536 = US$803
- **Backend total: ~US$4.122**
- **Revenue total 90d: US$8.586 (~R$48.081)**

### Cenário Otimista (ROAS 4x médio LATAM)

| Mês | Budget LATAM | Vendas | Receita | Lucro Bruto |
|-----|-------------|--------|---------|-------------|
| Mês 1 | US$540 | 240 | US$2.160 | US$1.620 |
| Mês 2 | US$1.200 | 533 | US$4.797 | US$3.597 |
| Mês 3 | US$2.000 | 889 | US$8.001 | US$6.001 |
| **Total** | **US$3.740 (~R$20.944)** | **1.662** | **US$14.958** | **US$11.218** |

**+ Backend**: 1.662 × 7,5% × US$89 = US$11.094 (Hub) + mentoria ~US$2.670
- **Revenue total 90d: US$28.722 (~R$160.843)**

---

## 11. Decisão Final

### O caso é forte. Os números:

1. **Moroni fala espanhol nativo** — elimina o maior custo e risco
2. **CPMs 40-52% menores** que Brasil em 3 dos 4 países
3. **Zero concorrência** no price point de US$9
4. **Mesmo funil validado** — replica, não inventa
5. **Investimento de teste**: ~R$3.000 (30 dias) — risco controlado
6. **Upside**: 496-1.662 novos clientes LATAM em 90 dias

### O que falta para começar:
1. Renovar token Meta (5 min)
2. Gravar 4-6 vídeos em espanhol (1 tarde)
3. Clonar e traduzir LP (dev-agent, 2-3h)
4. Configurar checkout LATAM (1h)
5. Criar campanha + pixel (traffic-manager, 30 min)

**Investimento total de setup: ~1 dia de trabalho + R$3K em ads.**
**Potencial de retorno: R$48K-161K em 90 dias (low-ticket + backend).**

---

## Fontes
- `brain/research/market/latam-ai-market-analysis.md` — análise de mercado LATAM completa
- `brain/strategy/funnel-low-ticket-strategy.md` — estratégia de funil low-ticket
- `.claude/projects/.../memory/protocol_agentesia_low_ticket.md` — protocolo operacional
- `.claude/agent-memory/creative-strategist/project_agentes_ia_competitive_intel.md` — inteligência competitiva
