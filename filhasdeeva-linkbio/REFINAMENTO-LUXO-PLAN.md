# Plano de Refinamento de Design — Filhas de Eva Link-in-Bio
## Análise de Referências + Direção Artística de Luxo

---

## 1. MATERIAIS ANALISADOS

### Pinterest (57 referências, 3 boards):
- **academy** (20+ imgs): Estilo country club, tênis/esporte chic, old money, Dior sportswear
- **arteva** (20+ imgs): Porcelana azul/branca chinoiserie, gold leaf, selos de cera, texturas líquidas
- **my-colors** (20+ imgs): Paleta pessoal da Priscilla — **deep navy (#121A23, #1C364D)**, creme (#ECECE9), burgundy veludo, gold foil, deep teal (Pantone 2026: 19-4914 TCX)

### Downloads/pri (material da marca):
- **Identidade Visual FE-v2.pdf** — brandbook oficial (precisa poppler para renderizar)
- **Rainha Magnética Completo.pdf** — material do produto principal
- **Apresentação / Posicionamento Real** — PDFs de apresentação (~103MB)
- **COPY #2, #4, #5** — criativos (estátuas com coroa gold, fundo preto, tipografia script)
- **WhatsApp prints** — posts antigos com coroa teal/cyan, pinceladas, P&B + cor seletiva
- **"21 Segredo's de Eva"** — capa de e-book (rosa/pink, dupla exposição, cristais)
- **"Chá de Rainhas"** — evento (estilo editorial, jornal, P&B + gold leaf, óculos, café)

### Fotos profissionais (7 IMGs + 10 WhatsApp):
- Ensaio profissional premium: vestido vermelho arquitetural, orquídeas brancas, espelho vintage dourado/prata, blazer branco cidade
- Ensaio lifestyle: vestido nude champagne, taça de vinho, jardim, livro Chanel, laptop MacBook
- Qualidade: editorial de revista — iluminação natural, composição forte, jóias douradas

### Observações do conteúdo existente:
- **Marca antiga**: usava teal/cyan (#00D4AA) como cor de acento — coroa teal, pinceladas, neon
- **Marca atual (edens.academy)**: migrou para gold/dourado como acento universal
- **Elementos recorrentes**: coroas, espelhos, cristais, orquídeas, selos de cera, P&B com cor seletiva
- **Logo**: "FILHAS DE EVA" com asa/folha estilizada + "Priscilla Andrade" em script

---

## 2. DIREÇÃO DO REFINAMENTO

### De → Para:
| Aspecto | Atual (v3) | Refinamento Luxo |
|---------|-----------|-----------------|
| Background | Creme genérico (#F7F4EE) | **Ivory warm** (#FAF8F3) com textura sutil de linho |
| Gold | #D4AF37 (gold puro, masculino) | **#C5A55A** blend com rose gold — mais feminino |
| Tipografia títulos | Cinzel (angular, frio) | **Cormorant Garamond** 600 (clássico, feminino, luxo) |
| Cards | Bordas finas retas | **Bordas suaves + sombra ambiente** quente |
| Seções | Divisores retos | **Ornamentos decorativos** sutis (linhas com curva, folha estilizada) |
| Hover effects | Scale + shadow simples | **Glow dourado** suave + lift |
| Hero | Foto com gradiente opaco | **Parallax sutil** + máscara em forma orgânica |
| Avatar | Borda dourada simples | **Dupla borda** com espaço + animação glow pulse |
| Stat cards | Float genérico | **Glassmorphism** com backdrop-blur + borda gold |
| CTA | Gradiente gold flat | **Gradiente gold com shimmer animado** (keyframes) |
| Scrollbar | Gold fino | **Oculta** — scroll nativo ou custom ultra-slim |
| Footer | Simples | **Selo de cera** decorativo + linhas ornamentais |

### Paleta Refinada (baseada em my-colors + material da marca):

```
CORES PRIMÁRIAS:
  --ivory:        #FAF8F3    (background — mais quente que F7F4EE)
  --charcoal:     #1A1714    (manter — texto principal)
  --gold:         #C5A55A    (mais suave, rose-gold direction)
  --gold-dark:    #A08535    (contraste)
  --gold-glow:    rgba(197,165,90,.15)  (ambient glow)

CORES DE ACENTO (por produto):
  --emerald:      #1B5E4F    (Eden's Club — manter)
  --navy:         #121A23    (Mentoria — do my-colors, mais profundo)
  --teal:         #1C364D    (accent alternativo — do my-colors)
  --lilac:        #C8A2D0    (Rainha Magnética — manter)
  --burgundy:     #5A1A2A    (Palestras — manter)

NEUTROS:
  --cream:        #ECECE9    (do my-colors — para cards)
  --muted:        #9A9088    (texto secundário)
  --card:         #FFFFFF    (manter)
```

### Tipografia Refinada:

```
DISPLAY (títulos):
  Cormorant Garamond 600/700 — clássico, feminino, editorial
  Letter-spacing: 0.04em | Text-transform: uppercase em eyebrows

SERIF (subtítulos, quotes):
  Cormorant Garamond 400 italic — elegante, como revista de moda

SANS-SERIF (corpo, botões):
  DM Sans 400/500/600 — manter (clean, moderno)
```

---

## 3. FASES DO REFINAMENTO

### FASE 1 — Design System Foundation
- [ ] Atualizar CSS custom properties (paleta, tipografia, sombras)
- [ ] Adicionar textura de linho sutil no body background (CSS pattern ou SVG)
- [ ] Trocar Cinzel → Cormorant Garamond em todos os títulos
- [ ] Atualizar gold para #C5A55A (mais feminino)
- [ ] Ajustar shadows para warmth (tons dourados, não cinza)
- [ ] Adicionar `::selection` dourado para texto selecionado

### FASE 2 — Hero & Avatar Premium
- [ ] Hero: adicionar vignette mais sutil, gradiente orgânico (não linear reto)
- [ ] Avatar: dupla borda com gap + glow pulse animação CSS
- [ ] Hero scroll indicator: refinar com animação mais suave
- [ ] Adicionar loading screen sutil (fade-in do conteúdo)

### FASE 3 — Cards & Sections Elevation
- [ ] Product carousel: bordas mais suaves, sombra ambiente dourada
- [ ] Abordagem cards: adicionar hover glow dourado
- [ ] Eco cards: refinar com gradientes mais sutis
- [ ] Stat cards: glassmorphism (backdrop-blur + border gold)
- [ ] Midia cards e yt-cards: refinar hover para glow

### FASE 4 — Ornamentos & Detalhes
- [ ] Divisores de seção: adicionar ornamento decorativo sutil (SVG: folha/curva)
- [ ] Section eyebrows: refinar letter-spacing e peso
- [ ] Footer: adicionar selo de cera SVG decorativo
- [ ] Ticker: refinar com tipografia mais elegante
- [ ] Scrollbar: ultra-slim ou oculta

### FASE 5 — Animações Premium
- [ ] CTA shimmer effect (gradient sweep animation)
- [ ] Reveal animations: ease mais orgânico (cubic-bezier refinado)
- [ ] Hover states: transições mais lentas e suaves (400ms+)
- [ ] Gallery: scroll mais organic
- [ ] Links: underline animation on hover (left-to-right reveal)

### FASE 6 — Polish Final
- [ ] Favicon com a marca Filhas de Eva
- [ ] Touch states refinados (feedback sutil no mobile)
- [ ] Performance: lazy loading agressivo, font-display swap
- [ ] Meta tags finais com foto real
- [ ] `prefers-reduced-motion` respeitado

---

## 4. MOOD KEYWORDS

**Palavras que guiam CADA decisão visual:**
- Quiet luxury (não ostentação)
- Editorial de moda (não SaaS)
- Old money (não nouveau riche)
- Porcelana e ouro (não neon)
- Chanel, Dior, Tom Ford (não Forever 21)
- Sussurro que impõe (não grito)

**Anti-patterns (PROIBIDO):**
- Neon/cyan/teal como acento (marca antiga — superada)
- Gradientes rainbow ou multicolor
- Sombras cinza frias
- Bordas duras sem radius
- Tipografia geométrica/tech
- Emojis ou ícones coloridos

---

## 5. REFERÊNCIAS VISUAIS CRUZADAS

| Elemento | Referência | Fonte |
|---------|-----------|-------|
| Paleta navy + cream | my-colors-015 (moodboard #121A23 + #ECECE9) | Pinterest |
| Gold foil / selo de cera | my-colors-007 (envelopes burgundy + gold) | Pinterest |
| Textura líquida/silk | arteva-040 (água/cristal líquido) | Pinterest |
| Deep teal accent | academy-050 (Pantone 2026 Deep Teal) | Pinterest |
| Porcelana + gold | arteva-038 (tubo porcelana chinoiserie) | Pinterest |
| Country club chic | academy-043 (tênis branco, elegante) | Pinterest |
| Foto power pose | pri-vermelho-poste.jpg | Ensaio profissional |
| Foto lifestyle luxo | pri-laptop.jpg (Chanel book) | Ensaio profissional |
| Foto editorial | pri-orquidea-cidade.jpg | Ensaio profissional |
| Coroa/rainha motif | COPY #2 (estátua + coroa gold) | Material da marca |
| P&B + cor seletiva | WhatsApp prints (coroa teal sobre P&B) | Posts antigos |
| Editorial jornal | "Chá de Rainhas" (newspaper background) | Material da marca |

---

## PRÓXIMOS PASSOS

**Aguardando aprovação do Moroni para iniciar a Fase 1.**

Perguntas antes de executar:
1. Quer manter o gold atual (#D4AF37) ou migrar para rose-gold (#C5A55A)?
2. O teal/cyan antigo da marca deve ser 100% eliminado ou pode aparecer pontualmente?
3. As fases devem ser executadas sequencialmente com preview ou tudo de uma vez?
