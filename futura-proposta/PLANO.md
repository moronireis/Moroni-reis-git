# Proposta Comercial — FUTURA DO BRASIL × u4digital

> Last updated: 2026-06-05
> Status: Planejamento
> Reuniao de entendimento: 2026-06-02 (48 min, Tiago + Moroni + Telma + Daniela)
> Recording: https://fathom.video/calls/694717829

---

## 1. INTELIGENCIA DO NEGOCIO (extraida da reuniao)

### Sobre a FUTURA DO BRASIL

| Dado | Valor |
|------|-------|
| Nome | FUTURA DO BRASIL (marca: Futura Gestao de Pessoas) |
| Site | futurasm.com.br |
| Localizacao | Santa Maria, RS |
| Tempo de mercado | 23 anos (desde 2003) |
| Equipe na reuniao | Telma Re (dona), Daniela/Dani (operacional) |
| Banco de candidatos | **54.226 candidatos** em plataforma propria |
| Plataforma atual | WordPress com banco de dados acoplado |
| Empresa de TI atual | GetCommerce (Santa Maria) — mantem site + dados |
| Comunicacao primaria | E-mail (automatizado: convite entrevista) |
| Comunicacao secundaria | WhatsApp (manual, quando candidato nao responde e-mail) |
| Volume semanal | ~200+ contatos com candidatos |
| Segmento | Consultoria de RH — recrutamento e selecao |
| Foco | Vagas efetivas (principal) + estagios |
| Diferencial | Velocidade de entrega + contato humano + comunidade de candidatos |

### Modelo de Receita Atual

| Fonte | Detalhe |
|-------|---------|
| Candidato | 30% do primeiro salario da vaga |
| Empresa (taxa abertura) | Varia por plano contratado |
| Plano 1 | Somente recrutamento (empresa entrevista) — taxa menor |
| Plano 2 | Recrutamento + entrevista pela Futura — taxa media |
| Plano 3 | Recrutamento + entrevista + testes — taxa maior |

**Transicao em andamento**: migrar cobranca 100% para empresa (especialmente vagas fora de SM). Em Santa Maria, cultura local resiste a essa mudanca.

### Dores Mapeadas (5 pontos criticos)

1. **Processos manuais consomem tempo** — triagem, contato, agendamento, pesquisa de candidatos, tudo manual
2. **Entregavel fraco para o cliente** — sem relatorio consolidado (DISC, background, analise), dificulta aumento de ticket
3. **Evasao entre atracao e entrevista** — maior perda no funil esta entre candidatura e comparecimento na entrevista
4. **Banco de dados em WordPress** — risco de seguranca (LGPD), sem estrutura profissional de armazenamento
5. **Escalabilidade limitada** — expansao nacional impossivel com processos manuais atuais

### Desejos Explicitos

1. **Manter contato humano** — essencia do negocio, comunidade com candidatos, diferencial regional
2. **Relatório robusto para cliente** — perfil DISC, consultas (criminal, trabalhista), analise consolidada
3. **Aumentar ticket medio** — entrega melhor = cobranca maior
4. **Expandir nacionalmente** — sair de Santa Maria para outros estados
5. **UX simples para candidato** — "o troço tem que fluir", nao pode ser cansativo ou tecnologico demais
6. **Velocidade mantida** — "vaga abre hoje, amanha de manha ja tenho candidato"

### O Que o Concorrente de Passo Fundo Ja Mostrou

- Busca automatica de CPF
- Consulta trabalhista
- Perfil profissional (DISC ou similar)
- Relatorio consolidado automatico pos-entrevista
- Cruzamento de dados automatizado

**Implicacao**: a Futura ja viu uma solucao parcial. A proposta u4digital precisa cobrir TUDO que o concorrente mostrou + ir alem com personalizacao + background checks que Moroni pediu para incluir.

### Nota Adicional do Moroni

> "Sobre a proposta da Futura do Brasil, nao esquece de incluir consulta a ficha criminal, processos trabalhistas, entre outras consultas e cruzamento de dados que eles mencionam que um concorrente ja apresentou a eles."

---

## 2. ARQUITETURA DA SOLUCAO — 8 MODULOS

### Modulo 1: Portal do Candidato (UX-First)

**Problema que resolve**: evasao entre atracao e entrevista + banco de dados inseguro

- Landing page dedicada (substitui formulario WordPress)
- Cadastro simplificado (nome, CPF, telefone, area de interesse — maximo 4 campos no primeiro passo)
- Progressive profiling: dados complementares coletados em etapas posteriores (nao tudo de uma vez)
- Upload de curriculo opcional (IA extrai dados automaticamente se enviado)
- Painel "Minhas Candidaturas" — candidato acompanha status
- Responsivo mobile-first (maioria dos candidatos acessa por celular)
- Integracao WhatsApp: link direto para cadastro via mensagem

**UX Golden Rule** (citacao da Telma): "Eu nao posso colocar um processo muito tecnologico. Ele tem que entrar no meu sistema e o troco tem que fluir."

### Modulo 2: Banco de Dados Profissional (Supabase)

**Problema que resolve**: dados em WordPress + risco LGPD + escalabilidade

- Migracao dos 54.226 candidatos do WordPress para Supabase
- Estrutura relacional: candidatos, vagas, empresas, processos, documentos
- RLS (Row Level Security) — controle granular de acesso
- LGPD compliance nativo: consentimento, portabilidade, exclusao
- Busca avancada: filtros por area, cidade, experiencia, disponibilidade, salario pretendido
- Tags e categorias personalizaveis
- Historico completo de interacoes por candidato

### Modulo 3: Background Check Automatizado

**Problema que resolve**: entregavel fraco + falta de diferenciacao + pedido explicito do Moroni

**Consultas automatizadas via API:**

| Consulta | Fonte/API | Custo Estimado |
|----------|-----------|---------------|
| Validacao de CPF | CPF Brasil API / Receita Federal | ~R$0,08/consulta |
| Ficha Criminal (antecedentes) | ClearSale BackgroundCheck / Checkr | ~R$2-5/consulta |
| Processos Trabalhistas | Jusbrasil API / PJe crawler | ~R$1-3/consulta |
| Situacao CPF na Receita | Receita Federal API | ~R$0,10/consulta |
| Consulta de Credito (opcional) | ClearSale / Serasa | ~R$2-4/consulta |
| Validacao de escolaridade (futuro) | MEC / instituicoes | A definir |

**Fluxo:**
1. Candidato faz cadastro e informa CPF
2. Sistema dispara consultas automaticamente (com consentimento LGPD)
3. Resultados armazenados no perfil do candidato
4. Flag automatico: verde (limpo), amarelo (atencao), vermelho (restricao)
5. Resultado aparece no relatorio final para o cliente

**Compliance LGPD:**
- Consentimento explicito do candidato antes de qualquer consulta
- Termo de autorizacao digital com aceite registrado
- Consultas so disparadas apos aceite
- Direito a exclusao respeitado

### Modulo 4: Perfil Comportamental (DISC + IA)

**Problema que resolve**: entregavel fraco + dependencia de ferramentas manuais

- Questionario DISC integrado a plataforma (candidato responde online)
- IA analisa respostas e gera perfil comportamental
- Compatibilidade automatica: perfil do candidato vs perfil da vaga
- Score de adequacao (0-100) por vaga
- Relatorio visual com graficos radar/barras
- Historico: se candidato ja fez DISC antes, reutiliza (nao cansa com repeticao)

**Diferencial vs concorrente de Passo Fundo:** IA cruza DISC com requisitos da vaga e gera recomendacao, nao so o perfil isolado.

### Modulo 5: Relatorio Consolidado para o Cliente

**Problema que resolve**: entregavel fraco = ticket baixo

O "produto final" que a Futura entrega para a empresa contratante:

- **Capa**: marca Futura + dados da vaga + data
- **Perfil do Candidato**: foto (opcional), dados pessoais, formacao, experiencia
- **Curriculo Formatado**: gerado por IA no padrao Futura (bonito, consistente)
- **Background Check**: status de cada consulta (criminal, trabalhista, CPF)
- **Perfil DISC**: grafico + descricao + pontos fortes/atencao
- **Score de Adequacao**: compatibilidade candidato × vaga
- **Parecer da Futura**: campo para Telma/Dani adicionarem consideracoes pessoais
- **Formato**: PDF profissional, branco, marca Futura

**Impacto no ticket**: esse relatorio justifica cobrar R$500-1.500+ por processo (vs taxa atual).

### Modulo 6: Automacao de Comunicacao

**Problema que resolve**: processos manuais + evasao

- **E-mail automatizado** (ja existe basico, agora com templates inteligentes):
  - Confirmacao de cadastro
  - Convite para entrevista (com link de confirmacao)
  - Lembrete 24h antes
  - Feedback pos-processo (aprovado/reprovado)
  - Reativacao de candidatos inativos
- **WhatsApp automatizado** (Evolution API / oficial):
  - Disparo de lembrete de entrevista
  - Confirmacao de presenca (botoes sim/nao)
  - Follow-up pos-entrevista
  - Notificacao de novas vagas na area do candidato
- **Regra de ouro**: automacao COMPLEMENTA o humano, nao substitui. Telma e Dani continuam mandando audio, ligando, conversando — a automacao cuida do operacional repetitivo.

### Modulo 7: Dashboard Operacional

**Problema que resolve**: falta de visibilidade + metrificacao

- **Metricas principais**:
  - Vagas abertas / fechadas / em andamento
  - Candidatos por etapa do funil (cadastro → triagem → entrevista → selecionado → contratado)
  - Taxa de comparecimento em entrevistas
  - Tempo medio de fechamento de vaga
  - Candidatos por area/cidade/faixa salarial
- **Visao por cliente**: quantas vagas cada empresa abriu, status, historico
- **Visao por candidato**: em quantos processos esta, historico de participacoes
- **Alertas**: candidato nao confirmou entrevista, vaga aberta ha X dias sem candidato, etc.

### Modulo 8: Gestao de Vagas e Match Inteligente

**Problema que resolve**: triagem manual + velocidade

- Empresa abre vaga com requisitos estruturados (area, salario, experiencia, perfil DISC desejado)
- IA faz match automatico contra o banco de 54K+ candidatos
- Ranking por score de adequacao
- Telma/Dani revisam top candidatos e decidem quem convidar
- Status da vaga visivel: aberta → em triagem → candidatos enviados → feedback → fechada
- Notificacao automatica para candidatos compativeis: "Nova vaga na sua area!"

---

## 3. FLUXO AUTOMATIZADO COMPLETO

```
CANDIDATO                          FUTURA (Telma/Dani)              EMPRESA CLIENTE
   |                                       |                              |
   |-- Acessa portal/link WhatsApp ------> |                              |
   |-- Cadastro simplificado (4 campos) -> |                              |
   |                                       |-- Background check auto ---> |
   |                                       |-- CPF + Criminal + Trab.     |
   |<- Confirmacao + convite DISC ---------|                              |
   |-- Responde DISC online -------------> |                              |
   |                                       |-- Score + perfil gerado      |
   |                                       |                              |
   |                                       |                              |-- Abre vaga
   |                                       |<- Recebe vaga + requisitos --|
   |                                       |-- Match IA contra 54K+ ----> |
   |                                       |-- Seleciona top candidatos   |
   |<- Convite entrevista (email+whats) ---|                              |
   |-- Confirma presenca (botao) --------> |                              |
   |<- Lembrete 24h antes ----------------|                              |
   |                                       |                              |
   |-- ENTREVISTA PRESENCIAL (HUMANO) ---> |                              |
   |   (Telma/Dani — essencia mantida)     |                              |
   |                                       |-- Adiciona parecer pessoal   |
   |                                       |-- Gera relatorio PDF ------> |
   |                                       |   (DISC+BG+curriculo+parecer)|
   |                                       |                              |-- Avalia candidatos
   |                                       |                              |-- Feedback
   |<- Feedback automatico (aprovado/nao) -|<- Recebe feedback -----------|
   |                                       |-- Fecha vaga + metricas      |
```

**Ponto-chave**: o contato humano esta preservado no centro do fluxo (entrevista presencial). Tudo antes e depois e automatizado.

---

## 4. TIMELINE DE IMPLEMENTACAO — 4 FASES

### Fase 1: Fundacao (Semanas 1-2)
- Migracao do banco de 54K candidatos (WordPress → Supabase)
- Setup de infraestrutura (Vercel + Supabase + APIs)
- Portal do candidato basico (cadastro + login)
- Dashboard esqueleto

**Entregavel**: banco de dados migrado, portal acessivel, dashboard visivel.

### Fase 2: Automacao Core (Semanas 3-4)
- Background check automatizado (CPF, criminal, trabalhista)
- DISC integrado (questionario + relatorio IA)
- Templates de e-mail automatizados
- Gerador de curriculo IA

**Entregavel**: candidato faz cadastro → background check roda → DISC disponivel → curriculo gerado.

### Fase 3: Match + Relatorio (Semanas 5-6)
- Gestao de vagas (CRUD + requisitos estruturados)
- Match inteligente (candidato × vaga)
- Relatorio consolidado PDF (DISC + BG + curriculo + parecer)
- WhatsApp automatizado (lembretes, confirmacoes)

**Entregavel**: fluxo completo funcionando — da abertura da vaga ao relatorio final.

### Fase 4: Refinamento + Treinamento (Semanas 7-8)
- Dashboard completo (todas as metricas)
- Treinamento Telma + Dani (uso da plataforma)
- Ajustes finos baseados em feedback
- Documentacao de processos
- Suporte 30 dias pos-entrega

**Entregavel**: plataforma em producao, equipe treinada, suporte ativo.

---

## 5. ESCOPO — 12 ENTREGAVEIS

| # | Entregavel | Modulo | Prioridade |
|---|-----------|--------|-----------|
| 1 | Migracao 54K candidatos para Supabase | M2 | Bloqueante |
| 2 | Portal do candidato (cadastro + perfil + vagas) | M1 | Bloqueante |
| 3 | Integracao background check (CPF + criminal + trabalhista) | M3 | Bloqueante |
| 4 | Questionario DISC + relatorio IA | M4 | Bloqueante |
| 5 | Gerador de curriculo IA (padrao Futura) | M5 | Importante |
| 6 | Relatorio consolidado PDF para cliente | M5 | Bloqueante |
| 7 | Templates de e-mail automatizados (5 templates) | M6 | Importante |
| 8 | WhatsApp automatizado (lembrete + confirmacao) | M6 | Importante |
| 9 | Match inteligente candidato × vaga | M8 | Importante |
| 10 | Dashboard operacional | M7 | Importante |
| 11 | Gestao de vagas (abertura → fechamento) | M8 | Bloqueante |
| 12 | Treinamento + documentacao + suporte 30 dias | — | Bloqueante |

---

## 6. INVESTIMENTO — 3 OPCOES

### Analise de Custos Internos (INTERNO — nao mostrar ao cliente)

**Desenvolvimento:**

| Item | Horas estimadas | Custo interno |
|------|----------------|--------------|
| Migracao banco (WordPress → Supabase) | 15-20h | R$750-1.000 |
| Portal do candidato | 30-40h | R$1.500-2.000 |
| Background check (APIs + integracao) | 20-25h | R$1.000-1.250 |
| DISC + relatorio IA | 25-30h | R$1.250-1.500 |
| Gerador de curriculo | 15-20h | R$750-1.000 |
| Relatorio PDF consolidado | 15-20h | R$750-1.000 |
| Automacao e-mail + WhatsApp | 20-25h | R$1.000-1.250 |
| Match inteligente | 15-20h | R$750-1.000 |
| Dashboard | 20-25h | R$1.000-1.250 |
| Gestao de vagas | 15-20h | R$750-1.000 |
| **TOTAL** | **190-245h** | **R$9.500-12.250** |

**Custos recorrentes (mensais):**

| Item | Custo/mes |
|------|----------|
| APIs de background check (~100 consultas/mes) | R$200-500 |
| API OpenAI/Claude (DISC + curriculo + match) | R$50-150 |
| Supabase (plano Pro) | R$25 (USD) |
| Vercel (hosting) | R$0 (free tier suficiente) |
| WhatsApp API (Evolution/oficial) | R$50-100 |
| Suporte u4digital (2-4h/mes) | R$200-400 |
| **TOTAL recorrente** | **R$525-1.175/mes** |

### Opcao A — Agressiva (conquista de mercado)

| Item | Valor |
|------|-------|
| Setup (implantacao) | R$4.500 |
| Parcelamento | 3× R$1.500 |
| A vista (desconto 10%) | R$4.050 |
| Recorrencia mensal | R$597/mes |
| Contrato minimo | 6 meses |

**Margem setup**: negativa (-R$5.000 a -R$7.750). Intencional — conquista de case regional.
**Margem recorrente**: ~R$0-70/mes nos primeiros meses, positiva apos otimizacao de APIs.
**Payback**: 10-15 meses via recorrencia.
**Justificativa**: Futura tem potencial de ser case para regiao centro do RS. Posiciona u4digital no mercado de RH regional.

### Opcao B — Padrao (equilibrada) ← RECOMENDADA

| Item | Valor |
|------|-------|
| Setup (implantacao) | R$6.500 |
| Parcelamento | 3× R$2.167 ou 4× R$1.625 |
| A vista (desconto 10%) | R$5.850 |
| Recorrencia mensal | R$697/mes |
| Contrato minimo | 6 meses |

**Margem setup**: -R$3.000 a -R$5.750 (negativa, mas menor perda).
**Margem recorrente**: ~R$0-170/mes.
**Payback**: 8-12 meses.
**ROI para o cliente**: se Futura fechar 2 vagas a mais por mes por causa da velocidade + relatorio, a R$500-1.000 de taxa media, ja paga a mensalidade.

### Opcao C — Premium (margem saudavel)

| Item | Valor |
|------|-------|
| Setup (implantacao) | R$8.500 |
| Parcelamento | 3× R$2.834 |
| A vista (desconto 10%) | R$7.650 |
| Recorrencia mensal | R$897/mes |
| Contrato minimo | 6 meses |

**Margem setup**: -R$1.000 a -R$3.750 (proxima do breakeven).
**Margem recorrente**: ~R$0-370/mes.
**Payback**: 5-8 meses.
**Risco**: Futura e empresa pequena de cidade do interior. R$8.5K pode ser barreira.

### Recomendacao: Opcao B

A Futura nao e uma rede de franquias com 300 unidades (como RHF). E uma empresa unica, com potencial de expansao. O setup de R$6.500 e justo para o escopo, e a recorrencia de R$697 cabe no caixa de uma consultoria de RH ativa com 200+ contatos/semana.

**Argumento de venda**: "Se o relatorio consolidado que a gente gera te permite cobrar R$200 a mais por vaga, em 3-4 vagas por mes voce ja pagou a mensalidade inteira."

---

## 7. ESTRUTURA DA PROPOSTA (SLIDES)

Formato: HTML interativo (mesma engine da RHF), dark theme, slide deck com navegacao.

### Slide 1 — Hero
- Titulo: "Plataforma Inteligente de Recrutamento"
- Subtitulo: "Feita sob medida para a FUTURA DO BRASIL"
- Meta: u4digital | Junho 2026 | Confidencial
- Badges: 23 anos de mercado | 54K+ candidatos | Expansao nacional

### Slide 2 — Contexto
- Stats grid (4 cards):
  - 23 anos de operacao
  - 54.226 candidatos em banco
  - ~200 contatos/semana
  - 3 planos de selecao oferecidos
- Callout: "A Futura e referencia em velocidade e contato humano em Santa Maria. O desafio: escalar sem perder a essencia."

### Slide 3 — Diagnostico (5 Dores)
1. Processos manuais consomem horas de triagem e comunicacao
2. Entregavel basico impede aumento de ticket medio
3. Evasao de candidatos entre cadastro e entrevista
4. Banco de dados em WordPress sem seguranca profissional (LGPD)
5. Expansao nacional travada por dependencia de processos locais/manuais

### Slide 4 — Impacto Financeiro
- Horas/semana gastas em tarefas manuais: estimativa 15-20h
- Custo de oportunidade: vagas que poderiam ser fechadas com o tempo recuperado
- Risco LGPD: multas de ate 2% do faturamento
- Ticket medio que deixa de crescer sem entregavel robusto

### Slide 5 — Antes vs Depois
| Antes | Depois |
|-------|--------|
| Triagem manual no WordPress | Match IA automatico contra 54K+ |
| Background check: nenhum | CPF + criminal + trabalhista automatico |
| Perfil comportamental: nenhum | DISC integrado com score de adequacao |
| Curriculo: o que o candidato manda | Curriculo formatado IA padrao Futura |
| Entrega pro cliente: verbal/audio | Relatorio PDF profissional consolidado |
| Comunicacao: email + whats manual | Automacao com templates inteligentes |
| Dashboard: nenhum | Metricas em tempo real |
| Dados: WordPress inseguro | Supabase com LGPD nativo |

### Slide 6 — Solucao (8 Cards)
- 8 modulos com icone + titulo + 1 frase de valor (conforme Secao 2)

### Slide 7 — Fluxo Automatizado
- Diagrama visual do fluxo (conforme Secao 3)
- Destaque: "ENTREVISTA PRESENCIAL (HUMANO)" no centro — essencia preservada

### Slide 8 — Background Check (Slide Dedicado)
- Visual dos 5 tipos de consulta
- Flags: verde/amarelo/vermelho
- Compliance LGPD explicado
- **Este slide existe porque o concorrente ja mostrou algo similar** — precisamos mostrar que fazemos melhor

### Slide 9 — Relatorio Consolidado (Slide Dedicado)
- Mockup visual do PDF final
- Secoes: dados + curriculo + background + DISC + score + parecer Futura
- "O entregavel que justifica cobrar mais."

### Slide 10 — Timeline (4 Fases)
- Visual vertical com 4 fases, 8 semanas total (conforme Secao 4)

### Slide 11 — Escopo (12 itens)
- Checklist visual com tags Bloqueante/Importante (conforme Secao 5)

### Slide 12 — Case RHF (Social Proof)
- "Ja fizemos para a RHF Talentos — 800+ unidades"
- Substituimos Pandape + ChatGuru
- Plataforma personalizada em producao
- (Sem revelar dados confidenciais — mencao de credibilidade apenas)

### Slide 13 — Visao de Expansao
- "A plataforma cresce com a Futura"
- Hoje: Santa Maria. Amanha: RS inteiro. Depois: nacional.
- Custo marginal baixo para adicionar mais unidades/operadores
- Banco de candidatos multiregional

### Slide 14 — Investimento
- Opcao recomendada (B) em destaque
- Parcelamento visivel
- ROI calculado: "2 vagas a mais por mes = mensalidade paga"
- A vista com 10% desconto

### Slide 15 — Proximo Passo
- "Vamos construir juntos?"
- CTA: Agendar kickoff
- Contatos Moroni + Tiago

### Slide 16 — Obrigado
- Logos u4digital + Futura
- "Seu crescimento e o nosso crescimento."

---

## 8. DEMO / MVP A CONSTRUIR

Para a segunda reuniao, construir uma demo visual (como mvp.html da RHF) mostrando:

1. **Tela de cadastro do candidato** — formulario clean, 4 campos, mobile-first
2. **Painel de background check** — resultado visual com flags verde/amarelo/vermelho
3. **Resultado DISC** — grafico radar + descricao + score
4. **Curriculo gerado** — preview no padrao Futura
5. **Relatorio PDF** — mockup do entregavel final completo
6. **Dashboard** — metricas principais com dados mockados (baseados nos 54K)
7. **Tela de match** — vaga aberta vs top 5 candidatos rankeados

**Cor da demo**: adaptar para a marca Futura (verificar cores do site futurasm.com.br — provavel azul/verde).

---

## 9. KICKOFF (pos-assinatura)

### O que Telma precisa enviar:

1. Acesso ao WordPress (admin) ou contato da GetCommerce para migracao
2. Estrutura dos dados atuais (campos do cadastro de candidatos)
3. Logo da Futura em alta resolucao (PNG/SVG)
4. Cores da marca Futura
5. Modelos de e-mail atuais (se existirem templates)
6. Lista de tipos de vaga mais frequentes
7. Exemplo de relatorio/feedback que enviam hoje para clientes
8. Lista de empresas clientes ativas (para entender perfil)

### Responsabilidades:

| Tarefa | Responsavel |
|--------|------------|
| Migracao de dados | u4digital + GetCommerce |
| Design da plataforma | u4digital |
| Desenvolvimento completo | u4digital |
| Conteudo dos templates de email | Futura + u4digital |
| Testes e validacao | Futura (Telma + Dani) |
| Treinamento | u4digital |
| Suporte pos-entrega (30 dias) | u4digital |

---

## 10. RISCOS E MITIGACOES

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| GetCommerce nao coopera na migracao | Media | Alto | Moroni mencionou que consegue extrair dados do WordPress diretamente (acesso tecnico) |
| Dados do WordPress estao desestruturados | Alta | Medio | Fase 1 inclui limpeza/normalizacao antes de migrar |
| APIs de background check caras demais | Baixa | Medio | ClearSale e Checkr tem planos competitivos. Custo por consulta ~R$2-5. Volume da Futura e moderado (~200/mes) |
| Telma resiste a mudanca de workflow | Baixa | Alto | Proposta preserva o contato humano como centro. Automacao complementa, nao substitui |
| Candidatos nao aderem ao novo portal | Media | Alto | UX mobile-first, maximo 4 campos iniciais, WhatsApp como canal de entrada |
| Expansao nacional nao acontece | Media | Baixo | Plataforma funciona para SM independente de expansao. ROI se paga local |

---

## 11. DIFERENCIAIS vs CONCORRENTE DE PASSO FUNDO

| Aspecto | Concorrente (Passo Fundo) | u4digital |
|---------|--------------------------|-----------|
| Tipo | Plataforma pronta (SaaS) | Sob medida para Futura |
| Personalizacao | Limitada | Total — codigo e da Futura |
| Background checks | Basico (CPF + trabalhista) | Completo (CPF + criminal + trabalhista + credito) |
| DISC | Ferramenta externa | Integrado na plataforma + IA match |
| Relatorio | Padronizado | PDF personalizado marca Futura |
| Escalabilidade | Depende do vendor | Futura controla tudo |
| Case no segmento | ? | RHF Talentos (800+ unidades) |
| Suporte | Generico | Dedicado (Tiago local + Moroni) |

---

## 12. PROXIMOS PASSOS

1. [x] Reuniao de entendimento (02/06)
2. [ ] Criar grupo WhatsApp (Tiago + Moroni + Telma + Dani)
3. [ ] Coletar referencias e ideias da Telma no grupo
4. [ ] Construir demo/MVP visual (mvp.html)
5. [ ] Construir proposta comercial (index.html — 16 slides)
6. [ ] Construir interno.html (analise de custos — SOMENTE u4digital)
7. [ ] Agendar segunda reuniao
8. [ ] Apresentar proposta + demo
9. [ ] Negociacao e fechamento
10. [ ] Kickoff (se fechado)

---

## 13. ARGUMENTOS-CHAVE PARA A REUNIAO DE PROPOSTA

### Emocional (Telma)
- "A essencia da Futura — o contato humano — fica intacta. A automacao cuida do resto."
- "O relatorio consolidado e o upgrade que justifica cobrar mais. E a entrega que posiciona a Futura como premium."
- "Seus 54 mil candidatos sao ouro. Hoje estao num cofre sem tranca. Vamos proteger e potencializar esse capital."

### Racional (Dani)
- "Hoje voce gasta X horas por semana em triagem manual. Com o match IA, sao 2 minutos."
- "O lembrete automatico de WhatsApp reduz no-show em 30-40%."
- "Background check automatico: o que hoje nao existe, passa a ser diferencial competitivo da Futura."

### Social Proof
- "A RHF — 800+ unidades, uma das maiores do Brasil no segmento — substituiu Pandape e ChatGuru pela nossa solucao."
- "A Chevrolet e a Volkswagen confiam no nosso trabalho de automacao."

### Urgencia
- "O concorrente de Passo Fundo ja te mostrou uma solucao. A diferenca: eles vendem uma caixa pronta. Nos construimos a SUA plataforma."
- "Cada mes sem background check e um mes entregando menos do que o mercado ja espera."

---

*Documento interno u4digital. Nao compartilhar com cliente.*
