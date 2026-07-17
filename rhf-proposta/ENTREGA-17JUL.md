# RHF Talentos — Entrega 17/jul + Lista de Testes

> **Tudo abaixo já está no ar** em https://rhf-talentos-plataforma.vercel.app
> Fases 0 a 4 do backlog executadas e testadas por mim (Claude) em produção. Fases 5–6 têm bloqueio real documentado no fim.
> **Login admin:** admin@rhftalentos.com.br · senha `Rhf@2026-441fb4a2`

---

## PARTE 1 — O que foi executado (12 itens do backlog)

### Fase 0 — Correções rápidas (8 issues)

| Issue | O que mudou | Testei? |
|---|---|---|
| **#26 / #15** | O formulário do gerador **zera ao trocar de candidato e após cada geração** — não reaproveita mais dados/foto do candidato anterior | ✅ código determinístico |
| **#5** | Fim dos campos ilegíveis: o fundo ficava branco **ao clicar/digitar** (texto sumia). Corrigido no gerador, modal de e-mail e tela de Configurações | ✅ CSS no ar |
| **#11** | **"Preparar arquivo (ChatGuru)"** virou o botão laranja em destaque; "Enviar por e-mail" ficou secundário | ✅ no ar |
| **#13** | A fila de entrega agora mostra **"Enviado por *recrutador*"** | ✅ dado já gravado |
| **#7** | E-mail sai com a **introdução institucional** ("Prezados, Possuímos um novo candidato selecionado pela RHF Talentos Vale do Sinos...") | ✅ envio real testado |
| **#9** | Tags do arquivo no ChatGuru = **recrutador + nome do processo + cidade** (o código fixo "1164" foi removido) | ✅ upload real conferido |
| **#8** | O campo **Observações** agora entra no currículo como **bullets profissionais** reescritos pela IA (com correção de português) | ✅ verificado no banco |
| **#14** | IA passou a **corrigir gramática/ortografia** e **normalizar qualquer origem** (Infojobs, Pandapé ou outro) para o padrão RHF | ✅ demonstrado no teste |

### Fase 1 — Qualidade do PDF (#17, #16)

- **#17 — margens:** páginas 2 em diante agora respeitam margem superior/inferior. Medi objetivamente: a página 2 foi de **0,3 mm → 10,2 mm** no topo; página 3 com 9,9 mm. ✅
- **#16 — arte/logo:** aumentei a resolução de renderização (scale 2 → 3). Logo e arte saem **nítidos**. PDF final ~1,3 MB (bem abaixo do limite). ✅
- Títulos de seção não ficam mais "órfãos" no pé da página.

### Fase 2 — "Excluir" de verdade na fila (#10)

- O botão **"Desfazer"** (que só tirava do controle) virou **"Excluir"**: remove o PDF **do módulo Arquivos do ChatGuru E da plataforma**, e libera o currículo para ser preparado de novo. Pede confirmação. ✅
- Testei o ciclo completo: preparar → confirmar que o arquivo existe no ChatGuru → excluir → confirmar remoção **nos três lugares** (ChatGuru, Storage e banco). ✅

### Fase 3 — Permissões por perfil (#1)

- **Recrutador:** vê **só o Gerador de CV** (Dashboard e Funil ficam ocultos; a tela abre direto no gerador).
- **Admin:** vê tudo.
- Protegi também o **backend**: o Dashboard só responde com token de admin (recrutador ou sem login → bloqueado). Testei os três casos: recrutador → bloqueado, sem token → bloqueado, admin → liberado. ✅

### Fase 4 (fundação) — Ler as tags do ChatGuru (#24/#3)

- A plataforma agora **lê as 16 tags reais** cadastradas na conta do ChatGuru (VALE DO SINOS, interesse_gerente_loja, origem_meta_ads, CANDIDATO, CLIENTE etc.). Isso é a base para os filtros do Dashboard (#3) e o mapeamento de tags (#24). ✅ endpoint no ar e testado.

---

## PARTE 2 — Lista de testes para vocês (Tiago / Rodrigo / Daniela)

Já testei tudo por trás (API, banco, ChatGuru real). O que peço abaixo é a **validação de vocês na tela**, do jeito que o usuário usa. Sugiro fazer logado como **admin** primeiro, depois como **recrutador (Daniela)**.

### A. Gerador de CV — o teste mais importante (#26/#15/#8/#14)
1. Importe um PDF de um candidato (ou selecione um existente) e gere o currículo.
2. **Sem recarregar a página**, selecione **outro** candidato e gere. → Confirme que **nenhum dado do primeiro** (pretensão, cidade, foto, observações) apareceu no segundo.
3. No campo **Observações**, escreva algo com erros de português de propósito (ex.: "disponivel pra viajar, ja trabalhou com atendimento ao publico"). Gere. → Confirme que virou **bullets corrigidos** em "Informações Complementares".
4. Confirme que o texto do currículo saiu **sem erros de gramática**.

### B. PDF (#17/#16)
5. Gere um candidato com **muita experiência** (que ocupe 2–3 páginas). Clique em **Preparar arquivo** e abra o PDF.
6. Confirme que **todas as páginas** têm margem no topo e no rodapé (não coladas na borda).
7. Confirme que o **logo e a arte azul** estão nítidos.

### C. Entrega e fila (#11/#13/#9/#10)
8. Confirme que **"Preparar arquivo (ChatGuru)"** é o botão em destaque (laranja).
9. Prepare um currículo e veja na fila embaixo: deve aparecer **"Enviado por [seu nome]"**.
10. No ChatGuru > Arquivos, confira que o arquivo entrou com as **tags = seu nome + nome da vaga + cidade** (sem o "1164").
11. Na fila, clique em **"Excluir"** num item entregue. → Confirme que ele **sumiu do ChatGuru > Arquivos** também.

### D. E-mail (#7)
12. Gere um currículo e envie por e-mail para você mesmo. → Confirme que o corpo começa com **"Prezados, Possuímos um novo candidato selecionado pela RHF Talentos Vale do Sinos..."**.

### E. Contraste / visual (#5)
13. No Gerador e em **Configurações**, clique nos campos e digite. → Confirme que o texto **aparece** (não fica branco no branco).

### F. Permissões (#1) — precisa da conta da Daniela
14. Entre com a conta **recrutador (valedosinos@rhf.com.br / Daniela)**. → Confirme que ela vê **só o Gerador de CV** (sem Dashboard e sem Funil) e que a tela abre direto no gerador.
15. Entre como **admin** → confirme que vê **Dashboard + Funil + Gerador**.

### G. Tags (#24 fundação)
16. (Opcional, técnico) As 16 tags da conta já são lidas pela plataforma — isso aparece no Dashboard quando os filtros forem construídos (Fase 6). Nada a testar na tela ainda.

> **Como me passar o retorno:** anota o número do item + "ok" ou o que achou estranho (print ajuda). Eu ajusto o que precisar num próximo deploy.

---

## PARTE 3 — O que NÃO foi feito ainda (e por quê)

Estas fases dependem de decisões que **não são técnicas minhas** — precisam de vocês:

### ⚠️ Decisão de stack (bloqueia o restante)
As issues #23/#24/#25 do Renan descrevem **Nuxt + Laravel** — uma stack que **a plataforma atual não usa** (ela é HTML/JS + Vercel + Supabase). **Antes de construir Fases 5–6, precisamos alinhar: quem implementa e em qual base?** Se for reescrever em Nuxt/Laravel, é um projeto à parte; se for evoluir a atual, eu sigo.

### Fase 5 — Funil espelhado do ChatGuru (#2, #23)
Investiguei a fundo: o ChatGuru **não tem API de leitura** do funil. As **etapas de cada conversa** só existem dentro do painel (kanban dinâmico, página de 1,2 MB), exigindo engenharia reversa frágil. Além disso, o Rodrigo ainda vai **desenhar o fluxo desejado** (foi por isso que removemos a UI de "Apresentar no grupo" antes). Construir agora = retrabalho garantido. **Recomendo: Rodrigo define o fluxo → eu implemento.**

### Fase 6 — Dashboard com filtros por tag + resumo p/ grupo (#3/#25, #4)
A fundação (ler as 16 tags) **já está pronta** (Fase 4). O que falta — filtros na tela, "gerar resumo" e enviar ao grupo — depende do desenho do Rodrigo (item acima) e da decisão de stack. O motor de envio ao grupo já existe pronto no backend, só desativado esperando o fluxo final.

---

## Resumo técnico

- **Deploy:** produção atualizada + alias · **11/12** funções Vercel (dentro do limite)
- **Migration 009** aplicada (persiste o id do arquivo no ChatGuru p/ permitir exclusão)
- **Commits/tags** no repo `u4digital/RHF-Talentos`: `versao-17jul` (Fase 0) + Fases 1–4
- **Sem impacto** em nenhum outro projeto (Azeredo/Marpe/Hub) — instância Supabase compartilhada, mudanças isoladas na RHF
