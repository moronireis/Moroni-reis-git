# AI for Sales Playbook — Puglia Method

Last updated: May 2026

> Source: Rafael Puglia + Luiza Purificação (Sensei de Vendas / FHT)
> Consumed by: offer-architect, integration-engineer, cmo-strategist

---

## 1. Overview

The Puglia Method uses AI to augment every phase of the high-ticket sales process: pre-session research, real-time session support, and post-session analysis. Key result: closers using this system achieved **57% close rate** (vs. industry average of 15-25%).

---

## 2. Pre-Session AI Analysis

### Input:
- Application form responses
- Social media profile (Instagram, LinkedIn)
- Any prior messages or interactions
- Business website/landing page (if available)

### AI Analysis Framework:
1. **DISC Profile Estimation**
   - D (Dominance): Direct, results-oriented, impatient
   - I (Influence): Social, enthusiastic, storyteller
   - S (Steadiness): Loyal, patient, risk-averse
   - C (Conscientiousness): Analytical, detail-oriented, skeptical
   - Identify dominant style → adapt session approach

2. **Emotion Map**
   - Primary pain (what keeps them up at night)
   - Primary desire (what they daydream about)
   - Primary fear (what stops them from acting)
   - Hidden objections (what they won't say out loud)

3. **Schwartz Level of Consciousness**
   - Unaware: Doesn't know they have a problem
   - Problem-aware: Knows the problem, not the solution
   - Solution-aware: Knows solutions exist, not yours
   - Product-aware: Knows your product, not convinced
   - Most-aware: Ready to buy, needs a push
   - → Adapt session pitch to their level

4. **Buying Readiness Score (1-10)**
   - Based on urgency of pain, financial capacity, decision-making authority
   - Score 7+: Push for close in first session
   - Score 4-6: Nurture, schedule follow-up
   - Score 1-3: Not qualified, redirect to lower-ticket

### Pre-Session Report Format:
```
Lead: [Name]
DISC: [Dominant Style] with [Secondary]
Pain: [Primary pain in their words]
Dream: [Primary desire in their words]
Hidden Objection: [What they won't say]
Consciousness Level: [Level]
Buying Readiness: [Score/10]
Recommended Approach: [Specific strategy]
Key Phrases to Use: [3-5 phrases from their own language]
Topics to Avoid: [Based on profile analysis]
```

---

## 3. During-Session AI Support

### Real-Time Analysis:
- If session is transcribed live (via Zoom/Meet recording)
- AI can process in real-time and suggest:
  - When the lead's energy shifts (resistance signals)
  - Which objection is surfacing (mapped to the 18 triggers)
  - Recommended pivot points
  - Closing window detection

### Objection Detection Patterns:
| Signal | Likely Objection | Recommended Response |
|--------|-----------------|---------------------|
| "I need to think about it" | Fear of commitment | "What specifically would you need to think about?" |
| "Let me talk to my partner" | Shared decision or smokescreen | "Of course. What do you think they'd want to know?" |
| "It's expensive" | Price vs value gap | "Compared to what?" + value stack |
| Long silences | Processing or resistance | Wait. Don't fill the silence. |
| "I've been burned before" | Trust deficit | Story of similar client who had same fear |

---

## 4. Post-Session AI Debrief

### Input:
- Session recording transcription (via Whisper/Clipto)
- Closer's self-assessment

### AI Debrief Report Format:
```
Session: [Date] | Closer: [Name] | Lead: [Name]
Duration: [minutes]
Outcome: [Sold / Follow-up / Lost]

WINS (what went well):
- [Specific moment + why it worked]
- [Specific moment + why it worked]

ERRORS (what to improve):
- [Specific moment + what should have been done]
- [Specific moment + what should have been done]

OBJECTIONS SURFACED:
- [Objection 1] → Handled: [Yes/No] → Quality: [1-5]
- [Objection 2] → Handled: [Yes/No] → Quality: [1-5]

PATTERNS DETECTED:
- [Recurring pattern across sessions]

RECOMMENDATION FOR NEXT SESSION:
- [Specific improvement to practice]
```

### Tracking Spreadsheet:
| Date | Closer | Lead | DISC | Pain | Objections | Bought? | Revenue | Notes |
|------|--------|------|------|------|-----------|---------|---------|-------|
| Data flows here from each session |

---

## 5. The "Cérebro" (Brain) Concept

### From Puglia/Luiza via Manus AI:
The concept of training an AI with ALL materials of a project/business to create a "brain" that understands the complete context.

### Implementation for REIS IA:
1. Feed ALL course transcriptions, frameworks, and methodology docs into the knowledge base
2. Agent definitions reference the knowledge base
3. Each agent becomes a specialized "brain" for its domain
4. The system as a whole IS the "Cérebro" concept — distributed across specialized agents

### DLC (Downloadable Content) Pattern:
- Take a methodology/framework
- Have AI generate structured content from it
- Review and refine for accuracy
- Package as templates, checklists, worksheets
- Use as lead magnets or product bonuses

---

## 6. Tools & Integration

### Transcription:
- **Whisper** (local, free) — primary tool for REIS IA
- **Clipto** (clipto.com) — web-based alternative, free tier
- Both produce timestamped transcripts from audio/video

### AI Platforms:
- **Claude (REIS IA agents)** — primary analysis engine
- **ChatGPT Custom GPTs** — Puglia created "FHT Sessão 1a1" GPT for session prep
- **Manus AI** — for autonomous "brain" creation (alternative approach)

### CRM Integration Points:
- Application form → pre-session report (automated)
- Session recording → auto-transcribe → debrief report
- Debrief data → tracking spreadsheet → pattern analysis
- Pattern analysis → training material → closer improvement

---

## 7. Integration with REIS IA Agent System

### New Agent: sales-closer-coach
- Loads this playbook as primary knowledge
- Pre-session: generates lead analysis report
- Post-session: generates debrief from transcription
- Pattern tracking: identifies recurring wins/errors across sessions

### Existing Agent Upgrades:
- `offer-architect`: uses DISC awareness for offer positioning
- `direct-response-copywriter`: uses Schwartz levels for copy targeting
- `cmo-strategist`: uses KLT + buying readiness for funnel stage mapping
- `integration-engineer`: builds transcription → analysis pipeline

### Skill Candidates:
- `/sessao-prep` — Input: lead application data → Output: pre-session report
- `/sessao-debrief` — Input: session transcription → Output: debrief report
