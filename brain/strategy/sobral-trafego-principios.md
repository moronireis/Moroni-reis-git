# Sobral Traffic Principles — Operational Reference

Last updated: May 2026

> Source: Comunidade Sobral de Trafego (Modulos 001 e 002)
> Consumed by: traffic-manager, ads-analyst, creative-strategist

---

## 1. Mindset Principles (Module 001)

### The Elite Athlete Mentality
- Traffic management is a skill that requires daily practice
- "Suportar o tedio" (endure the boredom) — mastery comes from repetition, not novelty
- Define WHEN and WHERE you study/work on traffic daily
- Consistency > intensity

### Core Beliefs:
1. Traffic is the most important skill in digital marketing
2. Data-driven decisions > gut feeling
3. Test systematically, scale what works, kill what doesn't
4. The algorithm is your partner, not your enemy
5. Creative quality is the #1 lever for performance

---

## 2. Meta Ads Infrastructure (Module 002)

### Account Structure:
1. **Personal Profile** -> must be clean, real, active
2. **Facebook Page** -> business presence, required for ads
3. **Business Manager (BM)** -> central management hub
4. **Ad Account** -> where campaigns live (can have multiple per BM)
5. **Pixel** -> tracking code on your website/pages

### Setup Checklist:
- [ ] BM created and verified
- [ ] Ad account created inside BM
- [ ] Pixel installed on all pages
- [ ] Payment method configured
- [ ] Page connected to BM
- [ ] Domain verified

### Pixel Configuration:
- Standard events: PageView, Lead, Purchase, ViewContent, AddToCart
- Custom events for specific funnel steps
- Test pixel fires before launching campaigns
- Server-side events (CAPI) for iOS 14+ accuracy

---

## 3. Campaign Structure

### Hierarchy:
```
Campaign (Objective)
  -> Ad Set (Audience + Budget + Schedule)
       -> Ad (Creative + Copy + CTA)
```

### Objectives (by funnel stage):
| Stage | Objective | When |
|-------|-----------|------|
| Top | Awareness / Reach | Brand building, Raiz distribution |
| Middle | Engagement / Traffic | Content consumption, retargeting build |
| Bottom | Conversions / Leads | Lead capture, sales |

### Budget Types:
- **ABO (Ad Set Budget)**: You control budget per ad set. Better for testing.
- **CBO (Campaign Budget)**: Meta distributes budget across ad sets. Better for scaling.
- **Advantage+**: Broad targeting, full algorithmic control. Best for mature accounts with data.

---

## 4. Audience Strategy

### Audience Types:
1. **Cold**: Interests, lookalikes, broad (Advantage+)
2. **Warm**: Video viewers, engagers, website visitors
3. **Hot**: Add to cart, initiated checkout, email list

### Retargeting Windows:
- Video viewers: 3, 7, 14, 30 days
- Page visitors: 7, 14, 30, 60 days
- Engagers: 7, 14, 30 days

### Lookalike Strategy:
- Source: best customers (buyers > leads > engagers)
- Start with 1% (most similar)
- Scale to 2-3% as needed
- Never go above 5% (too broad)

---

## 5. Creative and Testing

### Hook Success Rate (HSR):
- Metric: % of people who watch past 3 seconds
- Target: 30%+ HSR
- If below 30%: hook is weak, change it

### Testing Protocol:
1. Create 3-5 creative variations
2. Run in ABO with equal budgets for 7 days
3. Winners: HSR > 30%, CPL within target, CTR > 1%
4. Graduate winners to CBO for scaling
5. Kill losers after statistical significance

### Ad Types to Rotate:
- Video (talking head, b-roll, animated)
- Static images (before/after, data, quotes)
- Carousel (story sequence, benefits)
- UGC (user-generated content style)

---

## 6. Optimization Rules

### When to Kill:
- Spent 2x target CPA with 0 conversions -> kill
- HSR below 15% -> kill creative
- CPL 3x above target after 7 days -> kill ad set

### When to Scale:
- CPA within target for 3+ consecutive days
- Statistical significance reached (50+ conversions)
- Scale vertically: increase budget 20-30% per change
- Scale horizontally: duplicate to new audiences

### Learning Phase:
- 50 conversions needed to exit learning
- Do NOT make changes during learning phase
- Significant edits reset learning: targeting, budget > 30%, bid strategy, creative

---

## 7. Scale Framework

### Vertical Scale:
- Increase budget on winning campaigns
- Max 20-30% increase per change
- Wait 3 days between increases

### Horizontal Scale:
- Duplicate winning ads to new audiences
- Create new campaigns with proven creatives
- Test new audience segments

### Structure for Scale:
```
CBO - 5 ad sets (varied audiences) - proven creatives
CBO - 5 ad sets (varied audiences) - proven creatives
CBO - 5 ad sets (varied audiences) - proven creatives
ABO - individual ad sets for testing new creatives
```

### Jay Abraham 3 Golden Rules:
1. Increase number of clients (new acquisition)
2. Increase purchase frequency (retention, upsells)
3. Increase average ticket value (offer optimization)

### Key Formula:
- VMC (Average Customer Value) > CPA -> can scale
- VMC < CPA -> fix funnel first, do not scale

---

## 8. Facebook Ads Library
- URL: facebook.com/ads/library
- Use for: competitor research, creative inspiration
- Filter by: country (BR), active status, media type
- Analyze: copy patterns, creative formats, offer positioning

---

## 9. Integration with REIS IA

- `traffic-manager` applies these principles when creating/managing campaigns
- `ads-analyst` uses benchmarks (HSR, CPA thresholds) for performance analysis
- `creative-strategist` uses testing protocol for creative strategy
- Aligns with `ads-safety.md` rules (all campaigns PAUSED, budget limits)
- Complements `andromeda-creative-portfolio.md` (post-Andromeda Meta strategy)
