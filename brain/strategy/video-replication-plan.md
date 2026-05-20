# Plano de Replicacao — Videos AI-Generated (Formato Tiago Lemos / Mestres da IA)

Last updated: 2026-05-07
Status: APROVADO — Maxima qualidade, voz gravada pelo Moroni, tudo IA no resto

---

## DECISOES CONFIRMADAS

- **Qualidade**: Maxima possivel (Opcao Premium)
- **Voz/Narracao**: Moroni grava o audio real (SEM ElevenLabs TTS)
- **Tudo mais**: 100% IA (video clips, imagens, composites, legendas, edicao)
- **HeyGen**: SIM para avatar (Formato B) + composites pessoa+cenario (Formato A)

---

## 1. ANALISE DETALHADA DOS 2 FORMATOS

### FORMATO A — "Criativo Cinematografico" (Video 1, 50s)

**O que e**: Um video 100% produzido por IA com ~20 cenas distintas de 2-3s cada, narrado com voz (TTS ou clone), legendas burned-in, e CTA final com card de evento.

**Decomposicao quadro a quadro (28 frames analisados):**

| Timestamp | Cena | Tipo de Asset | Tecnica Provavel |
|-----------|------|---------------|-----------------|
| 0.5s | Pessoa de jaqueta preta segurando bola de fogo | AI composite (corpo + cenario + VFX) | Kling/Veo video from image (foto real + prompt) |
| 2.0s | Meteoro/bola de fogo caindo no espaco | AI video clip puro | Veo/Kling (text-to-video) |
| 3.5s | Computador retro anos 90 com dados explodindo da tela | AI video clip + efeitos | Veo/Kling (text-to-video) |
| 5.6s | iPhone 2007 "slide to unlock" com overlay "2007" | Stock footage + text overlay | Pexels/stock + editor |
| 8.0s | Terminal CLI vazio com cursor verde | AI image animada ou screen capture | Simples, pode ser mocado |
| 11.1s | "CLAUDE CODE" em pixel art estilo space invaders + terminal | AI image estilizada | Midjourney/Flux prompt + animacao |
| 14.0s | Pessoa sentada em "command center" com robos trabalhando em telas holograficas | AI video composite | Kling/Veo (image-to-video a partir de prompt) |
| 16.7s | Robo 3D apontando para dashboard de CRM/Sales Pipeline | AI video 3D render | Kling/Veo (text-to-video com descricao detalhada) |
| 20.0s | Robo chatbot atendendo mensagens de customer service | AI image/video 3D | Kling/Veo |
| 22.2s | Exercito de robos 3D cute (faces LED verdes) | AI video 3D render | Kling/Veo |
| 25.0s | Robo sentado gesticulando com mensagens de chat flutuando | AI video 3D | Kling/Veo |
| 27.8s | Notificacoes de Pix flutuando no espaco (R$3.200, R$1.850, R$2.300) | AI image + motion design | Midjourney/Flux image + animacao ou Veo |
| 30.0s | Diagrama 3D de AI agent network (nodes conectados com luzes) | AI video 3D render | Kling/Veo |
| 33.4s | Sala de reuniao verde neon com equipe e whiteboard | AI video scene | Kling/Veo |
| 35.0s | Calendario de marco pegando fogo | AI video scene | Kling/Veo (text-to-video) |
| 38.9s | Mulher assistindo curso "Claude AI" no laptop (cena cozy, hiper-realista) | AI video scene (totalmente gerada) | Veo/Kling |
| 40.0s | Time de robos em sala estilo Matrix (wireframe verde) | AI video scene | Kling/Veo |
| 44.5s | Pessoa real composited com exercito de robos em galpao industrial | AI composite (face swap + cenario) | HeyGen ou Kling image-to-video |
| 47.0s | Mulher assistindo aula ao vivo (repeticao, angulo diferente) | AI video scene | Veo/Kling |
| 49.0s | Card CTA final: "Missao Claude Code" + data + "Comenta CLAUDE" | Design estatico com mocao | Canva/Figma + overlay |

**Elementos-chave do formato:**
- **~20 cenas unicas** de AI video, cada uma 2-3 segundos
- **Narracao continua** sincronizada com as cenas (voz clone TTS)
- **Legendas bold brancas** centralizadas na parte inferior
- **Paleta escura/quente**: pretos, laranjas, verdes neon
- **Pessoa real composited** em 3-4 cenas (rosto/corpo em cenario AI)
- **Card CTA final** com design estatico profissional (5-7s no fim)
- **Ritmo frentico** — cortes rapidos mantendo atencao

**Nivel de producao**: ALTO. Estimativa de 6-10 horas de trabalho por video neste formato, contando geracao de cada clip AI, selecao dos melhores, composicao, narracao e edicao final.

---

### FORMATO B — "Split-Screen Tutorial" (Video 2, 59s)

**O que e**: Tela dividida 50/50 — parte superior mostra screen recording de ferramenta sendo usada, parte inferior mostra a pessoa falando (provavelmente avatar HeyGen ou gravacao real).

**Decomposicao:**

| Timestamp | Parte Superior (Screen) | Parte Inferior (Pessoa) |
|-----------|------------------------|------------------------|
| 6.6s | Google Docs com prompt de "arquivista de contexto" | Pessoa falando, gesticulando, mesa com laptop |
| 13.2s | ChatGPT interface com prompt sendo colado | Mesma pessoa, mesmo angulo |
| 19.7s | ChatGPT processando resposta | Pessoa gesticulando |
| 26.3s | ChatGPT output em Markdown | Pessoa explicando |
| 32.9s | Claude.ai settings/configuracoes | Pessoa continuando |
| 39.5s | Claude.ai chat com output "criador de conteudo" | Pessoa gesticulando |
| 46.1s | Card evento "Missao Claude Code" no topo | Pessoa falando sobre o evento |
| 52.7s | Card evento (mesmo) | Pessoa com CTA "como implementar" |

**Elementos-chave do formato:**
- **Layout fixo 50/50** (topo: screen, baixo: pessoa)
- **Screen recording real** de ferramentas (ChatGPT, Claude, Google Docs)
- **Pessoa filmada** em setup profissional (cadeira verde, estante, iluminacao)
- **Legendas bold brancas** no espaco da pessoa (parte inferior)
- **CTA final** com card de evento sobrepondo a area de screen
- **Mesma gravacao de pessoa** o video inteiro (um take continuo)
- **Troca apenas o conteudo da tela superior**

**Nivel de producao**: MEDIO. Estimativa de 2-3 horas por video. A parte mais trabalhosa e gravar/gerar a pessoa falando. O screen recording e trivial.

---

## 2. TECNOLOGIAS IDENTIFICADAS NA PRODUCAO ORIGINAL

### Para o Formato A (Criativo Cinematografico):

| Componente | Ferramenta Provavel | Evidencia |
|-----------|-------------------|-----------|
| Video clips AI (cenas 3D, robos, cenarios) | **Kling AI** ou **Veo 3** (Google) | Qualidade 3D, consistencia de estilo, movimentos de camera |
| Imagens base para image-to-video | **Midjourney v6** ou **Flux Pro** | Nivel de detalhe nos frames estaticos |
| Composicao pessoa + cenario AI | **HeyGen** (AI avatar) ou **Kling image-to-video** | Pessoa aparece em cenarios impossiveis |
| Voz / Narracao | **ElevenLabs** (voice clone) ou **HeyGen TTS** | Narracao fluida, natural em PT-BR |
| Legendas | **CapCut** auto-caption ou **Submagic** | Estilo padrao de legendas Reels |
| Edicao / Composicao final | **CapCut Pro** ou **Premiere** | Cortes, timing, overlays |
| Card CTA final | **Canva** ou **Figma** | Design estatico profissional |

### Para o Formato B (Split-Screen Tutorial):

| Componente | Ferramenta Provavel | Evidencia |
|-----------|-------------------|-----------|
| Video da pessoa falando | **HeyGen** (avatar AI) ou gravacao real | Movimento natural, mesmo angulo todo o video |
| Screen recording | **OBS** ou **Loom** | Captura de tela real das ferramentas |
| Composicao split-screen | **CapCut** ou **Premiere** | Layout 50/50 fixo |
| Legendas | **CapCut** auto-caption | Estilo padrao |
| Card CTA final overlay | **Canva** + overlay no editor | Design pre-feito |

---

## 3. STACK DEFINITIVA — MAXIMA QUALIDADE

### Ferramentas Necessarias

| # | Ferramenta | Funcao | API/Acesso Necessario | Custo | Status |
|---|-----------|--------|----------------------|-------|--------|
| 1 | **Kling AI Pro** | Video clips AI (text-to-video, image-to-video). Cenas 3D, robos, cenarios cinematograficos | API key (klingai.com → Settings → API) | $66/mes (660 creditos, ~200 clips de 5s) | ASSINAR |
| 2 | **HeyGen** | Avatar AI do Moroni (split-screen + composites pessoa+cenario) | API key (heygen.com → Settings → API Access) | $29/mes Creator (15min video, 1 avatar) | ASSINAR |
| 3 | **Midjourney** | Imagens base cinematograficas de maxima qualidade para image-to-video | Discord bot OU web app (midjourney.com) | $30/mes Standard (15h fast GPU) | ASSINAR |
| 4 | **Remotion Superpowers** (Veo 3) | Video clips AI alternativos, animacao de imagens | Ja configurado | $0 (ja temos) | OK |
| 5 | **Remotion Superpowers** (Flux) | Imagens complementares rapidas | Ja configurado | $0 (ja temos) | OK |
| 6 | **Pexels API** | Stock footage/fotos gratis (B-roll real) | Ja configurado | $0 (ja temos) | OK |
| 7 | **Whisper** (local) | Transcricao do audio gravado → legendas SRT | Ja configurado | $0 (ja temos) | OK |
| 8 | **CapCut Pro** | Edicao final, composicao, legendas estilizadas, transicoes | Baixar app + assinar | $8/mes | ASSINAR |
| 9 | **Canva Pro** | Cards CTA, overlays, design estatico | Ja tem | $0 (ja temos) | OK |
| 10 | **ffmpeg** | Composicao programatica, encoding, burn-in | `brew install ffmpeg` | $0 | INSTALAR |

### Custo Total: ~$133/mes (~R$700/mes)

### O que voce precisa me passar (APIs/Acesso):

```
PARA TESTES IMEDIATOS:
------------------------------------------------------
1. KLING AI
   - Assinar em: klingai.com
   - Plano: Pro ($66/mes)
   - Pegar: API Access Key + Secret Key
   - Onde: Settings → API Management → Create API Key
   
2. HEYGEN
   - Assinar em: heygen.com  
   - Plano: Creator ($29/mes)
   - Pegar: API Key
   - Onde: Settings → API Access → Generate API Key
   - IMPORTANTE: Gravar video de 2min de voce (instrucoes abaixo)
   
3. MIDJOURNEY
   - Assinar em: midjourney.com
   - Plano: Standard ($30/mes)
   - Acesso: Via Discord bot OU via web (midjourney.com/imagine)
   - Para automacao: existem wrappers API nao-oficiais
   
4. CAPCUT PRO
   - Baixar: capcut.com (desktop)
   - Assinar Pro ($8/mes)
   - Sem API — uso manual para edicao final

JA TEMOS (nenhuma acao necessaria):
------------------------------------------------------
5. Remotion Superpowers (Veo 3 + Flux) — OK
6. Pexels — OK
7. Whisper — OK
8. Canva — OK
```

---

## 4. PIPELINE DE PRODUCAO COMPLETA

### FORMATO A — "Criativo Cinematografico" (50-60s)

```
FASE 1: PRE-PRODUCAO (30min)
═══════════════════════════════════════════════════════
│
├─ 1.1 ROTEIRO
│   Input:  Tema + angulo + CTA
│   Agent:  reels-scriptwriter (ou manual)
│   Output: Script com SHOT LIST detalhada
│           Cada linha = 1 cena de 2-3s
│           Ex: "0:00-0:03 — Pessoa segurando energia nas maos,
│                cenario escuro industrial, jaqueta preta"
│
├─ 1.2 GRAVACAO DE VOZ (Moroni)
│   Input:  Script de narracao
│   Acao:   Moroni grava audio MP3/WAV no celular ou microfone
│   Specs:  Audio limpo, sem ruido, ritmo natural
│   Output: audio-narracao.mp3 (50-60s)
│
└─ 1.3 TRANSCRICAO + TIMING
    Input:  audio-narracao.mp3
    Tool:   Whisper (generate_subtitles)
    Output: narracao.srt (legendas com timestamps exatos)

FASE 2: GERACAO DE ASSETS AI (2-4h)
═══════════════════════════════════════════════════════
│
├─ 2.1 IMAGENS BASE (Midjourney + Flux)
│   Input:  Shot list com descricao de cada cena
│   Tools:  Midjourney (cenas premium) + Flux (cenas rapidas)
│   Specs:  Aspecto 9:16 (vertical), estilo cinematografico escuro
│   Volume: 15-25 imagens por video
│   Output: /assets/images/scene-01.png ... scene-25.png
│
│   PROMPT TEMPLATE MIDJOURNEY:
│   "[descricao da cena], cinematic lighting, dark moody atmosphere,
│    9:16 vertical, photorealistic 3D render, orange and green neon
│    accents, black background, film grain, 8k --ar 9:16 --v 6.1"
│
├─ 2.2 VIDEO CLIPS AI (Kling + Veo)
│   Input:  Imagens base + descricoes de movimento
│   Tools:  
│     - Kling image-to-video (cenas complexas, 3D, robos)
│     - Kling text-to-video (cenas sem imagem base)
│     - Veo 3 via Remotion (cenas simples, alternativas)
│   Specs:  9:16, 5s cada, 30fps, alta qualidade
│   Volume: 15-25 clips por video
│   Output: /assets/clips/scene-01.mp4 ... scene-25.mp4
│
│   ESTRATEGIA DE GERACAO:
│   - Gerar 2-3 variantes de cada cena
│   - Selecionar a melhor
│   - ~60-75 geracoes por video (3x redundancia)
│   - Kling Pro: 660 creditos/mes → ~3-4 videos/mes nesse ritmo
│
├─ 2.3 COMPOSITES PESSOA + CENARIO (HeyGen ou Kling)
│   Input:  Foto/video de Moroni + cenario AI gerado
│   Tools:
│     - HeyGen: avatar falando em cenarios customizados
│     - Kling image-to-video: foto de Moroni + cenario AI como input
│   Specs:  3-4 cenas com Moroni composited por video
│   Output: /assets/clips/composite-01.mp4 ... composite-04.mp4
│
│   METODO KLING (sem HeyGen):
│   1. Foto profissional de Moroni (corpo inteiro, fundo neutro)
│   2. Gerar imagem base no Midjourney: cenario + espaco para pessoa
│   3. Combinar no editor (Photoshop/Canva) ou via inpainting
│   4. Kling image-to-video para animar o resultado
│
│   METODO HEYGEN:
│   1. Upload video de 2min de Moroni (treinamento avatar)
│   2. Selecionar cenario AI como background
│   3. Gerar clip do avatar falando/gesticulando
│
├─ 2.4 CARD CTA FINAL (Canva)
│   Input:  Dados do evento/produto
│   Tool:   Canva (ja temos)
│   Specs:  1080x1920 (9:16), dark background, logo, data, botao CTA
│   Output: /assets/cta-card.png (ou .mp4 animado)
│
└─ 2.5 MUSICA DE FUNDO (opcional)
    Input:  Mood description
    Tool:   Remotion generate_music OU trilha royalty-free
    Output: /assets/background-music.mp3

FASE 3: EDICAO E COMPOSICAO (1-2h)
═══════════════════════════════════════════════════════
│
├─ 3.1 MONTAGEM NO CAPCUT PRO
│   Input:  Todos os assets + audio gravado + SRT
│   Acao:
│     1. Importar audio-narracao.mp3 como trilha principal
│     2. Importar cada clip AI na ordem do shot list
│     3. Sincronizar cortes dos clips com a narracao
│     4. Adicionar transicoes (corte seco ou fade rapido, 0.1-0.2s)
│     5. Importar SRT → legendas auto-estilizadas
│     6. Adicionar CTA card nos ultimos 5-7s
│     7. Adicionar musica de fundo (volume baixo, -15dB)
│     8. Exportar 1080x1920, 30fps, H.264
│   Output: video-final-formato-a.mp4
│
├─ 3.2 ESTILO DE LEGENDAS
│   Font:   Bold sans-serif (Inter Bold ou Montserrat ExtraBold)
│   Cor:    Branco (#FFFFFF) com sombra preta
│   Posicao: Centralizado, ~15% do fundo
│   Tamanho: Grande (legivel em mobile)
│   Efeito:  Word-by-word highlight (opcional, estilo karaoke)
│
└─ 3.3 REVIEW FINAL
    Checklist:
    - [ ] Audio e video sincronizados
    - [ ] Legendas corretas e sem cortes
    - [ ] Transicoes suaves entre cenas
    - [ ] CTA card legivel
    - [ ] Duracao entre 45-60s
    - [ ] Exportado em 1080x1920 / 30fps / H.264

---

### FORMATO B — "Split-Screen Tutorial" (45-60s)

```
FASE 1: PRE-PRODUCAO (20min)
═══════════════════════════════════════════════════════
│
├─ 1.1 ROTEIRO
│   Input:  Tutorial/demonstracao a fazer
│   Output: Script com o que sera mostrado na tela + o que sera dito
│
├─ 1.2 GRAVACAO DE VOZ (Moroni)
│   Input:  Script de narracao
│   Output: audio-tutorial.mp3
│
└─ 1.3 SCREEN RECORDING
    Tool:   OBS Studio (gratis) ou QuickTime
    Specs:  1080x960 (metade superior do 1080x1920)
    Acao:   Gravar a demonstracao da ferramenta (ChatGPT, Claude, etc)
    Output: screen-recording.mp4

FASE 2: GERACAO DO AVATAR (30min)
═══════════════════════════════════════════════════════
│
├─ OPCAO A: HEYGEN AVATAR (recomendado para escala)
│   Input:  Script de narracao (texto)
│   Tool:   HeyGen API
│   Acao:   Avatar de Moroni fala o texto, gera video automatico
│   Output: avatar-moroni.mp4 (mesma duracao do audio)
│
└─ OPCAO B: MORONI GRAVA VIDEO REAL (mais autentico)
    Acao:   Moroni se filma falando, mesmo setup (mesa, iluminacao)
    Output: moroni-falando.mp4

FASE 3: COMPOSICAO (30min)
═══════════════════════════════════════════════════════
│
├─ 3.1 SPLIT-SCREEN NO CAPCUT
│   Layout:
│   ┌────────────────────┐
│   │                    │
│   │  SCREEN RECORDING  │  ← 50% superior
│   │  (1080 x 960)      │
│   │                    │
│   ├────────────────────┤
│   │                    │
│   │  MORONI / AVATAR   │  ← 50% inferior
│   │  (1080 x 960)      │
│   │                    │
│   │    legendas aqui    │
│   └────────────────────┘
│
├─ 3.2 SINCRONIZAR audio + tela + pessoa
│
├─ 3.3 ADICIONAR LEGENDAS (estilo identico ao Formato A)
│
├─ 3.4 CTA FINAL: substituir screen recording por card de evento
│
└─ 3.5 EXPORTAR 1080x1920 / 30fps / H.264
```

---

## 5. SETUP INICIAL — CHECKLIST PARA MORONI

### Assinaturas (fazer AGORA):

| # | Acao | Link | Custo | Tempo |
|---|------|------|-------|-------|
| 1 | Assinar **Kling AI Pro** | klingai.com | $66/mes | 5min |
| 2 | Assinar **HeyGen Creator** | heygen.com | $29/mes | 5min |
| 3 | Assinar **Midjourney Standard** | midjourney.com | $30/mes | 5min |
| 4 | Baixar + assinar **CapCut Pro** | capcut.com | $8/mes | 10min |
| 5 | Instalar **ffmpeg** | Terminal: `brew install ffmpeg` | $0 | 5min |

### APIs para me passar:

```
Apos assinar, me passe:

1. KLING_API_ACCESS_KEY=xxx
   KLING_API_SECRET_KEY=xxx
   (klingai.com → Settings → API Management → Create API Key)

2. HEYGEN_API_KEY=xxx
   (heygen.com → Settings → API Access → Generate API Key)
   
3. Midjourney: sem API oficial. Uso via:
   - Web app (midjourney.com/imagine) — voce ou eu geramos prompts
   - OU Discord bot — eu passo os prompts, voce roda
   - OU wrapper nao-oficial (goapi.ai, useapi.net) se quiser automatizar
```

### Gravacoes necessarias (UNICA VEZ):

```
PARA HEYGEN (avatar):
─────────────────────
Gravar video de 2 MINUTOS de voce falando:
- Olhando para a camera
- Gesticulando naturalmente  
- Boa iluminacao (mesmo setup do estudio)
- Audio limpo
- Roupa padrao (camiseta preta ou jaqueta preta)
- Upload em: heygen.com → Avatars → Create Instant Avatar

FOTOS PARA COMPOSITES (Kling):
──────────────────────────────
3-5 fotos profissionais de voce:
- Corpo inteiro, de frente, fundo neutro/escuro
- Meio corpo, de frente
- Sentado em mesa
- De pe gesticulando
- De costas (para cena tipo "command center")
Essas fotos serao usadas como input para Kling
gerar composites voce + cenario AI.
```

---

## 6. INTEGRACAO COM NOSSA STACK

### O que eu (Claude) posso fazer automaticamente:

| Etapa | Ferramenta | Automacao |
|-------|-----------|-----------|
| Roteiro + shot list | Agents (reels-scriptwriter) | 100% automatico |
| Prompts Midjourney | Claude gera prompts otimizados | 100% automatico |
| Imagens via Flux | Remotion `generate_image` | 100% automatico |
| Videos via Veo | Remotion `generate_video_from_text/image` | 100% automatico |
| Transcricao legendas | Remotion `generate_subtitles` (Whisper) | 100% automatico |
| Musica de fundo | Remotion `generate_music` | 100% automatico |
| Sound effects | Remotion `generate_sound_effect` | 100% automatico |

### O que precisa de acao manual:

| Etapa | Ferramenta | Por que manual |
|-------|-----------|---------------|
| Gravar voz | Moroni grava | Decisao: voz real, nao TTS |
| Videos Kling | Kling web/API | Precisa integrar API (ou usar web manualmente) |
| Avatar HeyGen | HeyGen web/API | Precisa integrar API (ou usar web manualmente) |
| Imagens Midjourney | Midjourney web/Discord | Sem API oficial |
| Edicao final | CapCut Pro | Composicao visual manual (melhor qualidade) |

### Integracao futura (apos validar manualmente):

Quando o fluxo manual estiver validado, podemos automatizar:
1. **Kling API** → MCP server custom para gerar clips direto do Claude
2. **HeyGen API** → MCP server custom para gerar avatar videos
3. **Midjourney wrapper** → API nao-oficial para gerar imagens
4. **ffmpeg scripts** → Composicao automatica (substitui CapCut)
5. Resultado: pipeline quase 100% automatica, so precisa de voz gravada

---

## 7. PRIMEIRO VIDEO TESTE — PLANO

### Objetivo: Produzir 1 video Formato A de 30-45s como prova de conceito

**Tema sugerido**: "Agentes de IA trabalhando para voce" (alinhado com agentesia)

**Shot list (10 cenas):**

| # | Seg | Descricao Visual | Narracao (aprox) |
|---|-----|-----------------|------------------|
| 1 | 0-3s | Moroni de jaqueta preta, cenario escuro tech, energia nas maos | "Imagina ter um time inteiro..." |
| 2 | 3-5s | Exercito de robos AI em formacao | "...de agentes de IA..." |
| 3 | 5-8s | Robo 3D trabalhando em dashboard com graficos subindo | "...trabalhando 24 horas por dia..." |
| 4 | 8-11s | Notificacoes de vendas/Pix chovendo | "...gerando resultados..." |
| 5 | 11-14s | Command center: pessoa sentada, robos em telas | "...enquanto voce foca no estrategico." |
| 6 | 14-17s | Robo atendendo clientes em chat | "Um fazendo vendas, outro atendendo..." |
| 7 | 17-20s | Diagrama de rede de agentes conectados | "...um time completo de agentes." |
| 8 | 20-23s | Pessoa assistindo aula no laptop (cena AI) | "E voce pode aprender a construir isso." |
| 9 | 23-28s | Moroni no galpao com exercito de robos | "Vem comigo no dia [data]." |
| 10 | 28-33s | Card CTA com data/link | "Comenta AGENTE." |

**Assets necessarios:**
- 10 imagens Midjourney/Flux (9:16)
- 10 clips Kling (5s cada)
- 1-2 composites Moroni+cenario
- 1 card CTA (Canva)
- 1 audio gravado (~33s)
- 1 SRT de legendas

---

## 8. CRONOGRAMA

| Dia | Acao | Responsavel |
|-----|------|-------------|
| **Dia 0** | Assinar ferramentas + instalar ffmpeg | Moroni |
| **Dia 0** | Passar API keys | Moroni → Claude |
| **Dia 0** | Gravar video 2min para HeyGen avatar | Moroni |
| **Dia 0** | Tirar 5 fotos para composites Kling | Moroni |
| **Dia 1** | Gerar roteiro + shot list do video teste | Claude |
| **Dia 1** | Moroni grava audio de narracao (33s) | Moroni |
| **Dia 1** | Gerar 10-15 imagens (Midjourney + Flux) | Claude + Moroni |
| **Dia 2** | Gerar 10 clips AI (Kling + Veo) | Claude/Moroni via Kling |
| **Dia 2** | Gerar composites pessoa+cenario | Kling/HeyGen |
| **Dia 2** | Transcrever audio → legendas SRT | Claude (Whisper) |
| **Dia 3** | Montar video final no CapCut | Moroni (com guia do Claude) |
| **Dia 3** | Review + ajustes | Moroni + Claude |
| **Dia 3** | Video teste pronto | ENTREGA |

**Apos validacao do teste**: escalar para 3-4 videos/semana nos 2 formatos.
