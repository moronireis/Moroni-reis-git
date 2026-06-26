# Brief Interno — App de Saúde Masculina (Dr. Áureo / Lucas Cardoso)

Last updated: 2026-06-25
Source: Google Meet "Impromptu" — June 20, 2026 (12 min) — Conduzida por Tiago Donicht

---

## Status

⚠️ **PROPOSTA ATRASADA** — Tiago comprometeu entrega até 23/jun (segunda). Hoje é 25/jun.
Ação imediata: Tiago avisa Lucas via WhatsApp que a proposta chegará hoje/amanhã, mais completa do que o combinado.

---

## Participantes da Reunião

- **Tiago Donicht** (tiago.donicht@gmail.com) — conduziu a reunião em nome do time. Moroni estava em lua de mel (voltou na segunda 22/jun).
- **Lucas Cardoso** — ponto de contato do projeto. Foi referenciado pelo Dr. Áureo.

## Decisores

| Nome | Papel |
|------|-------|
| Lucas Cardoso | Contato principal, ponto técnico |
| Douglas | Co-decisor (mencionado por Tiago) |
| Dr. Áureo | Decisor final / referência. Histórico com a gente: projeto Will Hunter (AI de atendimento de pacientes, fev/2026 — descontinuado por demanda baixa) |

---

## Projeto

**App de saúde masculina em fase de lançamento.**

Lucas e equipe precisam de automação de WhatsApp para dois fins simultâneos:

1. **Atendimento de leads** vindos do tráfego pago — qualificação, resolução de dúvidas, encaminhamento para download/compra
2. **Suporte de usuários** do app — FAQ automatizado, abertura de tickets no sistema interno (Lucas construiu o sistema de tickets ele mesmo)

Número único de WhatsApp para os dois fluxos, com roteamento inteligente.

---

## O que foi discutido na call

### Escopo confirmado

- Um único número WhatsApp atendendo leads + usuários
- Roteamento: bot identifica se é lead novo ou usuário com dúvida/problema
- Bot híbrido (menus + IA + handoff humano) — Tiago recomendou, Lucas concordou
- FAQ/base de perguntas frequentes: Lucas JÁ TEM, vai compartilhar
- Sistema de tickets: Lucas construiu, precisamos da API para integrar
- WhatsApp Web API (não-oficial) — Tiago explicitou para reduzir custos, cliente concordou

### Dashboard analítico

Lucas pediu orçamento **COM e SEM** dashboard. Orçar ambas as opções separadamente.

### O que NÃO foi discutido (gaps a resolver no kickoff)

- Nome do app (não mencionado na reunião)
- Volume estimado de leads/dia e tickets/dia
- Horário de operação e equipe de atendimento humano
- Como identificar lead novo vs usuário do app (por link UTM? por número cadastrado?)
- Documentação da API do sistema de tickets do Lucas
- WhatsApp já tem número ou vamos provisionar?
- Requisitos de privacidade/LGPD para dados de saúde nas conversas

---

## Modelo de Negócio

Setup (implementação) + mensalidade de manutenção.

| Opção | Setup | Mensal |
|-------|-------|--------|
| **A** — Core (sem dashboard) | R$6.500 | R$497/mês |
| **B** — Com dashboard analítico | R$8.900 | R$697/mês |

**O que está incluso no mensal:**
- Hospedagem UazapiGO (~R$100)
- Custos de API de IA (Claude Sonnet — estimado R$50-150 dependendo do volume)
- Hospedagem de backend (Vercel/Supabase)
- Correções de bugs e ajustes menores (até 2h/mês)
- Atualização da base de FAQ (até 2 rodadas/mês)

**O que gera cobrança adicional:**
- Novos fluxos (novo produto, novo departamento)
- Reestruturação significativa do bot
- Integrações com sistemas adicionais
- Campanhas de disparo ativo (outbound)

---

## Stack Técnica

| Componente | Escolha | Motivo |
|-----------|---------|--------|
| WhatsApp | UazapiGO (API não-oficial) | Custo ~R$100/mês vs R$500-2000/mês da oficial. Mesmo stack do Marpe CRM. |
| Backend | Node.js / Supabase Edge Functions | Stack padrão do ecossistema |
| IA | Claude Sonnet via API | FAQ + fallback natural language, ~$3/M tokens |
| Tickets | REST API (a confirmar) | Lucas fornece documentação |
| Dashboard (Op. B) | React + Supabase real-time | Stack padrão |

**Risco UazapiGO:** Pequena chance de bloqueio pela Meta. Mitigação: rate limiting correto, sem spam. Documentar na proposta com transparência — "se chegar em volume que justifique API oficial, migramos".

---

## Referência de Case

**Marpe CRM (Marcel Foletto / seguros):** Mesmo stack UazapiGO em produção. CRM completo com 22 tabelas, 34 APIs, integração WhatsApp, kanban, campanhas. Prova de que a infraestrutura funciona.

---

## Próximos Passos

- [ ] Tiago avisa Lucas via WhatsApp (hoje) — proposta chegando amanhã, mais completa
- [ ] Moroni revisa a proposta
- [ ] Agendar reunião de apresentação (não enviar só PDF) — convidar Lucas + Douglas + Dr. Áureo
- [ ] Kickoff após aprovação: coletar API docs do sistema de tickets + base de FAQ

---

## Cronograma Estimado

| Semana | Entrega |
|--------|---------|
| 1 | Kickoff + mapeamento de fluxos + documentação da API de tickets |
| 2-3 | Fluxo de vendas (bot de leads) |
| 3-4 | Base de FAQ carregada + camada de IA |
| 4-5 | Integração com sistema de tickets |
| 5-6 | Testes end-to-end |
| 6-7 | Dashboard (apenas Opção B) |
| 7-8 | Go-live + monitoramento |

Total: 6-8 semanas do kickoff.
