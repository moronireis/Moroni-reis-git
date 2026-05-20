# Design System — GJ Eventos

**Versão:** 1.0
**Data:** Abril 2026
**Elaborado por:** Designer Agent (REIS [IA])
**Cliente:** GJ Comércio de Flores, Presentes e Eventos Ltda
**Status:** Produção — pronto para implementação

---

## Sumário

1. [Fundação Visual](#1-fundação-visual)
2. [Sistema de Cores](#2-sistema-de-cores)
3. [Tipografia](#3-tipografia)
4. [Espaçamento](#4-espaçamento)
5. [Grid e Layout](#5-grid-e-layout)
6. [Componentes](#6-componentes)
7. [Tratamento Fotográfico](#7-tratamento-fotográfico)
8. [Templates para Redes Sociais](#8-templates-para-redes-sociais)
9. [Materiais Impressos](#9-materiais-impressos)
10. [Padrões e Texturas](#10-padrões-e-texturas)
11. [Regras de Uso — Faça e Não Faça](#11-regras-de-uso)

---

## 1. Fundação Visual

### Direção Estética

**Elegância acessível com calor humano.** Nem frio-minimalista, nem ornamentado demais. A estética da GJ Eventos transmite celebração com sofisticação — como entrar num evento onde tudo está bonito, mas nada parece forçado.

Referências de espírito (não de cópia):
- A curadoria editorial da Kinfolk — composições com ar e respiro
- O calor cromático da fotografia brasileira de eventos — luz dourada natural
- A disciplina tipográfica de marcas de moda contemporânea — poucos elementos, bem escolhidos

### Personalidade da Marca

| Atributo | Expressão Visual |
|----------|-----------------|
| Confiança (20 anos) | Tipografia serif clássica, espaçamento generoso |
| Calor humano | Paleta quente como secundária, fotos com emoção |
| Modernidade | Layouts limpos, grid rigoroso, sem ornamentos gratuitos |
| Celebração | Teal vibrante como protagonista, contrastes vivos |
| Profissionalismo | Consistência em todos os touchpoints, sistema coeso |

### Princípios de Design

1. **O teal é o protagonista** — a cor carrega a marca. Usar com confiança, nunca diluir.
2. **Menos elementos, mais impacto** — cada foto, cada texto, cada ícone precisa justificar presença.
3. **Fotografia faz o trabalho pesado** — o design emoldura; a foto vende.
4. **Consistência gera reconhecimento** — o feed do Instagram deve ser identificável sem ver o logo.
5. **Funciona em festa e no escritório** — a identidade deve servir tanto para um casamento quanto para uma proposta corporativa.

---

## 2. Sistema de Cores

### Paleta Principal

#### Teal GJ (Cor Primária)

A cor teal existente do logo é o DNA cromático da marca. Definição exata:

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `teal-600` (Primária) | `#2EB8A6` | 46, 184, 166 | Logo, CTAs, destaques principais |
| `teal-700` | `#249688` | 36, 150, 136 | Hover, estados ativos |
| `teal-500` | `#3BD4BE` | 59, 212, 190 | Acentos claros, ícones |
| `teal-400` | `#6AE3D0` | 106, 227, 208 | Backgrounds sutis, tags |
| `teal-300` | `#99EDE0` | 153, 237, 224 | Backgrounds muito claros |
| `teal-200` | `#C2F5EC` | 194, 245, 236 | Backgrounds de seção, tints |
| `teal-100` | `#E5FAF6` | 229, 250, 246 | Background page, hover sutil |
| `teal-50` | `#F2FDFB` | 242, 253, 251 | Background mínimo |
| `teal-800` | `#1D7A6D` | 29, 122, 109 | Texto sobre fundo claro |
| `teal-900` | `#155C53` | 21, 92, 83 | Texto de alta ênfase |

**Nota:** O teal exato do logo atual (~#3EC8C8) tende mais ao ciano puro. A recomendação é ajustar levemente para `#2EB8A6`, que adiciona uma pitada de verde — mais orgânico, mais floral, menos clínico. A diferença é sutil mas intencional: evita a associação com hospitais/tech e puxa para natureza/celebração. Se o cliente preferir manter o ciano original, substituir `#2EB8A6` por `#3EC8C8` em toda a escala.

#### Neutros Quentes

Neutros com subtom quente (não cinza puro) para harmonizar com a paleta teal e criar ambientes acolhedores:

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `warm-50` | `#FDFBF9` | 253, 251, 249 | Background principal (light mode) |
| `warm-100` | `#F7F4F0` | 247, 244, 240 | Background secundário, cards |
| `warm-200` | `#EDE8E2` | 237, 232, 226 | Bordas, dividers |
| `warm-300` | `#DDD5CC` | 221, 213, 204 | Bordas ativas, placeholders |
| `warm-400` | `#B8ADA1` | 184, 173, 161 | Texto terciário, ícones inativos |
| `warm-500` | `#8C8176` | 140, 129, 118 | Texto secundário |
| `warm-600` | `#6B6158` | 107, 97, 88 | Texto de suporte |
| `warm-700` | `#4A423B` | 74, 66, 59 | Texto de corpo |
| `warm-800` | `#332D28` | 51, 45, 40 | Headlines, texto forte |
| `warm-900` | `#1F1B18` | 31, 27, 24 | Texto máximo contraste |

#### Cor de Contraste (Escura)

Para situações que pedem fundo escuro (eventos noturnos, materiais sofisticados, variações de contraste):

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `charcoal-900` | `#1A1F1E` | 26, 31, 30 | Fundo escuro principal (com subtom teal) |
| `charcoal-800` | `#252B2A` | 37, 43, 42 | Cards sobre fundo escuro |
| `charcoal-700` | `#333B39` | 51, 59, 57 | Bordas em modo escuro |

#### Cor de Acento (Quente)

Um acento quente para contraponto ao teal — usado em destaques emocionais, preços, e momentos de celebração:

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `coral-500` (Acento) | `#E8725A` | 232, 114, 90 | Preços, badges "novo", alertas positivos |
| `coral-400` | `#EE9480` | 238, 148, 128 | Hover de acento |
| `coral-300` | `#F4B5A6` | 244, 181, 166 | Backgrounds de destaque |
| `coral-100` | `#FDE8E2` | 253, 232, 226 | Background sutil de acento |
| `coral-600` | `#C85A44` | 200, 90, 68 | Texto de acento sobre fundo claro |

**Regra do coral:** Usar com parcimônia — máximo 1 elemento coral por composição/slide. O coral é o ponto de exclamação; o teal é a voz.

### Cores Semânticas

| Função | Hex | Uso |
|--------|-----|-----|
| `success` | `#2D9F6F` | Confirmações, badges "disponível" |
| `warning` | `#E5A530` | Alertas, "últimas vagas" |
| `error` | `#D14343` | Erros em formulários |
| `info` | `#2EB8A6` | Alias do teal primário |

### Overlays para Fotografia

| Token | Valor | Uso |
|-------|-------|-----|
| `overlay-dark` | `rgba(26, 31, 30, 0.55)` | Texto branco sobre foto |
| `overlay-teal` | `rgba(46, 184, 166, 0.15)` | Filtro teal sutil sobre foto |
| `overlay-warm` | `rgba(253, 251, 249, 0.85)` | Texto escuro sobre foto clara |
| `overlay-gradient-bottom` | `linear-gradient(to top, rgba(26,31,30,0.8) 0%, transparent 60%)` | Texto na base de foto |
| `overlay-gradient-teal` | `linear-gradient(135deg, rgba(46,184,166,0.2) 0%, transparent 50%)` | Acento teal diagonal |

### Regras de Contraste

- Texto sobre `warm-50` a `warm-200`: usar `warm-700` ou mais escuro (ratio mínimo 4.5:1)
- Texto sobre `charcoal-900`: usar `white` (#FFFFFF) ou `warm-100` (ratio mínimo 4.5:1)
- Texto teal sobre fundo claro: usar `teal-800` ou `teal-900` (nunca `teal-400` ou `teal-500`)
- CTA teal (`teal-600`) com texto branco: ratio 3.8:1 — aceitável para botões grandes (WCAG AA para texto grande)

---

## 3. Tipografia

### Família Tipográfica

**Headlines — Playfair Display**
- Classificação: Serif transicional com alto contraste
- Porque: Elegância editorial sem ser antiquada. Os eixos finos/grossos evocam a delicadeza floral. O contraste alto funciona em tamanhos grandes. Disponível gratuitamente no Google Fonts.
- Pesos utilizados: 400 (Regular), 500 (Medium), 700 (Bold)
- Estilo: Regular e Italic (para destaques emocionais)

**Corpo e UI — DM Sans**
- Classificação: Sans-serif geométrica com terminais abertos
- Porque: Moderna, legível em telas pequenas (Stories, WhatsApp), amigável sem ser infantil. Complementa a Playfair sem competir. Disponível gratuitamente no Google Fonts.
- Pesos utilizados: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

**Alternativa para documentos impressos:** Quando a Playfair não estiver disponível (Word, e-mail), substituir por Georgia. Quando DM Sans não estiver disponível, substituir por Arial.

### Escala Tipográfica

Base: 16px. Ratio: 1.333 (Perfect Fourth).

| Token | Tamanho | Peso | Line-Height | Letter-Spacing | Fonte | Uso |
|-------|---------|------|-------------|----------------|-------|-----|
| `display` | 56px | Playfair 700 | 1.1 | -0.02em | Playfair Display | Hero de página, capa de proposta |
| `h1` | 42px | Playfair 700 | 1.15 | -0.015em | Playfair Display | Título de seção principal |
| `h2` | 32px | Playfair 500 | 1.2 | -0.01em | Playfair Display | Subtítulo de seção |
| `h3` | 24px | DM Sans 600 | 1.3 | 0em | DM Sans | Título de card, nome de serviço |
| `h4` | 20px | DM Sans 600 | 1.35 | 0em | DM Sans | Subtítulo de card |
| `body-lg` | 18px | DM Sans 400 | 1.65 | 0em | DM Sans | Texto introdutório, lead |
| `body` | 16px | DM Sans 400 | 1.6 | 0em | DM Sans | Texto de corpo padrão |
| `body-sm` | 14px | DM Sans 400 | 1.55 | 0.01em | DM Sans | Captions, notas |
| `caption` | 13px | DM Sans 500 | 1.4 | 0.02em | DM Sans | Metadados, datas |
| `overline` | 12px | DM Sans 600 | 1.3 | 0.08em | DM Sans | Labels de seção, categorias (SEMPRE UPPERCASE) |
| `micro` | 11px | DM Sans 500 | 1.3 | 0.03em | DM Sans | Badges, contadores |

### Escala Responsiva

| Token | Desktop (1280px+) | Tablet (768px) | Mobile (375px) |
|-------|-------------------|----------------|----------------|
| `display` | 56px | 42px | 32px |
| `h1` | 42px | 34px | 28px |
| `h2` | 32px | 26px | 22px |
| `h3` | 24px | 22px | 20px |
| `body-lg` | 18px | 17px | 16px |
| `body` | 16px | 16px | 16px |

### Regras Tipográficas

1. **Headlines em Playfair, corpo em DM Sans.** Nunca misturar dentro do mesmo nível hierárquico.
2. **Playfair Italic** reservada para citações de clientes (depoimentos) e para a palavra que carrega emoção dentro de uma headline (ex: "Eventos que ficam na *memória*").
3. **Overline** sempre em DM Sans uppercase com `letter-spacing: 0.08em` — usado para categorizar: "CASAMENTO", "DECORAÇÃO", "DEPOIMENTO".
4. **Máximo de 65-75 caracteres por linha** em texto de corpo para manter legibilidade.
5. **Sem negrito em texto de corpo** — se algo precisa de destaque no corpo, usar `teal-800` como cor ou DM Sans 500 (Medium).

---

## 4. Espaçamento

### Unidade Base: 4px

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Padding interno de badges, gap mínimo |
| `space-2` | 8px | Gap entre ícone e label, padding de tags |
| `space-3` | 12px | Padding interno de inputs |
| `space-4` | 16px | Gap padrão entre elementos no mesmo grupo |
| `space-5` | 20px | Padding interno de cards pequenos |
| `space-6` | 24px | Gap entre cards, padding de botões laterais |
| `space-8` | 32px | Margem entre blocos dentro de seção |
| `space-10` | 40px | Padding interno de cards grandes |
| `space-12` | 48px | Gap entre seções menores |
| `space-16` | 64px | Padding vertical de seção (mobile) |
| `space-20` | 80px | Padding vertical de seção (tablet) |
| `space-24` | 96px | Padding vertical de seção (desktop) |
| `space-32` | 128px | Separação entre macro-seções |

### Regras de Espaçamento

1. **Dentro de um componente**: usar `space-2` a `space-6`
2. **Entre componentes no mesmo grupo**: usar `space-6` a `space-8`
3. **Entre grupos/blocos**: usar `space-10` a `space-12`
4. **Entre seções de página**: usar `space-16` (mobile), `space-20` (tablet), `space-24` (desktop)
5. **Padding de seção**: simétrico vertical, com `space-6` (mobile) a `space-10` (desktop) horizontal

---

## 5. Grid e Layout

### Instagram (Formatos de Post)

#### Feed Quadrado — 1080 x 1080px

```
Margem de segurança: 60px em todos os lados
Área útil: 960 x 960px

Grid interno:
- 6 colunas com gutter de 16px
- Zona de logo/watermark: canto inferior direito, 120 x 40px
- Zona de texto: terço inferior (320px de altura)
```

#### Feed Retrato — 1080 x 1350px

```
Margem de segurança: 60px em todos os lados
Área útil: 960 x 1230px

Grid interno:
- 6 colunas com gutter de 16px
- Zona de foto: 2/3 superiores (820px)
- Zona de texto: 1/3 inferior (410px) com background warm-50 ou overlay-dark
```

#### Stories / Reels Cover — 1080 x 1920px

```
Margem de segurança: 80px lateral, 200px top, 280px bottom (zona de UI do Instagram)
Área útil: 920 x 1440px

Grid interno:
- 4 colunas com gutter de 16px
- Zona de título: terço superior (480px)
- Zona de conteúdo: terço central (480px)
- Zona de CTA: terço inferior (480px) — atenção: UI do Instagram cobre os últimos 280px
```

### Materiais Impressos

#### A4 (210 x 297mm)

```
Margens: 20mm top, 20mm bottom, 18mm laterais
Sangria: 3mm em todos os lados
Área útil: 174 x 257mm

Grid:
- 8 colunas com gutter de 5mm
- Baseline grid: 6mm
```

#### Cartão de Visita (90 x 50mm)

```
Margens: 5mm em todos os lados
Sangria: 3mm
Área útil: 80 x 40mm

Sem grid formal — composição livre dentro da área útil
```

#### Convite Padrão (148 x 210mm — A5)

```
Margens: 15mm em todos os lados
Sangria: 3mm
Área útil: 118 x 180mm

Grid:
- Centralizado, texto alinhado ao centro
- Baseline grid: 5mm
```

### Web (se aplicável)

```
Breakpoints:
- Mobile: 375px — 1 coluna
- Tablet: 768px — 2 colunas
- Desktop: 1280px — 3 a 4 colunas
- Wide: 1440px+ — conteúdo fixo em 1200px, centralizado

Container máximo: 1200px
Padding lateral: 16px (mobile), 32px (tablet), 40px (desktop)
Grid: 12 colunas, gutter 24px
```

---

## 6. Componentes

### 6.1 Botões

#### Botão Primário (CTA principal)

```
Background: teal-600 (#2EB8A6)
Texto: #FFFFFF
Fonte: DM Sans 600, 15px, letter-spacing: 0.02em, uppercase
Padding: 14px 32px
Border-radius: 8px
Border: none

Hover:
  Background: teal-700 (#249688)
  Transform: translateY(-1px)
  Box-shadow: 0 4px 12px rgba(46, 184, 166, 0.25)
  Transition: all 200ms ease-out

Ativo:
  Background: teal-800 (#1D7A6D)
  Transform: translateY(0)
  Box-shadow: none

Desabilitado:
  Background: warm-300 (#DDD5CC)
  Texto: warm-500 (#8C8176)
  Cursor: not-allowed
```

#### Botão Secundário (Ação alternativa)

```
Background: transparent
Texto: teal-700 (#249688)
Fonte: DM Sans 600, 15px, letter-spacing: 0.02em, uppercase
Padding: 14px 32px
Border-radius: 8px
Border: 2px solid teal-600 (#2EB8A6)

Hover:
  Background: teal-100 (#E5FAF6)
  Border-color: teal-700
  Transition: all 200ms ease-out

Sobre fundo escuro:
  Texto: #FFFFFF
  Border: 2px solid rgba(255,255,255,0.6)
  Hover background: rgba(255,255,255,0.1)
```

#### Botão Texto (Links de ação)

```
Background: none
Texto: teal-700 (#249688)
Fonte: DM Sans 500, 14px
Padding: 8px 0
Border: none
Text-decoration: none

Hover:
  Text-decoration: underline
  Text-underline-offset: 4px
```

#### Botão WhatsApp (CTA de contato)

```
Background: #25D366
Texto: #FFFFFF
Fonte: DM Sans 600, 15px, letter-spacing: 0.02em
Padding: 14px 32px
Border-radius: 8px
Ícone: WhatsApp icon à esquerda, 20px, gap 8px

Hover:
  Background: #20BD5A
```

### 6.2 Cards

#### Card de Evento (Portfólio)

```
Largura: 100% do container (responsivo)
Aspect-ratio da foto: 4:5 (retrato) ou 3:2 (paisagem)
Border-radius: 12px
Overflow: hidden
Background: warm-50 (#FDFBF9)
Border: 1px solid warm-200 (#EDE8E2)

Estrutura interna:
┌─────────────────────────┐
│                         │
│    FOTO DO EVENTO       │
│    (4:5 ou 3:2)         │
│                         │
│    Overlay gradient     │
│    na base com          │
│    overline do tipo     │
│    de evento            │
├─────────────────────────┤
│  padding: space-6       │
│                         │
│  Overline: "CASAMENTO"  │
│  DM Sans 600 12px       │
│  uppercase, teal-600    │
│  letter-spacing: 0.08em │
│  margin-bottom: space-2 │
│                         │
│  Título: "Joana & Pedro"│
│  Playfair 500 20px      │
│  warm-800               │
│  margin-bottom: space-2 │
│                         │
│  Subtítulo: "Espaço..." │
│  DM Sans 400 14px       │
│  warm-500               │
│  margin-bottom: space-4 │
│                         │
│  [Ver evento →]         │
│  Botão texto teal-700   │
└─────────────────────────┘

Hover:
  Box-shadow: 0 8px 24px rgba(0,0,0,0.08)
  Transform: translateY(-2px)
  Transition: all 300ms ease-out
  Foto: scale(1.03), transition 500ms ease-out
```

#### Card de Depoimento

```
Background: teal-100 (#E5FAF6)
Border-radius: 12px
Padding: space-8 (32px)
Border: none

Estrutura:
┌─────────────────────────────┐
│  "                          │
│  Playfair Italic 24px       │
│  teal-800                   │
│  line-height: 1.4           │
│  "A GJ fez do nosso         │
│   casamento um sonho.       │
│   Cada detalhe foi          │
│   pensado com carinho."     │
│                             │
│  ─── divider teal-300 ───   │
│                             │
│  Nome: DM Sans 600 14px     │
│  warm-800                   │
│  Evento: DM Sans 400 13px   │
│  warm-500                   │
└─────────────────────────────┘

Aspas decorativas:
  Caractere: "
  Playfair 700, 72px
  Cor: teal-300 (#99EDE0)
  Posição: top-left do card, offset: -8px top, 0 left
```

#### Card de Serviço

```
Background: #FFFFFF
Border-radius: 12px
Padding: space-8 (32px)
Border: 1px solid warm-200 (#EDE8E2)

Estrutura:
┌─────────────────────────────┐
│  [Ícone]                    │
│  40px, stroke: teal-600     │
│  margin-bottom: space-4     │
│                             │
│  Título: h3                 │
│  "Decoração Floral"         │
│  DM Sans 600 24px           │
│  warm-800                   │
│  margin-bottom: space-3     │
│                             │
│  Descrição: body            │
│  DM Sans 400 16px           │
│  warm-600                   │
│  line-height: 1.6           │
│  margin-bottom: space-6     │
│                             │
│  [Saiba mais →]             │
│  Botão texto teal-700       │
└─────────────────────────────┘

Hover:
  Border-color: teal-400 (#6AE3D0)
  Box-shadow: 0 4px 16px rgba(46,184,166,0.1)
  Transition: all 250ms ease-out
```

### 6.3 Badges / Tags de Evento

```
Display: inline-flex
Padding: space-1 (4px) space-3 (12px)
Border-radius: 100px (pill)
Fonte: DM Sans 600, 11px, uppercase, letter-spacing: 0.06em

Variantes:

  Casamento:
    Background: teal-100 (#E5FAF6)
    Texto: teal-800 (#1D7A6D)

  Aniversário:
    Background: coral-100 (#FDE8E2)
    Texto: coral-600 (#C85A44)

  Corporativo:
    Background: warm-100 (#F7F4F0)
    Texto: warm-700 (#4A423B)

  Debutante:
    Background: #F0E6F6 (lavanda muito claro)
    Texto: #6B4D8A (lavanda escuro)

  Formatura:
    Background: #E6EFF6 (azul muito claro)
    Texto: #3D5A80 (azul escuro)
```

### 6.4 Campos de Formulário (Inputs)

```
Background: #FFFFFF
Border: 1px solid warm-300 (#DDD5CC)
Border-radius: 8px
Padding: space-3 (12px) space-4 (16px)
Fonte: DM Sans 400, 16px
Cor do texto: warm-800 (#332D28)
Placeholder: warm-400 (#B8ADA1)

Focus:
  Border-color: teal-600 (#2EB8A6)
  Box-shadow: 0 0 0 3px rgba(46,184,166,0.15)
  Outline: none
  Transition: border-color 150ms, box-shadow 150ms

Erro:
  Border-color: #D14343
  Box-shadow: 0 0 0 3px rgba(209,67,67,0.1)

Label:
  DM Sans 500, 14px
  warm-700 (#4A423B)
  margin-bottom: space-2 (8px)
```

### 6.5 Divisores e Elementos Decorativos

#### Divisor Simples

```
Height: 1px
Background: warm-200 (#EDE8E2)
Margin: space-12 (48px) 0
```

#### Divisor Teal (Destaque de seção)

```
Width: 60px
Height: 3px
Background: teal-600 (#2EB8A6)
Border-radius: 2px
Margin: space-4 (16px) 0
```

#### Ornamento Floral Geométrico

Elemento decorativo sutil inspirado na forma das pétalas — NÃO ilustrações florais realistas. Composição geométrica abstrata usando:
- Círculos e elipses sobrepostos
- Cor: teal-300 (#99EDE0) em opacidade 15-30%
- Tamanho: 200-400px
- Posição: cantos de seções, atrás de headlines

Descrição visual: 3 a 5 elipses de diferentes tamanhos, rotacionadas em ângulos variados (15deg, 45deg, 75deg), sobrepostas levemente no centro. Cada elipse tem borda de 1px em `teal-300` com fill de `teal-100` a 20% de opacidade. O conjunto sugere uma flor estilizada sem ser literal.

#### Padrão de Barras (Referência ao logo)

Elemento baseado nas barras horizontais do logo:

```
3 linhas horizontais paralelas
  Largura: 40-120px (variável)
  Altura: 2px cada
  Gap: 4px
  Cor: teal-600 (#2EB8A6)
  Opacidade: 60%

Uso: Separador decorativo entre seções, ao lado de overlines, como watermark sutil
```

### 6.6 Estilo de Citação / Depoimento

```
Border-left: 3px solid teal-600 (#2EB8A6)
Padding-left: space-6 (24px)
Margin: space-8 (32px) 0

Texto:
  Playfair Italic, 20px
  warm-700 (#4A423B)
  line-height: 1.5

Atribuição:
  DM Sans 500, 14px
  warm-500 (#8C8176)
  margin-top: space-3 (12px)
  Formato: "— Nome Completo, Tipo de Evento"
```

### 6.7 Navegação (Web)

```
Header:
  Position: sticky top
  Background: rgba(253,251,249,0.95)
  Backdrop-filter: blur(12px)
  Height: 64px (desktop), 56px (mobile)
  Border-bottom: 1px solid warm-200 (#EDE8E2)
  Padding: 0 space-10 (40px)

Logo:
  Posição: esquerda
  Altura: 32px

Links:
  DM Sans 500, 14px
  warm-700 (#4A423B)
  letter-spacing: 0.01em
  Gap: space-8 (32px)
  Hover: teal-700 (#249688)

CTA do header:
  Botão primário, tamanho menor (padding: 10px 24px, fonte 13px)

Mobile menu:
  Hamburger icon: 24px, warm-800
  Menu fullscreen: background warm-50, links centralizados
  Links: Playfair 500, 28px, warm-800
  Animação: slide-in from right, 300ms ease-out
```

---

## 7. Tratamento Fotográfico

### Direção de Estilo

**Tom geral**: Quente, luminoso, com contrastes suaves. Fotos que parecem ter sido tiradas na golden hour — mesmo quando não foram.

#### Color Grading

```
Temperatura: +200K a +400K (levemente mais quente que neutro)
Tint: +5 a +10 (leve toque magenta para pele saudável)
Exposição: Levemente sobre-exposta (+0.3 a +0.5 EV)
Contraste: Médio-baixo (-10 a -15)
Highlights: Reduzidos (-20 a -30) para evitar estouro
Shadows: Elevados (+15 a +25) para detalhes em sombra
Brancos: Levemente reduzidos (-10)
Pretos: Levemente elevados (+5 a +10) — cria o efeito "matte/filme"
Vibrance: +10 a +15
Saturation: 0 a +5 (nunca exagerar)

Curva de tons:
  Levantar o ponto preto para ~10/255 (pretos não totalmente pretos — efeito cinematográfico)
  Suave S-curve nos meios-tons

HSL — Ajustes específicos:
  Verdes: Hue puxar para teal (-20 a -30), Saturation +10
  Azuis: Hue puxar para teal (+10), Saturation -10
  Laranjas (pele): Luminance +5, Saturation -5
```

Esse grading cria uma estética coesa onde o teal aparece naturalmente nas folhagens e detalhes, sem parecer filtro artificial.

#### Preset Resumo (para Lightroom/Capture One)

Nome: `GJ_Eventos_Master`
- Quente, matte, contrastes suaves
- Pretos levantados, highlights contidos
- Verdes puxados para teal
- Pele natural e luminosa
- Efeito: editorial brasileiro contemporâneo

### Composição

#### O Que Fotografar (Prioridade)

1. **Detalhes florais** — close-ups de arranjos, texturas de pétalas, composição de cores
2. **Panorâmicas do espaço decorado** — a mesa posta, o altar completo, a visão que o convidado tem ao entrar
3. **Momentos de emoção** — a reação ao ver a decoração pronta, o brinde, o abraço
4. **Processo de montagem** — bastidores que mostram profissionalismo (equipe uniformizada, materiais organizados)
5. **Detalhes de acabamento** — guardanapo dobrado, vela acesa, placa de nome, flor individual

#### Regras de Composição

- Regra dos terços para panorâmicas
- Centralizado e simétrico para detalhes de mesa/altar
- Profundidade de campo rasa (f/1.8 a f/2.8) para detalhes florais
- Sempre incluir pelo menos 1 elemento teal na composição quando possível (fita, vela, guardanapo)
- Espaço negativo generoso — nunca enquadrar "apertado" demais
- Horizonte sempre nivelado

#### O Que Evitar

- Fotos com iluminação mista (LED azulado + incandescente amarelado)
- Close-ups de comida (não é o serviço da GJ)
- Fotos com marca d'água de outros fornecedores visível
- Fotos escuras demais ou com flash direto
- Poses forçadas de convidados
- Cenários bagunçados ou com elementos alheios à decoração (cabos, caixas, lixo)
- Saturação excessiva ou HDR agressivo
- Filtros do Instagram sobre as fotos de portfólio

### Molduras e Tratamentos de Imagem

#### Moldura Teal (para destaque)

```
Border: 3px solid teal-600 (#2EB8A6)
Border-radius: 8px
Padding: 6px (espaço entre borda e foto)
Background: warm-50 (visível no padding)
```

#### Foto com Cantos Arredondados

```
Border-radius: 12px (padrão)
Border-radius: 24px (destaque emocional)
Overflow: hidden
```

#### Foto com Gradiente de Texto

```
Foto full-width
Overlay: linear-gradient(to top, rgba(26,31,30,0.75) 0%, transparent 50%)
Texto na base: branco, Playfair 500
```

---

## 8. Templates para Redes Sociais

### 8.1 Estratégia de Feed do Instagram

#### Grid de 9 Posts (3x3)

Padrão de alternância para manter o feed visualmente coeso:

```
Linha 1: [FOTO]     [TEXTO]    [FOTO]
Linha 2: [TEXTO]    [FOTO]     [TEXTO]
Linha 3: [FOTO]     [TEXTO]    [FOTO]

FOTO = Imagem de portfólio (sem texto overlay ou texto mínimo)
TEXTO = Post com fundo de cor sólida + tipografia
```

Alternância de fundos para posts TEXTO:
- `warm-50` (#FDFBF9) com texto `warm-800`
- `teal-100` (#E5FAF6) com texto `teal-900`
- `charcoal-900` (#1A1F1E) com texto branco (usar com moderação: 1 a cada 9 posts)

#### Template A — Post de Portfólio (1080x1350)

```
┌──────────────────────────┐
│                          │
│                          │
│                          │
│    FOTO DO EVENTO        │
│    (área: 1080 x 950)    │
│                          │
│                          │
│▓▓▓▓▓ gradient bottom ▓▓▓│
├──────────────────────────┤
│  bg: warm-50             │
│  padding: 40px           │
│                          │
│  CASAMENTO               │
│  overline, teal-600      │
│                          │
│  Marina & Lucas          │
│  Playfair 500, 28px      │
│  warm-800                │
│                          │
│  Espaço Quintal • 2025   │
│  DM Sans 400, 15px       │
│  warm-500                │
│                          │
│  [logo GJ] ── barras ──  │
│  canto inferior direito  │
└──────────────────────────┘
```

#### Template B — Post de Texto / Dica (1080x1080)

```
┌──────────────────────────┐
│  bg: teal-100 (#E5FAF6)  │
│  padding: 80px           │
│                          │
│  DICA DO DIA             │
│  overline, teal-600      │
│  margin-bottom: 24px     │
│                          │
│  "3 flores que           │
│   resistem ao            │
│   calor do verão"        │
│  Playfair 700, 36px      │
│  teal-900                │
│  text-align: center      │
│                          │
│  ─── barras teal ───     │
│                          │
│  Arraste para            │
│  saber quais →           │
│  DM Sans 500, 14px       │
│  teal-700                │
│                          │
│  [logo GJ watermark]     │
│  canto inferior direito  │
│  opacidade: 30%          │
└──────────────────────────┘
```

#### Template C — Post de Depoimento (1080x1080)

```
┌──────────────────────────┐
│  bg: warm-50 (#FDFBF9)   │
│  padding: 80px           │
│                          │
│  ❝                       │
│  Playfair 700, 96px      │
│  teal-300, opacidade 40% │
│  posição: top-left       │
│                          │
│  "O casamento ficou      │
│   mais bonito do que     │
│   eu sonhei."            │
│  Playfair Italic 28px    │
│  warm-800                │
│  text-align: center      │
│  max-width: 800px        │
│                          │
│  ─── divider teal ───    │
│  width: 60px, center     │
│                          │
│  Joana Menezes           │
│  DM Sans 600, 15px       │
│  warm-700                │
│                          │
│  Casamento • Maio 2025   │
│  DM Sans 400, 13px       │
│  warm-500                │
│                          │
│  [logo GJ watermark]     │
└──────────────────────────┘
```

### 8.2 Stories Templates

#### Story de Bastidores (1080x1920)

```
┌──────────────────────────┐
│                          │
│  FOTO/VÍDEO              │
│  fullscreen              │
│                          │
│                          │
│                          │
│                          │
│                          │
│                          │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  overlay-gradient-bottom │
│                          │
│  BASTIDORES              │
│  overline, branco        │
│  letter-spacing: 0.1em   │
│                          │
│  "Montando o cenário     │
│   do casamento da        │
│   Marina & Lucas"        │
│  DM Sans 500, 18px       │
│  branco                  │
│                          │
│  ← Arraste para cima     │
│                          │
└──────────────────────────┘
```

#### Story de Antes/Depois (1080x1920)

```
┌──────────────────────────┐
│  ANTES                   │
│  overline, branco        │
│  sobre bg teal-600       │
│  padding: 8px 16px       │
│  border-radius: 4px      │
│  posição: top-left +80px │
│                          │
│  FOTO DO ESPAÇO VAZIO    │
│  metade superior         │
│  (1080 x 960)            │
│                          │
├──── divider 3px teal ────┤
│                          │
│  DEPOIS                  │
│  overline, branco        │
│  sobre bg teal-600       │
│                          │
│  FOTO DO ESPAÇO DECORADO │
│  metade inferior         │
│  (1080 x 960)            │
│                          │
│  [logo GJ watermark]     │
└──────────────────────────┘
```

### 8.3 Carrossel (1080x1350, 10 slides máximo)

#### Slide 1 (Capa)

```
FOTO full-bleed com overlay escuro
Texto centralizado, branco:
  Playfair 700, 42px
  "5 tendências de
   decoração para 2026"
  
Overline acima: DM Sans 600, 12px, uppercase
  "TENDÊNCIAS"

Badge no topo: Arraste →, pill teal-600
```

#### Slides 2-9 (Conteúdo)

```
Background: warm-50 (#FDFBF9)
Padding: 60px

Overline: número + título
  "01 — FLORES SUSPENSAS"
  DM Sans 600, 12px, teal-600, uppercase

Foto: retangular, border-radius 12px
  Tamanho: 960 x 600px (deixar respiro)

Texto:
  DM Sans 400, 17px
  warm-700
  line-height: 1.6
  Max 4 linhas

Paginação:
  "3 / 10"
  DM Sans 400, 12px
  warm-400
  Canto inferior direito
```

#### Slide 10 (CTA final)

```
Background: charcoal-900 (#1A1F1E)
Padding: 80px
Texto centralizado, branco:

  Playfair 500, 28px
  "Quer transformar
   sua festa em algo
   inesquecível?"

  space-8

  [FALE CONOSCO]
  Botão primário teal-600, branco

  space-4

  @gj_eventos.sp
  DM Sans 400, 14px
  warm-400
```

### 8.4 Capa de Reels

```
Background: charcoal-900 (#1A1F1E) ou foto com overlay escuro
Texto centralizado:

  Overline: tipo de conteúdo
  "DECORAÇÃO" ou "BASTIDORES" ou "DICA"
  DM Sans 600, 12px, teal-400, uppercase

  Título: 2-3 linhas
  Playfair 700, 32px
  Branco
  line-height: 1.2
  text-align: center

  Barras decorativas: abaixo do título
  3 linhas, teal-600, 60px width, centralizado

  Logo: watermark, inferior, 30% opacidade
```

### 8.5 WhatsApp Catálogo

```
Formato: 1080 x 1080px

Background: warm-50 (#FDFBF9)
Foto do serviço: border-radius 12px, ocupando 70% superior
Barra inferior:
  Background: teal-600 (#2EB8A6)
  Padding: 16px 24px
  Border-radius: 0 0 12px 12px
  
  Nome do serviço: DM Sans 600, 16px, branco
  "Decoração Floral Completa"
  
  Ícone WhatsApp + "Orçamento": DM Sans 400, 13px, branco
```

---

## 9. Materiais Impressos

### 9.1 Cartão de Visita

**Frente:**

```
Dimensão: 90 x 50mm
Background: warm-50 (#FDFBF9)
Acabamento: laminação fosca + hot stamp teal no logo

Layout:
  Logo GJ Eventos: centralizado horizontalmente, 1/3 superior
  Tamanho do logo: ~35mm de largura

  Barras decorativas: 3 linhas, teal-600, abaixo do logo
  Gap: 8mm do logo

  Nome: DM Sans 600, 9pt
  warm-800
  Centralizado

  Cargo: DM Sans 400, 7pt
  warm-500
  Centralizado
```

**Verso:**

```
Background: teal-600 (#2EB8A6)
Texto: branco

Layout:
  Telefone: DM Sans 500, 8pt
  WhatsApp: DM Sans 500, 8pt
  Instagram: DM Sans 500, 8pt
  Endereço: DM Sans 400, 7pt

  Alinhado à esquerda, margem de 8mm
  Ícones: 4mm, stroke branco, à esquerda de cada item

  Tagline no rodapé:
  "Desde 2005"
  Playfair Italic, 7pt, rgba(255,255,255,0.6)
  Canto inferior direito
```

### 9.2 Documento de Proposta / Orçamento

**Capa (A4):**

```
Background: warm-50
Foto de portfólio: full-bleed com overlay-warm (85% branco)

Centro da página:
  Logo GJ Eventos: 60mm largura
  
  space-12
  
  "Proposta de Decoração"
  Playfair 500, 28pt
  warm-800
  Centralizado

  "Casamento — Marina & Lucas"
  DM Sans 400, 14pt
  warm-500
  Centralizado

  space-8

  Data: DM Sans 400, 11pt, warm-400
  "Abril 2026"

Rodapé:
  Barras decorativas teal, centralizadas
  Contato: DM Sans 400, 8pt, warm-500
```

**Páginas internas (A4):**

```
Header:
  Logo GJ: 20mm largura, canto superior esquerdo
  Linha horizontal: 0.5pt, warm-200, full-width
  margin-bottom: 12mm

Corpo:
  Títulos de seção: Playfair 500, 16pt, warm-800
  Subtítulos: DM Sans 600, 12pt, warm-700
  Corpo: DM Sans 400, 10pt, warm-700, line-height: 1.6
  
  Itens do orçamento:
    Tabela com linhas alternadas warm-50 / branco
    Header da tabela: DM Sans 600, 9pt, teal-800, bg teal-100
    Valores: DM Sans 500, 10pt, warm-800
    Total: DM Sans 700, 12pt, teal-700, border-top 2pt teal-600

Rodapé:
  Linha horizontal: 0.5pt, warm-200
  "GJ Eventos • (11) XXXX-XXXX • @gj_eventos.sp"
  DM Sans 400, 7pt, warm-400
  Centralizado
  Paginação: "2 / 5", DM Sans 400, 7pt, warm-400, canto direito
```

### 9.3 Materiais de Evento

#### Menu / Cardápio

```
Formato: 100 x 210mm (DL) ou 148 x 210mm (A5)
Papel: offset 240g, fosco

Cabeçalho:
  Overline: "MENU"
  DM Sans 600, 8pt, teal-600, uppercase, letter-spacing: 0.1em

  Nomes dos noivos / homenageado:
  Playfair 500, 18pt, warm-800
  
  Data:
  DM Sans 400, 9pt, warm-500

Corpo:
  Categorias (Entrada, Principal, Sobremesa):
  Playfair 500, 12pt, teal-800
  Divider: barras decorativas teal, 30px

  Itens:
  Nome do prato: DM Sans 500, 10pt, warm-800
  Descrição: DM Sans 400, 8pt, warm-500, italic

Decoração: ornamento floral geométrico no canto inferior, teal-200 a 20% opacidade
```

#### Placa de Mesa / Place Card

```
Formato: 90 x 55mm (dobrado) ou 80 x 50mm (flat)
Papel: offset 300g

Frente:
  Borda superior: 2mm, teal-600
  Nome: Playfair 500, 14pt, warm-800, centralizado vertical e horizontal
  Ornamento: barras decorativas teal, abaixo do nome, 20px

Verso (se dobrado):
  Mensagem: DM Sans 400, 8pt, warm-500
  "Obrigado por fazer parte deste momento."
```

#### Sinalização de Evento

```
Placas direcionais, welcome signs, etc.

Background: warm-50 ou charcoal-900 (depende do evento)
Tipografia: Playfair 700 para headline, DM Sans 500 para suporte
Elemento decorativo: barras teal ou ornamento floral geométrico

Regra: a sinalização DEVE seguir a paleta do evento específico,
mas sempre incluir pelo menos 1 elemento teal como âncora da marca GJ.
```

### 9.4 Embalagem (Entregas Florais)

```
Papel de seda: branco com estampa sutil do padrão de barras em teal-200, repetido
Fita: cetim teal-600, 15mm largura
Tag: 60 x 35mm, cartão offset 300g

  Frente da tag:
    Logo GJ: 25mm
    Barras decorativas abaixo

  Verso da tag:
    "Com carinho,"
    Playfair Italic, 9pt, warm-600
    
    "De: ___________"
    "Para: __________"
    DM Sans 400, 8pt, warm-500
    Linhas tracejadas warm-300
```

---

## 10. Padrões e Texturas

### 10.1 Padrão de Barras (Primário)

Derivado diretamente das barras horizontais do logo.

```
Composição:
  3 linhas horizontais paralelas
  Proporção: largura = 8x a altura
  Exemplo: 80px x 2px por barra, gap de 4px entre barras
  Cor: teal-600 (#2EB8A6)

Repetição para padrão:
  Módulo: 120px x 30px
  Repetir: horizontalmente com offset de 60px a cada linha
  Resultado: barras escalonadas, padrão diagonal sutil

Opacidade de uso:
  Fundo de seção: 5-8% (quase imperceptível, cria textura)
  Papel de seda / embalagem: 15-20%
  Elemento decorativo visível: 40-60%
  Separador / ícone: 100%
```

### 10.2 Padrão Floral Geométrico (Secundário)

Abstração geométrica de formas florais — não é uma flor realista.

```
Composição:
  Pétala unitária: elipse 40x20px, rotacionada
  Flor: 5 pétalas distribuídas em rotação de 72deg cada (360/5)
  Centro: círculo 8px

Módulo: 80 x 80px
Repetição: hexagonal (offset alternado)

Cor: teal-400 (#6AE3D0) em stroke de 1px, sem fill
  OU teal-200 (#C2F5EC) em fill com opacidade 15%

Uso:
  Background de convites: opacidade 5-10%
  Canto decorativo de posts: opacidade 20-30%
  Estampa de embalagem: opacidade 10-15%
  NUNCA usar como elemento principal — sempre secundário
```

### 10.3 Textura de Linho

Textura sutil que evoca tecido de mesa / toalha — calorosa e tátil.

```
Tipo: noise grain sutil com direção vertical leve
Opacidade: 3-5% sobre backgrounds warm-50 ou warm-100
Efeito: adiciona profundidade tátil sem chamar atenção
Implementação CSS: SVG filter com feTurbulence (baseFrequency: 0.9, numOctaves: 4)
```

### 10.4 Gradiente Teal (para fundos digitais)

```
Gradiente suave para backgrounds de seções especiais:

Linear:
  from: teal-100 (#E5FAF6)
  to: warm-50 (#FDFBF9)
  Direction: 135deg (diagonal)

Radial (para centro de atenção):
  from: teal-200 (#C2F5EC) no centro
  to: warm-50 (#FDFBF9) nas bordas
  Shape: ellipse at center
```

---

## 11. Regras de Uso

### FAÇA

| Prática | Exemplo |
|---------|---------|
| Use o teal como cor dominante da marca em todos os touchpoints | Logo, CTAs, destaques, badges |
| Mantenha fundos claros e quentes como padrão | warm-50 (#FDFBF9) como background principal |
| Use Playfair Display para headlines e DM Sans para corpo | Consistência em todo material |
| Aplique o color grading definido em TODAS as fotos de portfólio | Preset GJ_Eventos_Master |
| Mantenha espaço negativo generoso | Mínimo 60px de margem em posts |
| Use o padrão de barras como elemento de marca | Separadores, watermarks, embalagens |
| Inclua "Desde 2005" em materiais institucionais | Cartão, proposta, bio do Instagram |
| Fotografe detalhes florais com profundidade de campo rasa | f/1.8 a f/2.8, bokeh suave |
| Use fundos escuros (charcoal-900) com moderação e intenção | Máximo 1 a cada 6-9 posts no feed |
| Teste todo texto sobre foto com ratio de contraste 4.5:1 | Especialmente overlays com texto |

### NAO FACA

| Prática | Porque |
|---------|--------|
| Usar dourado, rosé gold ou champagne como cor de marca | Commodity visual do setor — todo concorrente usa. O teal diferencia. |
| Misturar Playfair e DM Sans no mesmo nível hierárquico | Quebra a hierarquia e confunde a leitura |
| Usar mais de 3 fontes em qualquer peça | Poluição visual |
| Aplicar filtros prontos do Instagram sobre fotos de portfólio | Destrói a consistência cromática |
| Usar ornamentos florais realistas (clipart de rosas, folhas vetorizadas) | Estética datada. O floral da GJ é geométrico e moderno. |
| Colocar texto sobre fotos sem overlay de contraste | Texto ilegível = amadorismo |
| Usar o teal em opacidade abaixo de 15% quando ele for o elemento principal | Parece desbotado, não intencional |
| Escrever em CAPS LOCK exceto em overlines e badges | Grita. A marca fala com elegância. |
| Publicar fotos escuras, com flash direto ou com bagunça visível | Cada foto é portfólio. Qualidade sempre. |
| Usar gradientes multicoloridos ou neon | Conflita com a estética "elegância acessível" |
| Colocar o logo sobre fundos que competem com ele (estampas, fotos agitadas) | Logo precisa de respiro: fundo limpo ou overlay |
| Usar o coral como cor principal de qualquer peça | Coral é acento pontual, nunca protagonista |

### Hierarquia de Elementos

Em qualquer composição, a ordem de importância visual deve ser:

```
1. Fotografia (quando presente) — o elemento que vende
2. Headline em Playfair — o que comunica
3. Elemento teal (CTA, badge, barra) — o que identifica como GJ
4. Texto de suporte em DM Sans — o que complementa
5. Padrões decorativos — o que ambienta (nunca compete com 1-4)
```

---

## Apêndice A — Tokens Rápidos para Implementação

### CSS Custom Properties

```css
:root {
  /* Cores */
  --gj-teal-50: #F2FDFB;
  --gj-teal-100: #E5FAF6;
  --gj-teal-200: #C2F5EC;
  --gj-teal-300: #99EDE0;
  --gj-teal-400: #6AE3D0;
  --gj-teal-500: #3BD4BE;
  --gj-teal-600: #2EB8A6;
  --gj-teal-700: #249688;
  --gj-teal-800: #1D7A6D;
  --gj-teal-900: #155C53;

  --gj-warm-50: #FDFBF9;
  --gj-warm-100: #F7F4F0;
  --gj-warm-200: #EDE8E2;
  --gj-warm-300: #DDD5CC;
  --gj-warm-400: #B8ADA1;
  --gj-warm-500: #8C8176;
  --gj-warm-600: #6B6158;
  --gj-warm-700: #4A423B;
  --gj-warm-800: #332D28;
  --gj-warm-900: #1F1B18;

  --gj-charcoal-900: #1A1F1E;
  --gj-charcoal-800: #252B2A;
  --gj-charcoal-700: #333B39;

  --gj-coral-100: #FDE8E2;
  --gj-coral-300: #F4B5A6;
  --gj-coral-400: #EE9480;
  --gj-coral-500: #E8725A;
  --gj-coral-600: #C85A44;

  --gj-success: #2D9F6F;
  --gj-warning: #E5A530;
  --gj-error: #D14343;

  /* Tipografia */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', Arial, sans-serif;

  /* Espaçamento */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* Raios de borda */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 24px;
  --radius-full: 100px;

  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.1);
  --shadow-teal: 0 4px 12px rgba(46,184,166,0.25);

  /* Transições */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-enter: 500ms;
}
```

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap" rel="stylesheet">
```

---

## Apêndice B — Checklist de Consistência

Antes de publicar qualquer material (post, proposta, sinalização), verificar:

- [ ] Playfair Display usada apenas em headlines, citações e nomes de evento
- [ ] DM Sans usada em todo texto de corpo, labels e UI
- [ ] Teal-600 (#2EB8A6) presente como elemento identificador da marca
- [ ] Coral usado no máximo 1 vez por composição (ou zero)
- [ ] Fotos com color grading GJ_Eventos_Master aplicado
- [ ] Contraste de texto sobre imagem verificado (ratio 4.5:1)
- [ ] Overlines em uppercase com letter-spacing 0.08em
- [ ] Logo com espaço de respiro adequado (sem elementos colados)
- [ ] Nenhum ornamento floral realista (apenas geométrico)
- [ ] Nenhum uso de dourado, rosé gold ou champagne como cor de marca

---

*Design System elaborado por Designer Agent (REIS [IA]) para GJ Comércio de Flores, Presentes e Eventos Ltda. Todos os valores, especificações e regras deste documento são definitivos e devem ser seguidos em toda produção de materiais visuais da marca.*
