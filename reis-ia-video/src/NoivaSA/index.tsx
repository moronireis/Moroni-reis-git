import {
  AbsoluteFill,
  Sequence,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  staticFile,
} from "remotion";
import type { TranscriptWord } from "../ReelsShort/types";
import transcriptData from "../../public/captions/noivasa-transcript.json";

// ---------------------------------------------------------------------------
// Transcript data
// ---------------------------------------------------------------------------

const allWords = transcriptData.words as TranscriptWord[];

// Scene boundaries from transcript segments
const SCENES = [
  { id: "hook",      start: 0,     end: 4.2  },  // "Você noivou. 47 abas..."
  { id: "pain1",     start: 4.2,   end: 10.6 },  // "Fornecedor que some... confirmou com quem?"
  { id: "anchor",    start: 10.6,  end: 16.0 },  // "Casamento não é evento, é projeto"
  { id: "method",    start: 16.0,  end: 28.2 },  // "Giovanna... método... 8 meses apagando incêndio"
  { id: "solution",  start: 28.2,  end: 40.0 },  // "Com a Noiva SA... do começo ao altar"
  { id: "cta",       start: 40.0,  end: 52.0 },  // "Se vai custar... chama a gente"
] as const;

// ---------------------------------------------------------------------------
// Noiva S/A Design Tokens
// ---------------------------------------------------------------------------

const ROSE    = "#DBA99F";
// BLUSH = "#FFCBC1" — available for future sub-scenes
const CREAM   = "#F4F3EE";
const EUCA    = "#4A6741";
const TAUPE   = "#9C958F";
const SILVER  = "#BAB9B6";
const TEXT_1  = "#1a1a1a";
const TEXT_2  = "#6b635d";

const SERIF  = "'Cormorant Garamond', 'Georgia', serif";
const SANS   = "'Montserrat', 'Inter', system-ui, sans-serif";
const BODY   = "'Source Sans 3', 'Inter', system-ui, sans-serif";

const HIGHLIGHT_WORDS = new Set([
  "noivou", "47", "abas", "fornecedor", "orçamento", "noivo",
  "casamento", "evento", "projeto", "método", "caos",
  "giovanna", "giovana", "100", "casamentos", "processo",
  "altar", "incêndio", "assessoria", "completa", "segurança",
  "50", "150", "mil", "gente",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ease(f: number, from: number, to: number, s: number, e: number) {
  return interpolate(f, [s, e], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function easeIn(f: number, from: number, to: number, s: number, e: number) {
  return interpolate(f, [s, e], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
}

function s2f(seconds: number, fps: number) {
  return Math.round(seconds * fps);
}

// ---------------------------------------------------------------------------
// Background — warm cream with soft rose glow
// ---------------------------------------------------------------------------

function Background() {
  const frame = useCurrentFrame();
  const glowPulse = interpolate(Math.sin(frame * 0.015), [-1, 1], [0.04, 0.09]);

  return (
    <AbsoluteFill style={{ background: CREAM }}>
      {/* Soft rose radial glow */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(219,169,159,${glowPulse}) 0%, transparent 65%)`,
      }} />
      {/* Bottom blush gradient */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        background: `linear-gradient(to top, rgba(255,203,193,0.15) 0%, transparent 100%)`,
      }} />
      {/* Subtle dot pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `radial-gradient(${TAUPE} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Animated Captions — Noiva S/A style
// ---------------------------------------------------------------------------

function Captions() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Group words into display lines (3 words per line for vertical)
  const lines: { words: TranscriptWord[]; start: number; end: number }[] = [];
  let buf: TranscriptWord[] = [];
  for (const w of allWords) {
    buf.push(w);
    if (buf.length >= 3) {
      lines.push({ words: [...buf], start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length > 0) {
    lines.push({ words: [...buf], start: buf[0].start, end: buf[buf.length - 1].end });
  }

  const activeLine = lines.find((l) => t >= l.start - 0.05 && t <= l.end + 0.35);
  if (!activeLine) return null;

  const lineFrame = Math.floor(activeLine.start * fps);
  const slideUp = spring({
    frame: frame - lineFrame, fps,
    config: { damping: 14, stiffness: 140, mass: 0.5 },
  });

  const lineEndDist = t - activeLine.end;
  const lineExitOpacity = lineEndDist > 0.15
    ? interpolate(lineEndDist, [0.15, 0.35], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return (
    <div style={{
      position: "absolute", bottom: 280, left: 32, right: 32,
      display: "flex", flexDirection: "column", alignItems: "center",
      opacity: lineExitOpacity,
      transform: `translateY(${interpolate(slideUp, [0, 1], [20, 0])}px)`,
      zIndex: 100,
    }}>
      <div style={{
        display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
        gap: "6px 10px", padding: "14px 24px", borderRadius: 14,
        backgroundColor: "rgba(244,243,238,0.85)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${SILVER}40`,
        boxShadow: "0 4px 16px rgba(155,149,143,0.12)",
        transform: `scale(${slideUp})`,
      }}>
        {activeLine.words.map((word, i) => {
          const isActive = t >= word.start && t <= word.end + 0.1;
          const isPast = t > word.end + 0.1;
          const hl = HIGHLIGHT_WORDS.has(word.word.toLowerCase().replace(/[.,!?]/g, ""));

          const wFrame = Math.floor(word.start * fps);
          const wPop = spring({
            frame: frame - wFrame, fps,
            config: { damping: 10, stiffness: 220, mass: 0.35 },
          });

          let color = TAUPE;
          let scale = 1;
          let fontSize = 44;

          if (isActive) {
            color = ROSE;
            scale = hl ? 1.18 : 1.08;
            fontSize = hl ? 52 : 48;
          } else if (isPast) {
            color = TEXT_1;
          }

          return (
            <span key={`${word.start}-${i}`} style={{
              fontFamily: SANS, fontWeight: 700, fontSize, color,
              transform: `scale(${scale * Math.min(wPop, 1)})`,
              opacity: interpolate(wPop, [0, 0.5, 1], [0, 0.8, 1], { extrapolateRight: "clamp" }),
              lineHeight: 1.2, letterSpacing: "-0.01em",
            }}>
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scene: Hook — "Você noivou. 47 abas abertas."
// ---------------------------------------------------------------------------

function HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating browser tab mockups
  const tabs = ["Buffet SP", "Flores", "DJ Lista", "Fotógrafo", "Convites", "Vestido"];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 60px" }}>
      {/* Scattered "tabs" */}
      <div style={{ position: "relative", width: 800, height: 500 }}>
        {tabs.map((tab, i) => {
          const angle = (i - 2.5) * 8;
          const x = (i % 3 - 1) * 180;
          const y = Math.floor(i / 3) * 160 - 80;
          const delay = i * 4;
          const op = ease(frame, 0, 1, delay, delay + 10);
          const s = spring({ frame: frame - delay, fps, config: { damping: 60, stiffness: 120 } });

          return (
            <div key={tab} style={{
              position: "absolute", left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
              opacity: op,
              background: "#fff", borderRadius: 10, padding: "12px 20px",
              border: `1px solid ${SILVER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              fontFamily: SANS, fontSize: 16, fontWeight: 500, color: TEXT_2,
              whiteSpace: "nowrap",
            }}>
              <span style={{ color: ROSE, marginRight: 8 }}>●</span>{tab}
            </div>
          );
        })}
      </div>

      {/* Counter */}
      <div style={{
        fontFamily: SERIF, fontSize: 72, fontWeight: 300, color: ROSE,
        opacity: ease(frame, 0, 1, 30, 45), letterSpacing: "-0.03em",
      }}>
        47 abas abertas
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene: Pain — fornecedor, orçamento, noivo
// ---------------------------------------------------------------------------

function PainScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pains = [
    { icon: "✗", text: "Fornecedor que some", delay: 0 },
    { icon: "✗", text: "Orçamento que não fecha", delay: 15 },
    { icon: "✗", text: '"Você confirmou com quem?"', delay: 30 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28, padding: "0 70px" }}>
      {pains.map((p, i) => {
        const s = spring({ frame: frame - p.delay, fps, config: { damping: 60, stiffness: 120 } });
        const op = ease(frame, 0, 1, p.delay, p.delay + 12);
        const x = ease(frame, -40, 0, p.delay, p.delay + 12);

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16,
            opacity: op, transform: `translateX(${x}px) scale(${interpolate(s, [0, 1], [0.95, 1])})`,
            background: "rgba(255,255,255,0.7)", borderRadius: 12,
            padding: "18px 28px", border: `1px solid ${SILVER}40`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)", width: "100%", maxWidth: 700,
          }}>
            <span style={{ fontFamily: SANS, fontSize: 24, color: "#c44", fontWeight: 700 }}>{p.icon}</span>
            <span style={{ fontFamily: BODY, fontSize: 26, color: TEXT_1, fontWeight: 400 }}>{p.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene: Anchor phrase — "Casamento não é evento. É projeto."
// ---------------------------------------------------------------------------

function AnchorScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Op = ease(frame, 0, 1, 0, 18);
  const line1Y = ease(frame, 20, 0, 0, 18);
  const line2Op = ease(frame, 0, 1, 25, 40);
  const line2Scale = spring({ frame: frame - 25, fps, config: { damping: 40, stiffness: 80 } });

  const subtextOp = ease(frame, 0, 1, 55, 70);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      {/* Decorative line top */}
      <div style={{ width: ease(frame, 0, 200, 0, 20), height: 1, background: ROSE, opacity: 0.4 }} />

      <div style={{
        fontFamily: SERIF, fontSize: 52, fontWeight: 300, color: TEXT_2,
        textAlign: "center", lineHeight: 1.3, opacity: line1Op,
        transform: `translateY(${line1Y}px)`,
      }}>
        Casamento não é evento.
      </div>

      <div style={{
        fontFamily: SERIF, fontSize: 64, fontWeight: 600, color: ROSE,
        textAlign: "center", lineHeight: 1.2, opacity: line2Op,
        transform: `scale(${interpolate(line2Scale, [0, 1], [0.9, 1])})`,
        letterSpacing: "-0.02em",
      }}>
        É projeto.
      </div>

      <div style={{
        fontFamily: BODY, fontSize: 24, fontWeight: 400, color: TAUPE,
        textAlign: "center", opacity: subtextOp, marginTop: 12,
      }}>
        E projeto sem método vira caos.
      </div>

      {/* Decorative line bottom */}
      <div style={{ width: ease(frame, 0, 200, 30, 50), height: 1, background: ROSE, opacity: 0.4, marginTop: 8 }} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene: Method — Giovanna, 100 casamentos, processo a processo
// ---------------------------------------------------------------------------

function MethodScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { num: "01", text: "Método validado", delay: 20 },
    { num: "02", text: "100+ casamentos", delay: 35 },
    { num: "03", text: "Processo a processo", delay: 50 },
    { num: "04", text: "Fornecedor por fornecedor", delay: 65 },
  ];

  // "Giovanna Paola" name reveal
  const nameOp = ease(frame, 0, 1, 0, 15);
  const nameY = ease(frame, 16, 0, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28, padding: "0 60px" }}>
      {/* Founder name */}
      <div style={{
        opacity: nameOp, transform: `translateY(${nameY}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}>
        <span style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 300, color: TEXT_1, letterSpacing: "0.04em" }}>
          Giovanna Paola
        </span>
        <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: TAUPE, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
          Fundadora, Noiva S/A
        </span>
      </div>

      {/* Method steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 700 }}>
        {steps.map((step) => {
          const s = spring({ frame: frame - step.delay, fps, config: { damping: 70, stiffness: 120 } });
          const op = ease(frame, 0, 1, step.delay, step.delay + 12);

          return (
            <div key={step.num} style={{
              display: "flex", alignItems: "center", gap: 16, opacity: op,
              transform: `scale(${interpolate(s, [0, 1], [0.95, 1])})`,
              background: "rgba(255,255,255,0.6)", borderRadius: 10,
              padding: "14px 24px", border: `1px solid ${SILVER}30`,
            }}>
              <span style={{
                fontFamily: SANS, fontSize: 14, fontWeight: 700, color: EUCA,
                background: `${EUCA}15`, padding: "4px 10px", borderRadius: 6,
              }}>{step.num}</span>
              <span style={{ fontFamily: BODY, fontSize: 22, color: TEXT_1, fontWeight: 500 }}>
                {step.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Checkmark */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, opacity: ease(frame, 0, 1, 80, 95),
        fontFamily: BODY, fontSize: 20, color: EUCA, fontWeight: 500,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={EUCA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Sem apagar incêndio
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene: Solution — Noiva S/A entrega
// ---------------------------------------------------------------------------

function SolutionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { label: "Assessoria Completa", icon: "heart" },
    { label: "Site do Casamento", icon: "globe" },
    { label: "Comunidade de Noivas", icon: "users" },
    { label: "Segurança Total", icon: "shield" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 32, padding: "0 60px" }}>
      {/* Logo */}
      <div style={{
        opacity: ease(frame, 0, 1, 0, 15),
        display: "flex", alignItems: "baseline", gap: 6,
      }}>
        <span style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 300, color: ROSE }}>NOIVA</span>
        <span style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 300, color: TAUPE }}>S.A.</span>
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 800 }}>
        {items.map((item, i) => {
          const delay = 15 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 70, stiffness: 120 } });
          const op = ease(frame, 0, 1, delay, delay + 12);

          return (
            <div key={item.label} style={{
              background: "rgba(255,255,255,0.7)", borderRadius: 14,
              padding: "24px 20px", textAlign: "center",
              border: `1px solid ${ROSE}30`, opacity: op,
              transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
              boxShadow: "0 2px 12px rgba(219,169,159,0.08)",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `${ROSE}15`, display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: ROSE }} />
              </div>
              <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 600, color: TEXT_1 }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: SERIF, fontSize: 26, fontWeight: 300, color: TEXT_2,
        textAlign: "center", fontStyle: "italic",
        opacity: ease(frame, 0, 1, 65, 80),
      }}>
        Do começo ao dia do altar.
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene: CTA — "Chama a gente"
// ---------------------------------------------------------------------------

function CTAScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 50, stiffness: 80 } });
  const btnOp = ease(frame, 0, 1, 30, 45);
  const btnScale = spring({ frame: frame - 30, fps, config: { damping: 50, stiffness: 80 } });

  // Soft shimmer on button
  const shimmerX = interpolate((frame - 40) % 150, [0, 150], [-100, 200], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28 }}>
      {/* Logo */}
      <div style={{
        opacity: ease(frame, 0, 1, 0, 15),
        transform: `scale(${interpolate(s, [0, 1], [0.92, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 300, color: ROSE }}>NOIVA</span>
          <span style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 300, color: TAUPE }}>S.A.</span>
        </div>
        <span style={{
          fontFamily: SANS, fontSize: 13, fontWeight: 600, color: TAUPE,
          letterSpacing: "0.2em", textTransform: "uppercase" as const,
        }}>
          Sociedade do Amor
        </span>
      </div>

      {/* CTA button */}
      <div style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        padding: "22px 44px", borderRadius: 50, background: ROSE, opacity: btnOp,
        transform: `scale(${interpolate(btnScale, [0, 1], [0.85, 1])})`,
        boxShadow: "0 4px 24px rgba(219,169,159,0.3)", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: `${shimmerX}%`, width: "60%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }} />
        <span style={{
          fontFamily: SANS, fontSize: 22, fontWeight: 700, color: "#fff",
          position: "relative", zIndex: 1, letterSpacing: "0.03em",
        }}>
          CHAMA A GENTE
        </span>
      </div>

      {/* Instagram handle */}
      <div style={{
        fontFamily: SANS, fontSize: 18, fontWeight: 500, color: TAUPE,
        opacity: ease(frame, 0, 1, 50, 65),
      }}>
        @noivasa.oficial
      </div>

      {/* Trust badges */}
      <div style={{
        display: "flex", gap: 20, opacity: ease(frame, 0, 1, 60, 75),
        flexWrap: "wrap", justifyContent: "center", padding: "0 40px",
      }}>
        {["8 anos de experiência", "100+ casamentos", "Método validado"].map((t) => (
          <span key={t} style={{ fontFamily: BODY, fontSize: 14, color: TEXT_2 }}>{t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Scene fade
// ---------------------------------------------------------------------------

function SceneFade({ dur, fade = 8, children }: { dur: number; fade?: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const inOp = ease(frame, 0, 1, 0, fade);
  const outOp = easeIn(frame, 1, 0, dur - fade, dur);
  const op = frame < dur - fade ? inOp : outOp;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
}

// ---------------------------------------------------------------------------
// Main Composition
// ---------------------------------------------------------------------------

const SCENE_MAP: Record<string, React.ReactNode> = {
  hook: <HookScene />,
  pain1: <PainScene />,
  anchor: <AnchorScene />,
  method: <MethodScene />,
  solution: <SolutionScene />,
  cta: <CTAScene />,
};

export const NoivaSA: React.FC = () => {
  const fps = 30;
  const totalFrames = 52 * fps; // 52s total

  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <Background />

      {/* Audio */}
      <Audio src={staticFile("audio/noivasa-demo-vo.mp3")} volume={1} />

      {/* Scenes synced to transcript */}
      {SCENES.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>
              {SCENE_MAP[scene.id]}
            </SceneFade>
          </Sequence>
        );
      })}

      {/* Captions overlay */}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions />
      </Sequence>
    </AbsoluteFill>
  );
};
