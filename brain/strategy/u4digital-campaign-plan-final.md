# u4digital — Plano de Campanha Meta Ads: PRONTO PARA EXECUCAO

**Versao**: 1.0 FINAL
**Data**: 2026-05-15
**Owner**: cmo-strategist
**Status**: PRONTO PARA EXECUCAO — aguardando apenas token valido da conta de anuncios
**Conta de Anuncios**: act_1497187178472890 (u4digital, BRL)
**Landing Page**: https://u4digital.com.br/raio-x
**Orcamento Inicial**: R$200 (fase de teste)

---

> AVISO DE SEGURANCA (ads-safety.md): Todas as campanhas serao criadas PAUSADAS.
> Nenhuma campanha sera ativada sem aprovacao explicita do Moroni.
> Nenhum budget acima de R$100/dia sera configurado sem aprovacao.

---

## SUMARIO EXECUTIVO

Plano operacional completo para a primeira rodada de Meta Ads da u4digital. Objetivo: gerar leads qualificados para o Raio-X Digital (diagnostico gratuito de 35 minutos). Com R$200, o foco e descobrir: (1) qual angulo converte, (2) qual formato performa, (3) qual audiencia tem menor CPL.

**Criativos disponiveis**: 5 videos legendados (landscape 1280x720), 7 videos verticais (WhatsApp/vertical), 18 estaticos (9 em 1080x1920 + 9 em 1080x1080). Total: 30 pecas.

**Meta**: 8-25 leads no teste. 1 venda ja paga o investimento 15-40x.

---

# SECAO 1 — PIXEL & TRACKING

## 1.1 Meta Pixel

**Acao**: Criar novo pixel dentro de act_1497187178472890 ou usar pixel existente da conta.

**Nome do Pixel**: `u4digital-raio-x`

### Eventos a Configurar

| Evento | Trigger | Prioridade | Metodo |
|--------|---------|------------|--------|
| `PageView` | Carregamento de qualquer pagina do site | P0 | Automatico com pixel base |
| `ViewContent` | Carregamento da pagina /raio-x | P0 | Automatico (PageView na pagina) |
| `Lead` | Envio do formulario / clique no CTA de agendamento | P0 | Evento customizado no submit |
| `Schedule` | Confirmacao de agendamento no Cal.com | P1 | Custom event via thank-you page ou redirect |

### Codigo de Instalacao do Pixel

Inserir no `<head>` de todas as paginas de u4digital.com.br:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID_AQUI');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=PIXEL_ID_AQUI&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

### Evento Lead (no submit do formulario ou clique do CTA)

```javascript
// Disparar quando o usuario clica em "Agendar Raio-X" ou submete formulario
fbq('track', 'Lead', {
  content_name: 'Raio-X Digital',
  content_category: 'Diagnostico Gratuito',
  value: 0,
  currency: 'BRL'
});
```

### Evento Schedule (na pagina de confirmacao do Cal.com)

```javascript
// Disparar na thank-you page apos agendamento confirmado
fbq('track', 'Schedule', {
  content_name: 'Agendamento Raio-X',
  value: 0,
  currency: 'BRL'
});
```

### Noscript fallback para Lead

```html
<!-- Colocar na thank-you page apos o form submit -->
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=PIXEL_ID_AQUI&ev=Lead&noscript=1"
/></noscript>
```

## 1.2 Conversion API (CAPI) — Consideracoes

Para a fase de teste com R$200, o pixel client-side e suficiente. CAPI deve ser implementado quando:

- Volume de leads ultrapassar 20/semana (dados suficientes para o algoritmo)
- Escalar para R$1.000+/mes em ads
- Necessidade de deduplicacao de eventos (browser blockers)

**Implementacao futura**: via Supabase Edge Function que envia eventos server-side para a Conversions API. Usar `event_id` para deduplicar com o pixel client-side.

## 1.3 Estrutura de UTMs

**Padrao**: `?utm_source=meta&utm_medium=paid&utm_campaign=[CAMPANHA]&utm_content=[CRIATIVO]&utm_term=[ANGULO]`

### UTMs por Campanha

| Campanha | utm_campaign | utm_content | utm_term |
|----------|-------------|-------------|----------|
| Campanha 1 — Video Cold | `u4d-video-cold-mai26` | `video_1` a `video_7` | `custo-time` / `tempo-ops` / `concorrente` |
| Campanha 2 — Static Cold | `u4d-static-cold-mai26` | `static_1` a `static_18` | `custo-comp` / `urgencia` / `chatgpt` |
| Campanha 3 — Video Vertical | `u4d-vertical-cold-mai26` | `vert_1` a `vert_7` | `custo-time` / `tempo-ops` |

**URL final de exemplo**:
```
https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-video-cold-mai26&utm_content=video_1&utm_term=custo-time
```

---

# SECAO 2 — ESTRUTURA DE CAMPANHA

## 2.1 Visao Geral

```
CAMPANHA 1: u4digital | Leads | Infoprodutores BR | Video Landscape — 2026-05
  └── Ad Set 1A: Infoprodutores + Ferramentas Digitais (R$35/dia × 3 dias = R$105)
      ├── Ad 1A-V1: video_1_legendado.mp4 — Angulo Custo do Time
      ├── Ad 1A-V2: video_2_legendado.mp4 — Angulo Tempo Operacional
      ├── Ad 1A-V3: video_3_legendado.mp4 — Angulo Dependencia
      ├── Ad 1A-V4: video_4_legendado.mp4 — Angulo Concorrente Automatizou
      └── Ad 1A-V5: video_5_legendado.mp4 — Angulo Margem Real

CAMPANHA 2: u4digital | Leads | Infoprodutores BR | Static Feed+Stories — 2026-05
  └── Ad Set 2A: Infoprodutores + Ferramentas Digitais (R$25/dia × 3 dias = R$75)
      ├── Ad 2A-S1: 2.png (1080x1080) — Comparativo Custo
      ├── Ad 2A-S2: 4.png (1080x1080) — Urgencia Mercado
      ├── Ad 2A-S3: 6.png (1080x1080) — Desobjecao ChatGPT
      ├── Ad 2A-S4: 1.png (1080x1920) — Custo do Time (Stories)
      └── Ad 2A-S5: 3.png (1080x1920) — CPL Subindo (Stories)

Reserva: R$20 (reforco do vencedor no dia 4)
```

**Budget Total**: R$105 + R$75 + R$20 reserva = R$200

### Por que 2 campanhas e nao 3

Com R$200, dividir em 3 campanhas deixa cada uma com ~R$67 — insuficiente para o Meta sair da fase de aprendizado. Duas campanhas (video vs. estatico) testam o formato mais impactante com dados suficientes. O teste de rosto/angulo acontece DENTRO de cada campanha via anuncios diferentes.

## 2.2 Detalhamento — Campanha 1 (Video)

| Campo | Valor |
|-------|-------|
| **Nome** | `u4digital \| Leads \| Infoprodutores BR \| Video Landscape — 2026-05` |
| **Objetivo** | LEAD_GENERATION (Instant Form) |
| **Otimizacao** | Leads (maximize volume) |
| **Budget Type** | Daily Budget |
| **Budget Amount** | R$35/dia |
| **Status Inicial** | PAUSED |
| **Special Ad Categories** | None |
| **Bidding Strategy** | Lowest Cost (padrao para conta nova) |

### Ad Set 1A — Infoprodutores + Ferramentas Digitais

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| AS \| Infoprodutores+Tools \| 27-48 \| BR — 2026-05` |
| **Localizacao** | Brasil (pais inteiro) |
| **Idade** | 27-48 |
| **Genero** | All |
| **Idioma** | Portugues |
| **Detailed Targeting** | Hotmart OR Kiwify OR "Lancamento digital" OR "Marketing digital" OR ActiveCampaign OR RD Station |
| **Placements** | Automatic (Advantage+ Placements) |
| **Optimization Event** | Lead |
| **Budget** | R$35/dia (herdado da campanha) |
| **Schedule** | Start: data de ativacao. End: aberto (pausar manualmente) |

### Anuncios — Campanha 1

#### Ad 1A-V1

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Video1 \| Custo-Time \| Moroni — 2026-05` |
| **Creative** | `video_1_legendado.mp4` (34.5 MB, 1280x720, ~1:29) |
| **Primary Text** | Voce fatura R$40K. Depois do time, das ferramentas, dos freelancers — sobra quanto?{break}{break}Fiz esse calculo com dezenas de experts nos ultimos meses. O numero que aparece quase sempre surpreende.{break}{break}Na u4digital, a gente mapeia o custo operacional real e identifica o que pode virar agente de IA — treinado na sua voz, rodando sem parar, custando a fracao de um salario CLT.{break}{break}Diagnostico gratuito. 35 minutos. Voce ve o agente funcionando ao vivo no contexto do seu negocio. |
| **Headline** | Quanto seu time custa de verdade? |
| **Description** | Raio-X Digital gratuito — 35 min. Veja o agente ao vivo. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-video-cold-mai26&utm_content=video_1&utm_term=custo-time` |

#### Ad 1A-V2

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Video2 \| Tempo-Ops \| Tiago — 2026-05` |
| **Creative** | `video_2_legendado.mp4` (32.6 MB, 1280x720, ~1:16) |
| **Primary Text** | Se eu parar uma semana, tudo desanda.{break}{break}Ja ouvi isso de experts faturando R$70K/mes. E o sinal mais claro de que o negocio ainda nao tem estrutura — tem voce no centro de tudo.{break}{break}Na u4digital, identificamos quais processos do seu negocio podem rodar com agente de IA. Nao automacao generica — agente treinado com o seu vocabulario, seu metodo, suas objecoes.{break}{break}35 minutos de diagnostico. Sem pitch. Sem contrato. Voce ve funcionando ao vivo. |
| **Headline** | Seu negocio funciona sem voce? |
| **Description** | Diagnostico gratuito — veja o agente ao vivo em 35 min. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-video-cold-mai26&utm_content=video_2&utm_term=tempo-ops` |

#### Ad 1A-V3

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Video3 \| Dependencia \| — 2026-05` |
| **Creative** | `video_3_legendado.mp4` (35.3 MB, 1280x720, ~1:26) |
| **Primary Text** | 70% dos experts que faturam R$30K+ dependem de 1-2 pessoas-chave no time. Se o editor pede demissao, o proximo lancamento atrasa 3 semanas.{break}{break}Voce nao tem um sistema. Tem um castelo de cartas.{break}{break}A u4digital constroi agentes de IA que operam com a sua voz, no seu processo — sem ferias, sem rotatividade, sem dias ruins.{break}{break}Diagnostico gratuito de 35 minutos. Voce ve o mapa e decide. |
| **Headline** | Se 1 pessoa sair, o negocio trava? |
| **Description** | Agentes de IA sob medida para experts digitais. Raio-X gratuito. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-video-cold-mai26&utm_content=video_3&utm_term=dependencia` |

#### Ad 1A-V4

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Video4 \| Concorrente \| — 2026-05` |
| **Creative** | `video_4_legendado.mp4` (37.5 MB, 1280x720, ~1:08) |
| **Primary Text** | Seu concorrente opera com 2 pessoas + 5 agentes de IA. Lanca mais rapido, produz mais conteudo, responde mais rapido e gasta metade.{break}{break}Todo mes que passa, a distancia aumenta.{break}{break}A u4digital constroi agentes sob medida para experts digitais que faturam R$10K+/mes — com a sua voz, no seu processo, por uma fracao do custo do time.{break}{break}Raio-X Digital gratuito. 35 minutos. |
| **Headline** | Seu concorrente ja automatizou. E voce? |
| **Description** | Assessoria de IA para experts digitais. Diagnostico gratuito. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-video-cold-mai26&utm_content=video_4&utm_term=concorrente` |

#### Ad 1A-V5

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Video5 \| Margem \| — 2026-05` |
| **Creative** | `video_5_legendado.mp4` (17.4 MB, 1280x720, ~1:15) |
| **Primary Text** | Expert digital que fatura R$50K/mes:{break}{break}Gasta R$18-25K em time por mes.{break}Perde 3 semanas quando 1 pessoa sai.{break}Trabalha 55h+/semana no operacional.{break}{break}A u4digital constroi agentes de IA treinados com a sua voz que eliminam esse custo — sem voce precisar aprender nada.{break}{break}Raio-X Digital gratuito. Veja exatamente o que pode ser automatizado no seu negocio. |
| **Headline** | R$18K de time por mes. Ha uma alternativa. |
| **Description** | Assessoria de IA para experts digitais que faturam R$10K+/mes. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-video-cold-mai26&utm_content=video_5&utm_term=margem` |

---

## 2.3 Detalhamento — Campanha 2 (Static)

| Campo | Valor |
|-------|-------|
| **Nome** | `u4digital \| Leads \| Infoprodutores BR \| Static Feed+Stories — 2026-05` |
| **Objetivo** | LEAD_GENERATION (Instant Form) |
| **Otimizacao** | Leads (maximize volume) |
| **Budget Type** | Daily Budget |
| **Budget Amount** | R$25/dia |
| **Status Inicial** | PAUSED |
| **Special Ad Categories** | None |
| **Bidding Strategy** | Lowest Cost |

### Ad Set 2A — Infoprodutores + Ferramentas Digitais

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| AS \| Infoprodutores+Tools \| 27-48 \| BR — Static — 2026-05` |
| **Localizacao** | Brasil (pais inteiro) |
| **Idade** | 27-48 |
| **Genero** | All |
| **Idioma** | Portugues |
| **Detailed Targeting** | Hotmart OR Kiwify OR "Lancamento digital" OR "Marketing digital" OR ActiveCampaign OR RD Station |
| **Placements** | Automatic (Advantage+ Placements) |
| **Optimization Event** | Lead |
| **Budget** | R$25/dia (herdado da campanha) |

### Anuncios — Campanha 2

#### Ad 2A-S1

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Static2 \| Custo-Comp \| Feed — 2026-05` |
| **Creative** | `2.png` (1080x1080 — Feed) |
| **Primary Text** | SDR com encargos: R$3.700/mes.{break}Copywriter freelancer: R$2.500/mes.{break}CS de atendimento: R$2.800/mes.{break}Gestor de trafego: R$3.000/mes.{break}Ferramentas de suporte: R$2.000/mes.{break}{break}Total: R$14.000/mes.{break}{break}Agentes de IA cobrindo as mesmas funcoes — treinados na sua voz, operando 24h — custam uma fracao disso.{break}{break}O Raio-X Digital mapeia onde estao esses custos no seu negocio em 35 minutos. Gratuito. |
| **Headline** | Time vs. agente: R$14K ou R$2,8K? |
| **Description** | Raio-X Digital gratuito — 35 min, sem compromisso. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-static-cold-mai26&utm_content=static_2&utm_term=custo-comp` |

#### Ad 2A-S2

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Static4 \| Urgencia \| Feed — 2026-05` |
| **Creative** | `4.png` (1080x1080 — Feed) |
| **Primary Text** | CPL subiu 21% em 2025. Mais 12% em 2026.{break}{break}O mesmo resultado que voce tinha 18 meses atras hoje exige 33% mais investimento em trafego.{break}{break}Quem esta sobrevivendo a isso nao cortou despesa — redesenhou o custo operacional. Agentes de IA bem treinados produzem mais com menos. Nao e sobre tecnologia. E sobre margem.{break}{break}Diagnostico gratuito de 35 minutos. |
| **Headline** | CPL subiu 33% em 18 meses. |
| **Description** | Veja onde IA corta custo no seu negocio — gratis. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-static-cold-mai26&utm_content=static_4&utm_term=urgencia` |

#### Ad 2A-S3

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Static6 \| ChatGPT \| Feed — 2026-05` |
| **Creative** | `6.png` (1080x1080 — Feed) |
| **Primary Text** | "Ja uso ChatGPT."{break}{break}Bom. Mas o que voce esta usando e uma ferramenta generica que nao sabe quem e seu cliente, qual e sua oferta, ou como voce fala.{break}{break}Agente de IA treinado na sua voz aprende suas transcricoes de vendas, seus emails, seus scripts. Quando responde um lead, usa seus exemplos, suas perguntas, seu nivel de detalhe.{break}{break}70% das implementacoes de IA falham porque pararam no ChatGPT.{break}{break}Raio-X Digital gratuito — veja a diferenca ao vivo em 35 minutos. |
| **Headline** | ChatGPT nao e agente de IA. |
| **Description** | Diagnostico gratuito. Voce ve o agente no seu contexto. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-static-cold-mai26&utm_content=static_6&utm_term=chatgpt` |

#### Ad 2A-S4

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Static1 \| Custo-Time \| Stories — 2026-05` |
| **Creative** | `1.png` (1080x1920 — Stories/Reels) |
| **Primary Text** | Voce soma quanto gasta de time por mes?{break}{break}Editor. Designer. Social media. Gestor de trafego. Copy. Suporte.{break}{break}Agora divide pelo lucro liquido do ultimo lancamento.{break}{break}A u4digital constroi agentes de IA treinados com a sua voz, no seu processo — que cobrem boa parte do que esse time faz, por uma fracao do custo.{break}{break}Diagnostico gratuito. 35 minutos. |
| **Headline** | Seu negocio custa quanto por mes em time? |
| **Description** | Diagnostico gratuito para experts digitais que faturam R$10K+/mes. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-static-cold-mai26&utm_content=static_1&utm_term=custo-time` |

#### Ad 2A-S5

| Campo | Valor |
|-------|-------|
| **Nome** | `u4d \| Ad \| Static3 \| CPL \| Stories — 2026-05` |
| **Creative** | `3.png` (1080x1920 — Stories/Reels) |
| **Primary Text** | O mesmo resultado que voce tinha em 2024 hoje exige 33% mais em investimento de midia.{break}{break}Mais criativo. Mais teste. Mais time pra operar.{break}{break}Enquanto o topo do mercado resolve isso com agentes — que produzem, qualificam, atendem e monitoram por uma fracao do custo — a maior parte dos experts continua contratando pessoa pra resolver problema que ja tem solucao.{break}{break}Raio-X Digital — 35 min, gratuito. |
| **Headline** | Seu CPL sobe. O do seu concorrente nao. |
| **Description** | Assessoria de IA para experts digitais. Diagnostico gratuito. |
| **CTA Button** | LEARN_MORE |
| **URL** | `https://u4digital.com.br/raio-x?utm_source=meta&utm_medium=paid&utm_campaign=u4d-static-cold-mai26&utm_content=static_3&utm_term=cpl-subindo` |

---

## 2.4 Meta Instant Form — Configuracao

**Nome do formulario**: `u4digital — Raio-X Digital`

**Tipo**: More Volume (formulario simplificado — maximiza preenchimento)

### Perguntas

**Pergunta 1** (obrigatoria — multiple choice):
```
"Qual e o seu faturamento mensal atual?"
- Abaixo de R$10K
- R$10K - R$30K
- R$30K - R$80K
- Acima de R$80K
```

**Pergunta 2** (obrigatoria — multiple choice):
```
"Quantas pessoas tem no seu time hoje?"
- Trabalho sozinho
- 1-3 pessoas
- 4-8 pessoas
- 9+ pessoas
```

**Pergunta 3** (opcional — short answer):
```
"Qual area da sua operacao mais consome tempo?"
Placeholder: Ex: atendimento, producao de conteudo, gestao de trafego...
```

**Campos auto-preenchidos** (do perfil do Facebook):
- Nome completo
- Email
- Telefone (WhatsApp)

### Pagina de Agradecimento

**Headline**: "Recebemos sua inscricao para o Raio-X Digital"
**Descricao**: "Um consultor da u4digital vai entrar em contato pelo WhatsApp nas proximas horas para agendar o seu diagnostico gratuito."
**CTA Button**: "Visitar site" → `https://u4digital.com.br/raio-x`

### Webhook / Notificacao

Configurar webhook do Lead Form para notificar Moroni/Tiago em tempo real:
- Opcao A: Integrar via Zapier/Make → WhatsApp notification
- Opcao B: Facebook Lead Ads → CRM Sheets (puxar manualmente)
- Opcao C (recomendada para fase 1): App "Facebook Pages" no celular — notificacao push quando chega lead

---

# SECAO 3 — ESTRATEGIA DE AUDIENCIA

## 3.1 Audiencia Fria Principal: "Infoprodutores BR"

| Parametro | Configuracao |
|-----------|-------------|
| **Localizacao** | Brasil (inteiro) |
| **Idade** | 27-48 |
| **Genero** | Todos |
| **Idioma** | Portugues |
| **Interesses (OR)** | Hotmart, Kiwify, "Lancamento digital", "Marketing digital", ActiveCampaign, RD Station |
| **Tamanho estimado** | 2M-6M |

### Interesses Alternativos (para testes futuros — Fase 2+)

**Grupo B — Trafego Pago**:
- Pedro Sobral, "Gestao de trafego", Facebook Ads, Google Ads

**Grupo C — IA e Automacao**:
- ChatGPT, OpenAI, "Inteligencia artificial", Make (Integromat), Zapier

**Grupo D — Educacao Digital**:
- Erico Rocha, "Infoprodutos", Copywriting, "Email marketing"

## 3.2 Audiencias Custom (criar quando)

| Audiencia | Quando Criar | Requisito Minimo |
|-----------|-------------|-----------------|
| Visitantes do site (30 dias) | Apos instalar pixel e ter 1.000+ visitas | Pixel ativo |
| Video viewers 50%+ (14 dias) | Apos 7 dias de campanha ativa | Campanhas rodando |
| Interacoes Instagram (30 dias) | Quando conectar Instagram Business | Conta vinculada |
| Lead form openers (nao completaram) | Apos 20+ aberturas de formulario | Campanha rodando |

## 3.3 Audiencias Lookalike (quando criar)

| Tipo | Quando | Tamanho |
|------|--------|---------|
| LAL 1% de Leads | Apos 50 leads captados | 1% BR |
| LAL 1% de Agendamentos | Apos 20 agendamentos | 1% BR |
| LAL 1% de Clientes | Apos 3 clientes fechados (upload CSV) | 1% BR |

**NAO criar lookalike antes de ter a base minima. Com 0 dados, qualquer LAL sera aleatorio.**

## 3.4 Exclusoes

Na fase de teste, nao excluir ninguem — a audiencia ja e restrita o suficiente pelos interesses. Na fase de escala:

- Excluir leads ja captados (Custom Audience de leads)
- Excluir clientes ja ativos
- Excluir menores de 27 anos
- Excluir quem ja agendou

---

# SECAO 4 — FASEAMENTO DE BUDGET

## Fase 1: Teste (R$200) — Dias 1-7

| Item | Valor | Dias | Objetivo |
|------|-------|------|---------|
| Campanha 1 (Video) | R$105 | 3 dias x R$35/dia | Testar 5 angulos de video |
| Campanha 2 (Static) | R$75 | 3 dias x R$25/dia | Testar 5 estaticos |
| Reserva | R$20 | Dia 4-5 | Reforcar o melhor performer |

**Dias 1-3**: Rodar sem tocar. Nao pausar nada. Deixar o algoritmo explorar.
**Dia 4**: Primeira leitura. Alocar R$20 de reserva no melhor performer.
**Dias 5-7**: Leitura final. Ranking dos 10 anuncios por CPL.

## Fase 2: Validacao (R$500-1.000) — Criterio de Entrada

**GO para Fase 2 SE**:
- CPL medio < R$25 com pelo menos 5 leads
- CTR > 1% em pelo menos 3 anuncios
- Pelo menos 1 agendamento real confirmado

**Acao na Fase 2**:
- Manter os 3-4 melhores anuncios
- Pausar os piores performers
- Aumentar budget do Ad Set vencedor em 30% (maximo por alteracao)
- Testar audiencia alternativa (Grupo B ou C)
- Adicionar 2-3 videos verticais (WhatsApp videos disponiveis)
- Criar segunda campanha com angulos diferentes usando o rosto/formato vencedor

## Fase 3: Escala (R$2.000+/mes) — Criterio de Entrada

**GO para Fase 3 SE**:
- CPL < R$20 sustentavel por 7+ dias
- Pelo menos 3 Raio-X realizados
- Pelo menos 1 venda fechada
- ROI positivo confirmado

**Acao na Fase 3**:
- Escalar budget ate R$100/dia no Ad Set principal
- Criar Lookalike 1% com base nos leads
- Abrir campanhas de remarketing (visitantes site + video viewers)
- Testar novos formatos (carrossel, videos verticais)
- Produzir novos criativos com rosto/angulo vencedor

---

# SECAO 5 — REGRAS DE OTIMIZACAO

## 5.1 Kill Rules (quando pausar)

| Condicao | Acao |
|----------|------|
| Anuncio gastou R$30 sem nenhum lead | PAUSAR imediatamente |
| CTR (link) < 0,5% apos R$15 de spend | PAUSAR e trocar criativo |
| CTR < 0,3% apos R$10 | PAUSAR — criativo ignorado |
| CPL > R$50 apos R$50 de spend | PAUSAR e testar variacao |
| Nao pausar nada antes de R$15 de gasto | Dados insuficientes |

## 5.2 Scale Rules (quando aumentar)

| Condicao | Acao |
|----------|------|
| CPL < R$15 com 5+ leads | Adicionar R$20 reserva nesse Ad Set |
| CPL < R$10 sustentavel por 3 dias | Escalar para R$50/dia (aumento maximo 30%) |
| 3 anuncios com CPL < R$20 | Criar novo Ad Set com audiencia alternativa |
| NUNCA aumentar budget > 30% de uma vez | Proteger fase de aprendizado |

## 5.3 Rotacao de Criativos

**Fase 1 (R$200)**: Sem rotacao. Deixar os 10 anuncios competirem.
**Fase 2 (R$500-1K)**: Substituir anuncios com frequencia > 3.0 por novos criativos.
**Fase 3 (R$2K+)**: Rotacao semanal — adicionar 2-3 novos criativos por semana, pausar os esgotados.

## 5.4 KPI Benchmarks

| Metrica | Ruim | Aceitavel | Bom | Excelente |
|---------|------|-----------|-----|-----------|
| CPL | > R$50 | R$25-50 | R$15-25 | < R$15 |
| CTR (link) | < 0.5% | 0.5-1% | 1-2% | > 2% |
| CPC | > R$5 | R$3-5 | R$1.50-3 | < R$1.50 |
| CPM | > R$60 | R$40-60 | R$25-40 | < R$25 |
| Video hold 3s | < 30% | 30-40% | 40-55% | > 55% |
| Video hold 50% | < 15% | 15-25% | 25-35% | > 35% |
| Form completion rate | < 40% | 40-60% | 60-75% | > 75% |

---

# SECAO 6 — MAPEAMENTO COMPLETO DE CRIATIVOS

## 6.1 Videos Legendados (Landscape 1280x720)

| # | Arquivo | Tamanho | Duracao | Campanha | Ad Set | Nome do Anuncio | Primary Text (resumo) | Headline |
|---|---------|---------|---------|----------|--------|----------------|----------------------|----------|
| 1 | video_1_legendado.mp4 | 34.5 MB | ~1:29 | Camp 1 Video | AS 1A | u4d \| Ad \| Video1 \| Custo-Time \| — 2026-05 | Voce fatura R$40K... sobra quanto? | Quanto seu time custa de verdade? |
| 2 | video_2_legendado.mp4 | 32.6 MB | ~1:16 | Camp 1 Video | AS 1A | u4d \| Ad \| Video2 \| Tempo-Ops \| — 2026-05 | Se eu parar uma semana, tudo desanda... | Seu negocio funciona sem voce? |
| 3 | video_3_legendado.mp4 | 35.3 MB | ~1:26 | Camp 1 Video | AS 1A | u4d \| Ad \| Video3 \| Dependencia \| — 2026-05 | 70% dos experts dependem de 1-2 pessoas... | Se 1 pessoa sair, o negocio trava? |
| 4 | video_4_legendado.mp4 | 37.5 MB | ~1:08 | Camp 1 Video | AS 1A | u4d \| Ad \| Video4 \| Concorrente \| — 2026-05 | Seu concorrente opera com 2 pessoas + 5 agentes... | Seu concorrente ja automatizou. E voce? |
| 5 | video_5_legendado.mp4 | 17.4 MB | ~1:15 | Camp 1 Video | AS 1A | u4d \| Ad \| Video5 \| Margem \| — 2026-05 | Expert digital que fatura R$50K/mes... | R$18K de time por mes. Ha uma alternativa. |

## 6.2 Estaticos (Feed 1080x1080)

| # | Arquivo | Formato | Campanha | Ad Set | Nome do Anuncio | Primary Text (resumo) | Headline |
|---|---------|---------|----------|--------|----------------|----------------------|----------|
| 1 | 2.png | 1080x1080 | Camp 2 Static | AS 2A | u4d \| Ad \| Static2 \| Custo-Comp \| Feed | SDR R$3.700, Copy R$2.500, CS R$2.800... | Time vs. agente: R$14K ou R$2,8K? |
| 2 | 4.png | 1080x1080 | Camp 2 Static | AS 2A | u4d \| Ad \| Static4 \| Urgencia \| Feed | CPL subiu 21% em 2025, mais 12% em 2026... | CPL subiu 33% em 18 meses. |
| 3 | 6.png | 1080x1080 | Camp 2 Static | AS 2A | u4d \| Ad \| Static6 \| ChatGPT \| Feed | Ja uso ChatGPT — ferramenta generica... | ChatGPT nao e agente de IA. |

## 6.3 Estaticos (Stories 1080x1920)

| # | Arquivo | Formato | Campanha | Ad Set | Nome do Anuncio | Primary Text (resumo) | Headline |
|---|---------|---------|----------|--------|----------------|----------------------|----------|
| 1 | 1.png | 1080x1920 | Camp 2 Static | AS 2A | u4d \| Ad \| Static1 \| Custo-Time \| Stories | Voce soma quanto gasta de time por mes?... | Seu negocio custa quanto por mes em time? |
| 2 | 3.png | 1080x1920 | Camp 2 Static | AS 2A | u4d \| Ad \| Static3 \| CPL \| Stories | O mesmo resultado que voce tinha em 2024... | Seu CPL sobe. O do seu concorrente nao. |

## 6.4 Criativos em Reserva (para Fase 2)

### Videos Verticais (WhatsApp — para Stories/Reels)

| # | Arquivo | Tamanho | Formato | Uso Planejado |
|---|---------|---------|---------|---------------|
| 1 | WhatsApp Video 2026-05-05 at 15.36.11.mp4 | 14 MB | Vertical | Fase 2 — Stories/Reels |
| 2 | WhatsApp Video 2026-05-14 at 11.09.56.mp4 | 12 MB | Vertical | Fase 2 — Stories/Reels |
| 3 | WhatsApp Video 2026-05-14 at 14.24.05.mp4 | 21 MB | Vertical | Fase 2 — Stories/Reels |
| 4 | WhatsApp Video 2026-05-14 at 14.24.12.mp4 | 18 MB | Vertical | Fase 2 — Stories/Reels |
| 5 | WhatsApp Video 2026-05-15 at 14.43.38.mp4 | 16 MB | Vertical | Fase 2 — Stories/Reels |
| 6 | WhatsApp Video 2026-05-15 at 14.43.38 (1).mp4 | 20 MB | Vertical | Fase 2 — Stories/Reels |
| 7 | WhatsApp Video 2026-05-15 at 15.42.38.mp4 | 17 MB | Vertical | Fase 2 — Stories/Reels |

### Estaticos em Reserva (nao usados na Fase 1)

| # | Arquivo | Formato | Uso Planejado |
|---|---------|---------|---------------|
| 1 | 5.png | 1080x1920 | Fase 2 — Stories |
| 2 | 7.png | 1080x1920 | Fase 2 — Stories |
| 3 | 8.png | 1080x1080 | Fase 2 — Feed |
| 4 | 9.png | 1080x1920 | Fase 2 — Stories |
| 5 | 10.png | 1080x1080 | Fase 2 — Feed |
| 6 | 11.png | 1080x1920 | Fase 2 — Stories |
| 7 | 12.png | 1080x1080 | Fase 2 — Feed |
| 8 | 13.png | 1080x1920 | Fase 2 — Stories |
| 9 | 14.png | 1080x1080 | Fase 2 — Feed |
| 10 | 15.png | 1080x1920 | Fase 2 — Stories |
| 11 | 16.png | 1080x1080 | Fase 2 — Feed |
| 12 | 17.png | 1080x1920 | Fase 2 — Stories |
| 13 | 18.png | 1080x1080 | Fase 2 — Feed |

---

# SECAO 7 — CHECKLIST DE EXECUCAO

Ordem exata de operacoes quando o token estiver disponivel.

## Fase 0 — Pre-Requisitos (antes de tocar no Meta)

- [ ] **0.1** Confirmar que https://u4digital.com.br/raio-x esta no ar e funcional
- [ ] **0.2** Instalar Meta Pixel no site (codigo na Secao 1.1)
- [ ] **0.3** Testar disparo de evento PageView (usar Meta Pixel Helper extensao Chrome)
- [ ] **0.4** Configurar evento Lead no CTA/formulario da LP
- [ ] **0.5** Testar evento Lead com Pixel Helper
- [ ] **0.6** Configurar Cal.com link na LP (se aplicavel)
- [ ] **0.7** Preparar planilha Google Sheets para CRM manual (nome, whatsapp, faturamento, status)
- [ ] **0.8** Confirmar acesso a conta act_1497187178472890 com token valido

## Fase 1 — Criacao na Plataforma (tudo PAUSADO)

- [ ] **1.1** Criar Pixel (se nao existir) — anotar PIXEL_ID
- [ ] **1.2** Criar Meta Instant Form "u4digital — Raio-X Digital" com as 3 perguntas (Secao 2.4)
- [ ] **1.3** Upload de criativos para a biblioteca:
  - [ ] video_1_legendado.mp4
  - [ ] video_2_legendado.mp4
  - [ ] video_3_legendado.mp4
  - [ ] video_4_legendado.mp4
  - [ ] video_5_legendado.mp4
  - [ ] 1.png
  - [ ] 2.png
  - [ ] 3.png
  - [ ] 4.png
  - [ ] 6.png
- [ ] **1.4** Criar Campanha 1: `u4digital | Leads | Infoprodutores BR | Video Landscape — 2026-05` (PAUSED)
- [ ] **1.5** Criar Ad Set 1A com targeting conforme Secao 2.2 (PAUSED)
- [ ] **1.6** Criar 5 anuncios de video (Ad 1A-V1 a 1A-V5) com copy conforme Secao 2.2 (PAUSED)
- [ ] **1.7** Criar Campanha 2: `u4digital | Leads | Infoprodutores BR | Static Feed+Stories — 2026-05` (PAUSED)
- [ ] **1.8** Criar Ad Set 2A com targeting conforme Secao 2.3 (PAUSED)
- [ ] **1.9** Criar 5 anuncios estaticos (Ad 2A-S1 a 2A-S5) com copy conforme Secao 2.3 (PAUSED)
- [ ] **1.10** Revisar TODOS os anuncios no Gerenciador — conferir URLs, copy, criativos, targeting

## Fase 2 — Review e Ativacao

- [ ] **2.1** Moroni revisa todas as campanhas no Gerenciador de Anuncios
- [ ] **2.2** Moroni confirma: "PODE ATIVAR"
- [ ] **2.3** Ativar Campanha 1 (Video)
- [ ] **2.4** Ativar Campanha 2 (Static)
- [ ] **2.5** Confirmar nas primeiras 6h que TODOS os anuncios estao com status "Active" e recebendo impressoes
- [ ] **2.6** Se algum anuncio rejeitado pelo Meta → corrigir e resubmeter

## Fase 3 — Monitoramento (Dias 1-7)

- [ ] **3.1** Dia 1: Checklist — todos os anuncios com impressoes? Spend distribuido?
- [ ] **3.2** Dia 2: CTR geral > 0.5%? Alguma anomalia?
- [ ] **3.3** Dia 3: Primeiro corte de dados. Ranking por CTR e CPL (se houver leads).
- [ ] **3.4** Dia 4: Alocar R$20 de reserva no melhor performer. Aplicar kill rules se necessario.
- [ ] **3.5** Dia 5-7: Leitura final. Ranking dos 10 anuncios. Definir GO/NO-GO para Fase 2 de budget.
- [ ] **3.6** Relatorio completo para Moroni: CPL, CTR, leads, agendamentos, custo total.

---

# SECAO 8 — LOGS E REGISTRO

## Template de Log (preencher durante execucao)

### Objetos Criados

| Data | Tipo | Nome | ID | Status | Budget | Criado Por |
|------|------|------|----|--------|--------|-----------|
| | Pixel | u4d-raio-x | | Active | — | |
| | Lead Form | u4digital — Raio-X Digital | | Active | — | |
| | Campaign | u4digital \| Leads \| ... Video ... | | PAUSED | R$35/dia | |
| | Campaign | u4digital \| Leads \| ... Static ... | | PAUSED | R$25/dia | |
| | Ad Set | u4d \| AS \| Infoprodutores ... Video | | PAUSED | herdado | |
| | Ad Set | u4d \| AS \| Infoprodutores ... Static | | PAUSED | herdado | |
| | Ad | u4d \| Ad \| Video1 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Video2 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Video3 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Video4 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Video5 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Static2 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Static4 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Static6 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Static1 ... | | PAUSED | — | |
| | Ad | u4d \| Ad \| Static3 ... | | PAUSED | — | |

### Alteracoes

| Data | Objeto | Alteracao | Motivo | Aprovado Por |
|------|--------|----------|--------|-------------|
| | | | | |

### Performance Diaria

| Dia | Spend | Impressoes | Cliques | CTR | Leads | CPL | Melhor Anuncio | Pior Anuncio |
|-----|-------|-----------|---------|-----|-------|-----|---------------|-------------|
| 1 | | | | | | | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |
| 4 | | | | | | | | |
| 5 | | | | | | | | |
| 6 | | | | | | | | |
| 7 | | | | | | | | |

---

# SECAO 9 — CENARIOS DECISORIOS POS-TESTE

## Cenario A: CPL < R$15 (Excelente)

- 13-25 leads projetados
- **Acao imediata**: Escalar para R$50/dia com os 3 melhores anuncios
- **Acao em 7 dias**: Adicionar videos verticais, testar audiencia LAL 1%
- **Projecao mensal (R$1.500/mes)**: 100-150 leads, 20-30 agendamentos, 6-10 vendas

## Cenario B: CPL R$15-25 (Bom)

- 8-13 leads projetados
- **Acao imediata**: Manter os 4 melhores, pausar os 6 piores
- **Acao em 7 dias**: Testar variacoes de hook, manter audiencia
- **Projecao**: Viavel para escala com otimizacao

## Cenario C: CPL R$25-50 (Aceitavel)

- 4-8 leads projetados
- **Acao**: Pausar 70% dos anuncios. Manter os 2-3 com melhor CTR
- **Iterar**: Mudar copy principal, testar novo angulo
- **Rodar mais R$200** com variacoes antes de escalar

## Cenario D: CPL > R$50 ou Zero Leads (Problema)

- 0-4 leads
- **Diagnostico necessario**:
  - LP esta convertendo? (verificar se leads estao chegando ao form)
  - Criativos estao sendo vistos? (verificar impressoes e CTR)
  - Audiencia esta errada? (verificar CPM — se CPM alto, audiencia pequena demais)
- **Acao**: PARAR. Rever oferta, LP, ou audiencia antes de gastar mais.

---

# SECAO 10 — SAFETY CHECKLIST FINAL

Antes de cada operacao write (criar, alterar, pausar), verificar:

- [ ] Conta correta: act_1497187178472890 (u4digital) — NAO confundir com Moroni Reis, Noiva SA, Agente Lucrativo, ou Leo Soares
- [ ] Moroni autorizou esta acao especifica
- [ ] Budget dentro dos limites aprovados (max R$35/dia por campanha)
- [ ] Campanha sera criada PAUSED
- [ ] Nenhuma alteracao de budget > 30% em uma unica mudanca
- [ ] Nenhuma campanha, ad set ou ad sera DELETADO — apenas pausado
- [ ] Nenhum token, credential ou access key exposto em logs ou arquivos
- [ ] Nenhuma alteracao em campanhas de outras contas

---

## CHANGELOG

- [2026-05-15] — Documento criado. Plano final completo: pixel/tracking, 2 campanhas (10 anuncios), audiencia, budget phasing, regras de otimizacao, mapeamento completo de 30 criativos, checklist de execucao, logs, cenarios decisorios.
