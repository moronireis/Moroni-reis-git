# Design System — Filhas de Eva Link-in-Bio
## Baseado na Identidade Visual Oficial + Referências

---

## FONTES DE VERDADE ANALISADAS

| Fonte | O que contém | Status |
|-------|-------------|--------|
| Identidade Visual FE-v2.pdf (7pg) | Brandbook oficial "A Revolução da Imagem" | ✅ Analisado |
| Rainha Magnética Completo.pdf (15pg) | Guia do produto principal | ✅ Analisado |
| Apresentação.pdf (16pg) | Deck "Grupo EDEN" — produtos, preços | ✅ Analisado |
| Posicionamento Real (97pg) | Imersão presencial — estética celestial | ✅ Analisado |
| Pinterest 57 refs (3 boards) | academy, arteva, my-colors | ✅ Analisado |
| Google Drive (15 pastas) | Fotos editadas, Dubai, Cidade Jardim, Palestras, Lifestyle | ✅ Catalogado |
| 10 fotos profissionais | Ensaio premium (vermelho, orquídea, espelho, laptop) | ✅ No assets/ |
| Instagram @filhasdeeva | 980K seguidores, feed + Reels extraídos | ✅ Analisado |
| edens.academy/bio | Página bio atual dela | ✅ Analisado |

---

## 1. PALETA DE CORES (Oficial do Brandbook)

### Primária — "Royal Rose Princess"
| Swatch | Hex | Uso |
|--------|-----|-----|
| ▓ | `#F0ECE9` | Background principal (ivory) |
| ▓ | `#F4E7DF` | Background alternativo (nude warm) |
| ▓ | `#E1CFCF` | Dusty rose light (cards hover, pills) |
| ▓ | `#DCB4B4` | Dusty rose (accent, borders, selection) |
| ▓ | `#A57080` | Mauve (eyebrows, labels, secondary CTA) |
| ▓ | `#88636E` | Deep rose (strong accent, hover) |

### Complementar — "Royal Tea Green"
| Swatch | Hex | Uso |
|--------|-----|-----|
| ▓ | `#C4BCBA` | Warm gray (muted text alt) |
| ▓ | `#ADBEBE` | Sage (subtle accents) |
| ▓ | `#7E8B8C` | Slate (secondary text, muted) |
| ▓ | `#546063` | Dark teal (emphasis) |
| ▓ | `#303F3F` | Deep forest (dark sections) |
| ▓ | `#1E2C2E` | Darkest (text, dark mode bg) |

### Gold — SOMENTE como acento
| Swatch | Hex | Uso |
|--------|-----|-----|
| ▓ | `#DCB4B4` | Rose-gold (do primary — preferido) |
| ▓ | `#C5A55A` | Gold clássico (script, bordas finas, ícones) |
| ▓ | `#A08535` | Gold escuro (hover, contraste) |

### Por Produto
| Produto | Cor dominante | Background |
|---------|--------------|------------|
| Rainha Magnética | Gold borders | Deep purple/navy `#3A2856` |
| Eden's Club | Gold text | Forest green `#1E3A2A` |
| Mentoria | Navy text | Cream/ivory |
| Palestras | Gold accents | Black/charcoal |
| Posicionamento Real | Gold script | Celestial blue `#B8D4E8` |

---

## 2. TIPOGRAFIA

### Da Identidade Visual:
- **"A REVOLUÇÃO"** — Serif uppercase, bold, letter-spacing amplo
- **"Imagem"** — Script cursivo/handwritten, gold
- **"PRISCILLA ANDRADE"** — Sans-serif, ultra-light, letter-spacing 0.3em

### Para o Link-in-Bio:
```
--font-display:  'Cormorant Garamond', serif
  Pesos: 400, 500, 600, 700, 400i, 600i
  Uso: TODOS os títulos (sec-title), quotes, nome
  Estilo: Uppercase + letter-spacing 0.06em para títulos
          Italic para quotes e taglines

--font-sans:  'DM Sans', sans-serif
  Pesos: 300, 400, 500, 600
  Uso: Corpo, botões, labels, eyebrows, descrições
  Estilo: 400 para corpo, 600 para botões, 300 para muted
```

### Hierarquia:
| Nível | Fonte | Peso | Tamanho | Tracking | Transform |
|-------|-------|------|---------|----------|-----------|
| H1 (hero name) | Cormorant | 700 | clamp(2.2rem,11vw,3.8rem) | 0.12em | uppercase |
| H2 (sec-title) | Cormorant | 600 | clamp(2rem,8vw,2.8rem) | 0.06em | none |
| Eyebrow | DM Sans | 600 | 0.6rem | 0.25em | uppercase |
| Body | DM Sans | 400 | 0.82rem | normal | none |
| Quote | Cormorant | 400i | clamp(1.2rem,5vw,1.6rem) | 0.02em | none |
| Button | DM Sans | 600 | 0.6rem | 0.15em | uppercase |
| Pill/Badge | DM Sans | 700 | 0.5rem | 0.15em | uppercase |

---

## 3. SOMBRAS & ELEVAÇÃO

### Derivadas do brandbook (soft, warm):
```css
--shadow-card:    0 2px 16px rgba(136,99,110,.06);
--shadow-hover:   0 8px 32px rgba(136,99,110,.12);
--shadow-glow:    0 0 24px rgba(220,180,180,.15);
--shadow-gold:    0 4px 20px rgba(197,165,90,.12);
```

### Regra: sombras SEMPRE em tom rose/warm, NUNCA cinza frio.

---

## 4. BORDAS & RADIUS

```css
--radius-card:    1.25rem (20px)
--radius-btn:     0.75rem (12px)
--radius-pill:    999px
--radius-avatar:  50%

--border-default: 1px solid rgba(220,180,180,.15)
--border-hover:   1px solid rgba(220,180,180,.4)
--border-gold:    1px solid rgba(197,165,90,.25)
```

---

## 5. ANIMAÇÕES & TRANSIÇÕES

### Easing:
```css
--ease:           cubic-bezier(0.16, 1, 0.3, 1)  /* de-emphasize start, smooth land */
--ease-gentle:    cubic-bezier(0.25, 0.46, 0.45, 0.94)  /* for subtle movements */
```

### Durations:
- Hover: 350ms (mais lento = mais luxo)
- Reveal on scroll: 650ms
- Card lift: translateY(-2px) — sutil, não exagerado
- CTA shimmer: 3s linear infinite
- Stat float: 6s ease-in-out infinite
- Gallery scroll: 18s linear infinite

### Efeitos especiais:
- `::selection` → `background: #DCB4B4; color: #1E2C2E`
- Scrollbar thumb → `#DCB4B4`
- Hero gradient → rose-tinted, não preto puro

---

## 6. MOODBOARD KEYWORDS

Do brandbook oficial (pág 5):
- **Esculturas renascentistas** em mármore
- **Kintsugi** — ouro reparando rachaduras (metáfora: beleza nas imperfeições)
- **Lábios dourados** — gold leaf como accent
- **Tecido drapeado** — textura, fluidez, feminilidade
- **Oceano/teal** — profundidade, calma

Do Pinterest (my-colors):
- **Deep navy** (#121A23) como tom de poder
- **Envelopes burgundy veludo** com selo de cera gold
- **Textura líquida/silk** prateada

Do Pinterest (academy):
- **Country club chic** — tênis branco, linho
- **Old money** — quiet luxury, sem ostentação

Do Pinterest (arteva):
- **Porcelana chinoiserie** — azul + branco + gold
- **Deep teal** (Pantone 2026 19-4914) como accent moderno

---

## 7. ANTI-PATTERNS (PROIBIDO)

- ❌ Gold masculino (#D4AF37) como cor dominante — gold é ACENTO
- ❌ Neon/cyan/teal vibrante (marca antiga)
- ❌ Sombras cinza frias (usar rose/warm)
- ❌ Tipografia geométrica/tech (usar serif editorial)
- ❌ Emojis ou ícones coloridos
- ❌ Gradientes rainbow
- ❌ Bordas duras sem radius
- ❌ Cards com fundo gold sólido (gold só em bordas/texto)

---

## 8. ASSETS DISPONÍVEIS

### Fotos profissionais (em assets/):
| Arquivo | Descrição | Uso ideal |
|---------|-----------|-----------|
| pri-orquidea-cidade.jpg | Branco + orquídea + cidade | Hero |
| pri-closeup-gold.jpg | Closeup dourado, jewelry | Avatar |
| pri-vermelho-sorrindo.jpg | Vermelho + sorriso + arquitetura | Galeria, CTA |
| pri-vermelho-poste.jpg | Vermelho + poder + pilar | Galeria |
| pri-espelho-gold.jpg | Gold dress + espelho vintage | Galeria, Sobre |
| pri-espelho-branco.jpg | Branco + espelho gold | Galeria |
| pri-espelho-prata.jpg | Branco + espelho prata + orquídea | Trajetória |
| pri-orquidea-perfil.jpg | Blazer + orquídea + olhos fechados | Galeria |
| pri-laptop.jpg | Laptop + Chanel + profissional | Galeria, Eco |
| pri-4poses.jpg | 4 poses beige + jardim | Galeria |

### Google Drive (disponível para download):
- **EDITADAS P/ BANNERS** — 20+ fotos profissionais editadas para banners (7-10MB cada)
- **Cidade Jardim Jl** — 3 fotos editadas com filtro Tezza (Paradiso preset)
- **DUBAI Fotos/Vídeos** — Fotos e vídeo editado de Dubai
- **Fotos e vídeos lifestyle** — 20+ vídeos MOV lifestyle (25-290MB)
- **Palestra Ceará** — Fotos de palestra
- **Fotos Eventos Portugal** — Fotos de eventos em Portugal
- **Algarve** — Fotos de Algarve

---

## 9. CSS CUSTOM PROPERTIES (prontas para implementar)

```css
:root {
    /* ── Royal Rose Princess (official primary) ── */
    --ivory:          #F0ECE9;
    --nude:           #F4E7DF;
    --dusty-rose-lt:  #E1CFCF;
    --dusty-rose:     #DCB4B4;
    --mauve:          #A57080;
    --deep-rose:      #88636E;

    /* ── Royal Tea Green (official complementary) ── */
    --warm-gray:      #C4BCBA;
    --sage:           #ADBEBE;
    --slate:          #7E8B8C;
    --dark-teal:      #546063;
    --forest:         #303F3F;
    --deepest:        #1E2C2E;

    /* ── Gold (accent ONLY — script, borders, icons) ── */
    --gold:           #C5A55A;
    --gold-dark:      #A08535;
    --rose-gold:      #DCB4B4;

    /* ── Functional mappings ── */
    --bg:             var(--ivory);
    --bg-alt:         var(--nude);
    --dark:           var(--deepest);
    --muted:          var(--slate);
    --card:           #FFFFFF;
    --accent:         var(--mauve);
    --accent-light:   var(--dusty-rose);

    /* ── Typography ── */
    --font-display:   'Cormorant Garamond', 'Georgia', serif;
    --font-sans:      'DM Sans', system-ui, sans-serif;

    /* ── Motion ── */
    --ease:           cubic-bezier(0.16, 1, 0.3, 1);
    --ease-gentle:    cubic-bezier(0.25, 0.46, 0.45, 0.94);

    /* ── Shadows (always warm-tinted) ── */
    --shadow-card:    0 2px 16px rgba(136,99,110,.06);
    --shadow-hover:   0 8px 32px rgba(136,99,110,.12);
    --shadow-glow:    0 0 24px rgba(220,180,180,.15);

    /* ── Borders ── */
    --border:         1px solid rgba(220,180,180,.15);
    --border-hover:   1px solid rgba(220,180,180,.4);
}
```
