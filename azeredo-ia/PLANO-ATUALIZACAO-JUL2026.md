# AZEREDO IA — Plano de Atualização da Plataforma

**Fonte**: Backlog — Azeredo (Checkpoint 04/07/2026) + auditoria do código e do banco de produção em 08/07/2026
**Última atualização**: 08/07/2026

---

## 1. Diagnóstico — o que o backlog pede × o que existe hoje

Cada item do backlog foi cruzado com o código (`azeredo-ia/`) e com o banco de produção (Supabase Cloudfy). Resumo dos achados:

| # | Item do backlog | Prioridade | Achado técnico |
|---|-----------------|------------|----------------|
| A1 | Filtros ativos/inativos não funcionam | ALTA | **Não é bug de query — é dado ausente.** Os 2.373 contatos estão com `status='ativo'` (default do import). Nunca existiu contato inativo no banco. Há também uma race condition no preview do wizard (PATCH→GET sem cancelamento) que deixa a contagem velha na tela, e o filtro é single-select quando a Tati espera comportamento de marcar/desmarcar. |
| A2 | Criar lista manual | ALTA | `include_ids`/`exclude_ids` já existem, mas a lista sempre parte da base filtrada (sem filtro = base inteira). Falta um modo "começar do zero". |
| A3 | Dashboard de campanhas em tempo real | ALTA | Existe monitor por campanha (polling) e coluna Entregues via reconciliação. **Não existe visão agregada nem rastreio de respostas** — zero mensagens inbound no banco, porque o servidor UazapiGO (u4digital.uazapi.com) não entrega webhook de espécie alguma (comprovado em 02/07; escalação com Tiago pendente). |
| A4 | Conversor Mercos com IA | ALTA | O conversor existe e gera o .xlsx de 42 colunas, mas o mapeamento é 100% manual. As colunas "Ativo/Inativo" (col 19) e "Exibir no e-commerce" (col 20) nem são expostas na UI. Não há nenhuma chamada de IA no produto hoje — `ANTHROPIC_API_KEY` não existe nas env vars. |
| A5 | Renomeador de fotos de produto | ALTA | Não existe. Ferramentas tem 2 abas (Conversor, Gerar Pedido); entra como 3ª aba. |
| M1 | Conversas filtradas por vendedor | MÉDIA | Conversas em modo live mostra todos os chats da instância selecionada, para qualquer usuário. Não há vínculo usuário↔instância nem filtro "só contatos da base". |
| M2 | Imagem/vídeo em campanha | MÉDIA | Templates são só texto e o worker usa apenas `/send/text`. Porém `az_messages` já tem `media_url/media_mime/content_type` e o storage de mídia (migração v3) já existe — a fundação está pronta. |
| M3 | Segmentação de disparo por vendedor | MÉDIA | **O dado no banco está poluído**: `az_contact_brands.vendedores` tem os 9 nomes da casa em TODOS os 5.592 vínculos (o import jogou a lista inteira em todo mundo). O vínculo real cliente↔vendedor precisa ser re-importado das planilhas da Tati. Critério ainda em definição com Tiago. |
| F1 | API de Pedidos do Mercos | FUTURO | Gerar Pedido é um formulário manual sem sync de produtos. A Mercos tem API pública documentada — precisa de token da conta Azeredo e conversa com o suporte antes de qualquer estimativa. |

---

## 2. Fases de entrega

### Fase 1 — Correções de filtros e lista manual (A1 + A2) · ~2,5 dias

**A1a. Status inativo — dados (bloqueado por material da Tati)**
- Migração v9: `ultima_compra_at` (em `az_contacts` ou `az_contact_brands`, conforme o formato do dado que a Tati enviar) + rotina que deriva o status usando os thresholds que já existem em `az_brands.inativo_recente_dias` (90) e `inativo_antigo_dias` (180).
- Script de import da planilha de última compra + validação com a Tati.
- Interim (se o dado demorar): edição manual de status na tela de Contatos, para destravar campanhas de reativação pontuais.

**A1b. Correções de comportamento do filtro (sem dependência)**
- Fix da race no preview: sequenciar/cancelar requests (`AbortController` + token de sequência) para a contagem nunca mostrar filtro velho.
- Status multi-select (`status_in[]` no `segment_filter` + suporte em `campaign-audience.ts`).
- Contagem por status ao lado de cada chip (hoje só segmento tem contagem, e é global).

**A2. Lista manual**
- Flag `manual_only` no `segment_filter`; `resolveAudience` retorna apenas `include_ids`.
- UI: seletor no passo 2 — "Partir da base filtrada" | "Montar lista manual (começa vazia)". A busca de contatos já existe e é reaproveitada.

### Fase 2 — Dashboard de campanhas em tempo real (A3) · ~3 dias

- Nova aba "Dashboard" em Disparos: cards agregados (hoje / 7 dias: enviados, entregues, falhas, respostas), tabela de campanhas ativas com progresso ao vivo (polling 5s, reaproveita o pump existente) e feed das últimas respostas.
- **Respostas sem webhook**: incluir na reconciliação (que já roda 12/hop + 30 no fechamento via `/message/find`) a varredura de mensagens inbound por chatid dos recipients — grava em `az_messages` (direction inbound) e marca o recipient (migração: `az_campaign_recipients.replied_at`).
- Se o Tiago destravar o webhook com o suporte UazapiGO, os handlers já escritos (webhook v7) passam a alimentar o mesmo dado em tempo real de verdade, sem retrabalho de UI.

### Fase 3 — Ferramentas Mercos (A4 + A5) · ~4 dias

**A4. Conversor Mercos com IA**
- Endpoint `/api/ferramentas/mercos-map`: envia cabeçalhos candidatos + ~15 linhas de amostra ao Claude (sonnet) → retorna linha de cabeçalho detectada + mapeamento proposto (descrição, código, preço/venda mínima, IPI) com nível de confiança. A planilha inteira nunca sai do navegador — só a amostra.
- UI: mapeamento chega pré-preenchido, a Tati só revisa e confirma (o mapeador manual continua como fallback).
- Expor colunas 19 ("Ativo/Inativo") e 20 ("Exibir no e-commerce"): padrão global + override por linha na prévia — elimina a edição manual pós-geração.
- Testar com as planilhas reais da pasta do Drive (BR, Ingá etc.).
- **Pré-requisito**: criar `ANTHROPIC_API_KEY` no Vercel. Custo estimado por conversão: centavos (só amostra + cabeçalhos).

**A5. Renomeador de fotos de produto (3ª aba de Ferramentas)**
- Upload em lote client-side → extração do código Mercos do nome do arquivo → prévia antes/depois → download .zip renomeado (JSZip). Zero custo de storage/servidor.
- Detecção de padrão por fábrica: IA sugere a regra a partir de 5–10 exemplos de nomes (mesmo endpoint, prompt distinto) + presets salvos por fábrica em `az_settings`.
- Regras já conhecidas: BR `5_MO-15_01` → `MO-15`; Ingá `17619_baixa` → `17619`.

### Fase 4 — Evolução do disparo e do chat (M2 + M1 + M3) · ~5 dias

**M2. Imagem/vídeo em campanha** (maior valor de negócio da fase)
- Migração: `az_templates.media_url/media_type` + `az_campaigns.custom_media_url`.
- Upload no editor de templates → bucket do Supabase Storage (URL pública ou assinada de longa duração — o servidor UazapiGO precisa alcançar a URL).
- `sendWhatsAppMedia()` via `POST /send/media` (number, type, file, text=caption); worker escolhe texto × mídia conforme o template.
- Prévia com thumbnail no wizard e no monitor.
- **Anti-ban**: delay maior para mídia (4–6s vs 2–4s) — mídia pesa mais na reputação do número. Canário, janela 8–18h e cap diário continuam valendo.

**M1. Conversas por vendedor**
- Migração: `az_whatsapp_instances.owner_profile_id` + UI de vínculo em Config (admin).
- Operador logado: instância dele pré-selecionada e travada; admin segue vendo todas.
- Filtro "Só contatos da base" (default para operador): cruza os chats live com os telefones normalizados de `az_contacts`; opção adicional "com interação de campanha" via `az_messages`.
- Aberto: vendedores externos (Gabriela, Tiago G., Luciano…) não têm login hoje — criar contas se o Cláudio quiser dar acesso.

**M3. Segmentação de disparo por vendedor** (bloqueado por dados + definição)
- Passo 1 — dados: re-import da coluna "vendedor" das planilhas da Tati para um campo limpo (`vendedor_principal`), substituindo o array poluído atual. Validar amostra com a Tati.
- Passo 2 — filtro: chip "Vendedor" no wizard + suporte em `resolveAudience`. Opcional (casa com M1): disparo automático pela instância do vendedor dono da base.
- Só especificar o passo 2 depois que o Tiago fechar o critério (telefone do vendedor como referência está "em definição").

### Fase 5 — Integração Mercos (F1) · discovery primeiro

- Discovery (~0,5 dia): levantar a API pública da Mercos (produtos, pedidos, limites, sandbox), com o token da conta Azeredo em mãos.
- Depois da discovery: sync de catálogo (`az_products`) → é isso que destrava o "gerar pedidos com IA" do protótipo → push de pedidos.
- Não estimar implementação antes da resposta do suporte Mercos.

---

## 3. Pendências externas (destravam o plano — pedir JÁ)

| O quê | Quem | Destrava |
|-------|------|----------|
| Planilha com **última compra por cliente** (ideal: por cliente+marca) | Tati | A1 — filtros de inativos |
| Planilha com **vendedor por cliente** (dado atual no banco está inutilizável) | Tati | M3 — segmentação por vendedor |
| Escalar **webhook UazapiGO** com o suporte (servidor não entrega nenhum evento) | Tiago | A3 — respostas em tempo real de verdade (sem isso, vai por polling) |
| **Definição do critério** de vínculo vendedor↔disparo | Tiago | M3 — passo 2 |
| Criar **ANTHROPIC_API_KEY** no Vercel | Moroni | A4/A5 — recursos de IA |
| **Token API Mercos** + contato com suporte | Cláudio/Tiago | F1 |
| Acesso às **pastas do Drive** (planilhas de fábrica + fotos de exemplo) | Tati/Tiago | A4/A5 — testes com material real |

---

## 4. Riscos e decisões de arquitetura

1. **Respostas por polling**: sem webhook, "tempo real" é polling na reconciliação (defasagem de segundos a poucos minutos). Aceitável para o uso da Tati; migra para webhook sem retrabalho se o suporte UazapiGO resolver.
2. **Mídia e risco de ban**: envio de imagem em massa é mais agressivo para a reputação do número. Mitigação: delay maior, manter canário/janela/cap, e começar com campanhas pequenas nos números já aquecidos (azeredo-3, 4, 5, 7).
3. **Formato do dado de última compra**: se vier só por cliente (não por marca), o status será global por contato — decidir no import; o schema comporta os dois caminhos.
4. **azeredo-2 (Tatiane) segue restrita**: conectada, aceita envios, mas não entrega. Não usar em campanha até re-aquecer ou trocar o número.
5. **Custo Claude API**: entra pela primeira vez no produto (conversor/renomeador). Uso é pontual e barato (amostras, não arquivos inteiros), mas monitorar no console da Anthropic no 1º mês.

---

## 5. Cronograma sugerido

| Semana | Entrega | Dias de dev |
|--------|---------|-------------|
| Semana 1 (até 15/07) | Fase 1 (filtros + lista manual, com A1a condicionado ao dado da Tati) + início da Fase 2 | 2,5 + 1 |
| Semana 2 (até 22/07) | Fase 2 concluída (dashboard) + Fase 3 (conversor IA + renomeador) | 2 + 4 |
| Semana 3 (até 29/07) | Fase 4 (mídia em campanha → conversas por vendedor → vendedor no disparo se dados chegarem) | 5 |
| Paralelo | Pendências externas + discovery Mercos | — |

**Total estimado: 12–15 dias de desenvolvimento** (~3 semanas calendário), assumindo que os materiais da Tati cheguem durante a semana 1.

Ordem pensada para: (1) matar primeiro o que bloqueia o uso diário da Tati, (2) entregar o dashboard que dá visibilidade ao Cláudio, (3) ferramentas que eliminam trabalho manual recorrente, (4) evoluções de disparo que dependem de dados/definições externas.

---

## Changelog

- 08/07/2026 — Documento criado a partir do Backlog Checkpoint 04/07/2026 + auditoria de código e banco de produção.
