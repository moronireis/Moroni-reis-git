# Analise Interna — Marcel Foletto (Marca Corretora de Seguros)

Last updated: May 2026

## Resumo da Oportunidade

- **Cliente**: Marcel Foletto — Marca Corretora de Seguros (interior RS)
- **Origem**: Tiago Donicht (uhunter.io) — parceiro comercial
- **Reuniao**: 30/04/2026 (Google Meet, 44 min)
- **Vertical**: Corretora de seguros (auto, vida, residencial, empresarial, equipamento)
- **Equipe**: Marcel + Adria (minimo 2 usuarios)

---

## Situacao Atual do Cliente

### Ferramentas em uso:
| Ferramenta | Funcao | Status |
|------------|--------|--------|
| Corp (Agia) | ERP especifico seguros — contratos, polices, comissoes, importacao PDF, robos de portal | **Insubstituivel** |
| Clint | CRM em teste — funis, WhatsApp, atendimento | Em avaliacao (nao adotou) |
| iSpeed | Extensao WhatsApp — CRM lateral, msg rapidas, agendamento | Usa ativamente (instavel) |
| WhatsApp Web | Atendimento direto | 3 numeros ativos |

### Ferramentas ja descartadas:
- RD Station (engessado)
- Monday (generico demais)
- Chatbot anterior (nao funcionou para seguros)

### Corp tem API?
**Sim.** Marcel confirmou que a Agia (detentora do Corp) tem API disponivel. Clint ja conversou com eles sobre integracao. Isso e critico — viabiliza a sincronizacao.

---

## Dores Identificadas (por prioridade)

1. **Automatizacao por mudanca de etapa** — #1 pain. Quer: moveu card = msg automatica. Hoje faz manual.
2. **Historico de conversa** — conversas somem do WhatsApp apos meses. Sem prova de comunicacao.
3. **Campos especificos de seguros** — nenhum CRM generico tem premio, comissao, vigencia, ramo.
4. **Multiplos negocios por contato** — 1 cliente tem N seguros. CRMs genericos nao suportam bem.
5. **iSpeed instavel** — depende de PC ligado, pode sair do ar, campos engessados.
6. **Avisos de parcela** — Corp envia e-mail (ninguem le). Precisa ser WhatsApp.
7. **Disparo em massa** — campanhas segmentadas por tipo de seguro.

---

## Modelo de Receita para Seguros

- **Retorno indireto**: agilidade → melhor atendimento → retencao → indicacoes → mais carteira
- **Retorno direto**: campanhas de cross-sell (base existente compra outros ramos)
- **Nao e captacao via trafego** — ja tentou, nao funciona no interior. Cliente vem por indicacao.
- **Modelo de negocio = servico** — a venda esta atrelada ao atendimento durante a vigencia

---

## Solucao Proposta

### Arquitetura:
- **Frontend**: Web app (React/Next.js) — painel do corretor
- **Backend**: Node.js + Supabase (banco + auth + realtime)
- **WhatsApp**: API oficial Meta (Cloud API) — 3 numeros, webhook 24/7
- **Integracao Corp**: API Agia — sincronizacao bidirecional
- **Automacoes**: Motor de regras (stage change → trigger → msg template)

### Funcionalidades core:
1. Inbox WhatsApp unificado (3 numeros, historico permanente)
2. CRM com campos de seguro (premio, comissao%, produtor, ramo, vigencia, apolice)
3. N negocios por contato (cada seguro = negocio independente)
4. 4 funis: Vendas, Assistencia 24h, Sinistros, Renovacoes
5. Automacoes por mudanca de etapa (Kanban move → WhatsApp auto)
6. Avisos de parcela (5 dias antes, via WhatsApp)
7. Campanhas em massa (segmentadas por tipo/ramo)
8. Visualizacao Grade + Kanban (switch)
9. Mensagens rapidas (templates configuraves)
10. Integracao Corp via API

---

## Precificacao

| Item | Valor | Justificativa |
|------|-------|---------------|
| Implantacao | R$ 4.900 | Abaixo do concorrente (R$9K+). Inclui treinamento. |
| Mensalidade | R$ 597/mes | Hospedagem + API Meta + suporte + updates |
| Desconto PIX | 10% (R$ 4.410) | Incentivo pagamento a vista |
| Parcelamento | Ate 3x cartao | Sem juros |

### Custos operacionais estimados (nosso lado):
- API Meta WhatsApp: ~R$100-200/mes (1000 conversas)
- Supabase: R$0-50/mes (free tier cobre)
- Hosting (Vercel/Railway): ~R$50-100/mes
- **Margem liquida estimada**: ~R$300-400/mes recorrente + R$4.900 implantacao

### Referencia concorrencia:
- Concorrentes de mercado cobram R$5K implantacao + R$4K treinamento + mensalidade
- Sistemas completos (com ERP incluso) chegam a R$1.500+/mes
- Nossa proposta e competitiva pois nao substitui o Corp — complementa

---

## Riscos e Dependencias

| Risco | Mitigacao |
|-------|-----------|
| API Corp limitada ou mal documentada | Kickoff tecnico antes de comecar dev. Validar endpoints disponiveis. |
| Marcel nao migra do iSpeed (habito) | Entregar funcionalidades equivalentes + superioridade (24h, automacoes) |
| Volume baixo de conversas (interior) | Pricing ja considera volume baixo. 1000 conversas/mes e generoso. |
| Tiago (uhunter) quer comissao | Definir split antes de fechar. Sugestao: 10-15% da implantacao. |

---

## Proximos Passos

1. [x] Proposta visual criada (Vercel)
2. [ ] Definir split com Tiago
3. [ ] Enviar proposta ao Marcel via grupo WhatsApp
4. [ ] Kickoff tecnico: obter acesso a API Corp, documentacao
5. [ ] Validar endpoints Corp disponiveis antes de comprometer prazo
6. [ ] Fechar contrato

---

## Notas da Reuniao

- Marcel e pragmatico — sabe o que quer, ja testou varias ferramentas
- Nao quer substituir o Corp — quer complementar
- Funcionalidade #1: automacao por mudanca de etapa (pulo do gato, palavras dele)
- Interior RS: captacao via trafego nao funciona, cliente vem por indicacao
- Marcel ofereceu acesso ao iSpeed para nos avaliarmos como referencia
- Equipe pequena (Marcel + Adria minimo), processo bem definido
