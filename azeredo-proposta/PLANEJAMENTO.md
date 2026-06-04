# Planejamento — Proposta Azeredo Representações Comerciais

> **Reunião**: 27/05/2026 | **Participantes**: Tiago Donicht (u4digital), Gustavo Broisler, Cláudio, Tati, Dai, Luciano (Azeredo)
> **Status**: Planejamento | **Deadline proposta**: 30/05/2026 (sexta-feira)
> **Modelo**: u4digital Consultoria + Assessoria (não uHunter produto)

---

## 1. Perfil do Cliente

| Campo | Detalhe |
|-------|---------|
| **Empresa** | Azeredo Representações Comerciais |
| **Localização** | Santa Maria, RS — atuação estadual |
| **Ramo** | Representação comercial multimarcas |
| **Marcas representadas** | Stullen, PicPic (~250-300 clientes, maior carteira), CicaDe, Polibras, BR, fábricas de balão, fita, brinquedo, festa, serviço, entre outras |
| **Equipe externa** | ~20 representantes (Cláudio, Luciano no norte, Rafael, outros) |
| **Equipe interna** | Tati, Dai, outras (suporte, pedidos, atualização de sistema) |
| **Sistema base** | Mercos (10+ anos de histórico) |
| **Carteira total** | ~1.300-1.400 clientes |
| **Clientes ativos (6 meses)** | ~400-500 (taxa caindo, meta era 50%) |
| **Comunicação** | 99% WhatsApp (múltiplos números pessoais, cada rep tem o seu) |
| **Instagram** | Existe mas sem engajamento, apenas presença |
| **E-commerce** | Existe dentro do Mercos (link), mas clientes não usam — preferem WhatsApp |

---

## 2. Diagnóstico de Dores (extraídas da reunião)

### Dor #1 — Perda de Continuidade
- Conversas com clientes se perdem no WhatsApp
- Não há histórico centralizado acessível a toda equipe
- Trabalho sobreposto: internas atendem o mesmo cliente que o rep está visitando
- "Nossa dificuldade hoje chama-se continuidade" (Cláudio)

### Dor #2 — Comunicação em Massa Impossível
- Listas de transmissão do WhatsApp foram descontinuadas
- Campanhas e promoções exigem contato um a um (manual)
- Promoções de 1 semana não conseguem alcançar todos os clientes a tempo
- Troca de tabela: tempo insuficiente para avisar toda a base na tabela antiga

### Dor #3 — Clientes Inativos Irrecuperáveis
- Inativo recente (memória): ainda conseguem resgatar
- Inativo 6+ meses: "foi. Perdeu."
- Querem subir de 400 ativos para 600-700, dentro da base conhecida
- Não fazem prospecção fria — foco é reativação da carteira existente

### Dor #4 — Processos Manuais Fragmentados
- Montagem de projetos/pedidos sugeridos é manual (planilha + Mercos)
- Cruzamento de planilhas feito no ChatGPT (com limites de tokens)
- Cada pessoa trabalha de um jeito diferente — sem processo padrão
- "Eu trabalho do meu jeito, ela trabalha do dela, cada um puxa do jeito que acha"

### Dor #5 — Sem Gatilhos Automáticos de Recompra
- Cada marca tem ciclo diferente (CicaDe: 30 dias, Polibras: 40-50 dias, balão: 30-45 dias, BR: 45 dias)
- Gatilhos de recompra foram configurados manualmente por experiência no Mercos
- Ninguém registra conversas no Mercos ("é impossível, não tem tempo")
- Não há automação que lembre de retomar contato no momento certo

### Dor #6 — Pedidos Chegam em Formato Caótico
- Clientes mandam foto de produto, áudio, lista escrita à mão
- Pouquíssimos usam e-commerce do Mercos (2-3 de ~50 clientes de um rep)
- Preferem WhatsApp a sair para outro canal (link, site, Instagram)
- "Se tiver que mudar para outro canal, ele vai desistir da compra"

### Dor #7 — Equipe Encolheu, Demanda Não
- Eram 10 na rua + 4 internas, agora são menos
- Atingimento menor por pessoa
- Visitas presenciais viraram "visitas sociais" de 5 minutos — negócios não acontecem simultaneamente
- "A semana é vazio. Vazio o que é? Não trouxe pedidos."

---

## 3. Oportunidades Identificadas

### O que o cliente PEDIU explicitamente:
1. Disparo em massa segmentado por marca/fábrica (substituir listas de transmissão)
2. Gatilhos automáticos de recompra por ciclo de produto
3. Histórico de conversas centralizado com resumos
4. Carrinho de compras dentro do WhatsApp (como Clip)
5. Número centralizado com roteamento por segmento
6. Automação de cruzamento de planilhas
7. Dashboard com relatórios e visibilidade completa

### O que o cliente PRECISA mas não articulou:
1. CRM leve sobre o Mercos (pipeline visual por rep)
2. Agenda compartilhada (evitar trabalho sobreposto)
3. Templates de pedidos sugeridos por marca (curva A automática)
4. AI multimodal para interpretar fotos/áudios de pedidos
5. Padronização de processo (árvore de atendimento única)
6. Upsell/cross-sell automatizado ("quem comprou X também comprou Y")

---

## 4. Arquitetura da Solução Proposta

### Camada 1 — Plataforma Central (Dashboard Azeredo)
- Dashboard web próprio da Azeredo
- Conectado via API ao Mercos (leitura + escrita)
- Visão 360 do cliente: histórico de compras, conversas, último contato, ciclo de recompra
- Relatórios: ativos/inativos, pipeline por rep, faturamento por marca
- Upload e cruzamento de planilhas com AI

### Camada 2 — WhatsApp Inteligente
- **Número central verificado** (selo Meta) com roteamento por segmento
- Bot de primeiro atendimento: identifica demanda → direciona para rep/interna responsável
- Carrinho de compras in-chat (modelo Clip adaptado para B2B)
- Interpretação de imagens (foto do produto → match com catálogo)
- Interpretação de áudios (transcrição + ação)
- Histórico completo de cada conversa, acessível por todos

### Camada 3 — Automações e Gatilhos
- **Gatilho de recompra**: CicaDe 30d, Polibras 45d, balão 30d, BR 45d, fita 30d (configurável por marca)
- **Campanhas segmentadas**: disparo por marca/segmento (festa, brinquedo, serviço)
- **Alertas de inatividade**: 60d, 90d, 120d com workflow de reativação
- **Follow-up automático**: cliente pediu para ligar em 15 dias → gatilho registrado
- **Troca de tabela**: notificação automática para toda a carteira da marca

### Camada 4 — Inteligência (AI)
- Resumo automático de conversas para histórico
- Sugestão de pedido baseado em histórico (curva A do cliente)
- Cruzamento de planilhas (substituir ChatGPT)
- Leitura de PDFs, imagens, catálogos
- Recomendação de cross-sell/upsell por padrão de compra

---

## 5. Estratégia de WhatsApp (API)

### Recomendação: Começar com API não oficial (base conhecida)

| Critério | API Oficial (Meta) | API Não Oficial |
|----------|-------------------|-----------------|
| Custo por mensagem | R$0,36-0,48 (marketing) | R$0 (incluso na plataforma) |
| Risco de banimento | Zero | Baixo (base conhecida) |
| Selo verificado | Sim | Não |
| Templates aprovados | Obrigatório (submeter à Meta) | Livre |
| Limite de contatos | Ilimitado | ~150-200/dia por número |
| Melhor para | Prospecção, base fria | Carteira existente, reativação |

**Justificativa**: A Azeredo NÃO faz prospecção fria. A base de 1.300 clientes já conhece a empresa. O volume por marca é baixo (máx 250-300 PicPic). O risco-benefício favorece API não oficial com número(s) dedicado(s).

**Plano de migração**: Começar não oficial → se volume crescer ou precisar de prospecção → migrar para oficial com selo.

---

## 6. Integração Mercos

### O que buscar via API Mercos:
- Catálogo de produtos (fotos, preços, códigos)
- Histórico de pedidos por cliente (últimos 10 anos)
- Dados cadastrais dos clientes
- Curva ABC de produtos por cliente
- Status de pedidos

### O que gravar de volta no Mercos:
- Pedidos originados no WhatsApp (carrinho → Mercos)
- Registro de contatos/interações
- Atualizações cadastrais

### Investigar:
- Documentação da API Mercos (disponibilidade, limites)
- Permissões necessárias (autorização Azeredo)
- Webhooks para sincronização em tempo real

---

## 7. Cronograma Proposto

### Fase 0 — Kick-off (Semana 1)
- Coleta de acessos (Mercos, WhatsApp Business, Instagram)
- Mapeamento detalhado: sentar com cada pessoa, tela a tela
- Levantamento de todas as marcas representadas e seus ciclos
- Definição do número central

### Fase 1 — Fundação (Semanas 2-3)
- Dashboard básico com conexão Mercos (leitura)
- Visão 360 do cliente (histórico, última compra, inatividade)
- WhatsApp central com roteamento por segmento
- Bot de primeiro atendimento

### Fase 2 — Automação (Semanas 3-4)
- Gatilhos de recompra por marca
- Campanhas segmentadas (disparo em massa)
- Alertas de inatividade
- Follow-up automático
- Troca de tabela automatizada

### Fase 3 — Inteligência (Semanas 4-5)
- Carrinho de compras no WhatsApp
- Sugestão de pedido por curva A
- AI multimodal (fotos, áudios, PDFs)
- Cross-sell/upsell automatizado
- Cruzamento de planilhas

### Go Live + Acompanhamento
- Treinamento da equipe (presencial ou remoto)
- Go Live com acompanhamento intensivo (2 semanas)
- Suporte contínuo mensal

---

## 8. Estrutura de Investimento (rascunho)

### Setup (implementação):
- Mapeamento + desenvolvimento + integrações + treinamento
- **Estimativa**: R$8.000 - R$12.000 (depende da complexidade da API Mercos e volume de automações)

### Mensalidade (acompanhamento + infra):
- Hosting, API costs, suporte, evolução contínua
- **Estimativa**: R$1.500 - R$2.500/mês

### Custos variáveis:
- API WhatsApp oficial (se migrar): ~R$0,40/mensagem
- OpenAI tokens (AI multimodal): incluso até X consultas/mês
- API Mercos: verificar se tem custo

> **Nota**: Valores finais após mapeamento detalhado e validação da API Mercos.

---

## 9. Métricas de Sucesso (KPIs)

| Métrica | Hoje | Meta 90 dias |
|---------|------|-------------|
| Clientes ativos (6 meses) | ~400-500 | 600-700 |
| Taxa de reativação de inativos | ~0% (manual) | 15-20% |
| Tempo médio para contato pós-gatilho | Dias/semanas (manual) | < 24h (automático) |
| Campanhas disparadas por mês | ~2-3 (manuais, parciais) | Ilimitadas (automáticas) |
| Pedidos via carrinho WhatsApp | 0 | 30-50% dos pedidos |
| Tempo de montagem de projeto sugerido | 30-60 min (manual) | < 5 min (automático) |

---

## 10. Estrutura da Proposta Visual (slides)

A proposta segue o padrão u4digital (formato slide-deck HTML interativo):

| Slide | Conteúdo |
|-------|----------|
| 1 | **Hero** — "Automação Inteligente para Representação Comercial" |
| 2 | **Contexto** — Números da Azeredo (1.300 clientes, 20+ reps, 10 anos de dados) |
| 3 | **Diagnóstico** — As 7 dores mapeadas na reunião |
| 4 | **Antes vs Depois** — Comparação lado a lado |
| 5 | **Solução: Dashboard** — Plataforma central + integração Mercos |
| 6 | **Solução: WhatsApp Inteligente** — Centralização, bot, carrinho |
| 7 | **Solução: Automações** — Gatilhos de recompra, campanhas, alertas |
| 8 | **Solução: AI** — Multimodal, sugestões, cruzamento |
| 9 | **Fluxo Visual** — Diagrama de como tudo se conecta |
| 10 | **Cronograma** — Timeline de 5 semanas |
| 11 | **ROI** — Projeção de impacto nos KPIs |
| 12 | **Investimento** — Setup + mensalidade |
| 13 | **Próximos Passos** — Kick-off, mapeamento, grupo WhatsApp |
| 14 | **CTA** — "Vamos começar" |

---

## 11. Referências Internas

- **Modelo de proposta**: `rhf-proposta/index.html` (design system u4digital)
- **Carrinho WhatsApp**: modelo sendo implementado para Clip
- **CRM/Dashboard**: similar ao `marpe-crm-seguros/`
- **uHunter**: produto conversacional que pode ser base para o bot
- **Artigo hiperautomação**: Gustavo mencionou compartilhar com o cliente

---

## 12. Decisões Pendentes

- [ ] Validar API Mercos (documentação, limites, custo)
- [ ] Definir número central (novo ou existente)
- [ ] Escolher API WhatsApp (oficial vs não oficial) — recomendação: não oficial
- [ ] Confirmar se demo funcional será necessária antes do kick-off
- [ ] Alinhar pricing final com Moroni e Gustavo
- [ ] Gustavo compartilhar artigo de hiperautomação com o cliente
- [ ] Criar grupo WhatsApp (u4digital + Azeredo)

---

## 13. Observações da Reunião

- Moroni teve imprevisto médico e não participou. Tiago conduziu sozinho.
- O cliente está muito receptivo — dor é real e urgente ("precisamos ser reinventados")
- Cláudio e equipe demonstraram profundo conhecimento do negócio e das dores
- A solução de carrinho WhatsApp (modelo Clip) gerou muito interesse
- O cliente mencionou escritório amigo no Paraná que usa Wasler (API não oficial, ~3.000 clientes)
- Próxima semana equipe estará fora (viagem/feira) — prazo real para apresentar: semana seguinte
- Marp e RHF estão "andando bem" — referência positiva para a Azeredo
