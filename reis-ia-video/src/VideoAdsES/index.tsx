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
import v1Data from "../../public/captions/ad_v1_transcript.json";
import v2Data from "../../public/captions/ad_v2_transcript.json";
import v3Data from "../../public/captions/ad_v3_transcript.json";
import v4Data from "../../public/captions/ad_v4_transcript.json";
import v5Data from "../../public/captions/ad_v5_transcript.json";
import v6Data from "../../public/captions/ad_v6_transcript.json";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BLUE = "#4A90FF";
const BLUE_DIM = "rgba(74,144,255,0.15)";
const BLUE_GLOW = "rgba(74,144,255,0.3)";
const WHITE = "#FFFFFF";
const WHITE_DIM = "rgba(255,255,255,0.6)";
const WHITE_MUTED = "rgba(255,255,255,0.35)";
const RED_STRIKE = "rgba(255,80,80,0.6)";
const MONO = "'JetBrains Mono', 'SF Mono', monospace";
const SANS = "'Inter', system-ui, sans-serif";

const HIGHLIGHT_WORDS = new Set([
  "chatgpt", "genérico", "generico", "especialista", "especialistas",
  "copy", "copies", "41", "7", "squads", "agentes", "agente", "ia",
  "9", "dólares", "dolares", "único", "unico", "framework", "hormozi",
  "ormosi", "aida", "pas", "peas", "minutos", "24", "12", "15", "8",
  "programar", "técnico", "tecnico", "diriges", "cloudcode", "60",
  "mil", "proyectos", "reales", "estrategia", "posicionamiento",
  "diseñador", "copywriter", "campaña", "campañas", "paginas",
  "ventas", "inmediato",
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
// Background — copied exactly from AgentesDemoES
// ---------------------------------------------------------------------------

function Background() {
  const frame = useCurrentFrame();
  const glowPulse = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.04, 0.1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(50% 40% at 50% 100%, #0a1a3a 0%, #000000 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(74,144,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 50%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 60% at 50% 50%, black 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(74,144,255,${glowPulse}) 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Captions — word-by-word highlight (parametric: receives words array)
// ---------------------------------------------------------------------------

function Captions({ words }: { words: TranscriptWord[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lines: { words: TranscriptWord[]; start: number; end: number }[] = [];
  let buf: TranscriptWord[] = [];
  for (const w of words) {
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
    frame: frame - lineFrame,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });

  const lineEndDist = t - activeLine.end;
  const lineExitOpacity =
    lineEndDist > 0.15
      ? interpolate(lineEndDist, [0.15, 0.35], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 280,
        left: 32,
        right: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: lineExitOpacity,
        transform: `translateY(${interpolate(slideUp, [0, 1], [24, 0])}px)`,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 10px",
          padding: "14px 24px",
          borderRadius: 14,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          transform: `scale(${slideUp})`,
        }}
      >
        {activeLine.words.map((word, i) => {
          const isActive = t >= word.start && t <= word.end + 0.1;
          const isPast = t > word.end + 0.1;
          const hl = HIGHLIGHT_WORDS.has(
            word.word.toLowerCase().replace(/[.,!?¿¡]/g, ""),
          );

          const wFrame = Math.floor(word.start * fps);
          const wPop = spring({
            frame: frame - wFrame,
            fps,
            config: { damping: 10, stiffness: 220, mass: 0.35 },
          });

          let color = "rgba(255,255,255,0.4)";
          let scale = 1;
          let textShadow = "none";
          let fontSize = 48;

          if (isActive) {
            color = BLUE;
            scale = hl ? 1.2 : 1.1;
            fontSize = hl ? 56 : 52;
            textShadow = hl
              ? "0 0 20px rgba(74,144,255,0.8), 0 0 40px rgba(74,144,255,0.4)"
              : "0 0 12px rgba(74,144,255,0.5)";
          } else if (isPast) {
            color = WHITE;
            textShadow = "0 1px 3px rgba(0,0,0,0.6)";
          }

          return (
            <span
              key={`${word.start}-${i}`}
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize,
                color,
                textShadow,
                transform: `scale(${scale * Math.min(wPop, 1)})`,
                opacity: interpolate(wPop, [0, 0.5, 1], [0, 0.8, 1], {
                  extrapolateRight: "clamp",
                }),
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Terminal — copied from AgentesDemoES
// ---------------------------------------------------------------------------

function Terminal({
  command,
  output,
  typingSpeed = 2,
  badge,
  badgeColor = "#22c55e",
}: {
  command: string;
  output: string[];
  typingSpeed?: number;
  badge?: string;
  badgeColor?: string;
}) {
  const frame = useCurrentFrame();
  const charsTyped = Math.floor(frame / typingSpeed);
  const displayCmd = command.slice(0, charsTyped);
  const cmdDone = charsTyped >= command.length;
  const outputStart = command.length * typingSpeed + 6;

  return (
    <div
      style={{
        width: 940,
        background: "rgba(10,10,10,0.95)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        boxShadow: "0 0 60px rgba(74,144,255,0.08), 0 20px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 13, color: WHITE_MUTED }}>
          Claude Code
        </span>
      </div>

      <div style={{ padding: "20px 24px", minHeight: 160 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 16, color: BLUE }}>&gt;</span>
          <span style={{ fontFamily: MONO, fontSize: 16, color: WHITE, wordBreak: "break-all" }}>
            {displayCmd}
            {!cmdDone && (
              <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0, color: BLUE }}>|</span>
            )}
          </span>
        </div>

        {cmdDone &&
          output.map((line, i) => {
            const lf = frame - outputStart - i * 5;
            return (
              <div
                key={i}
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  color: WHITE_DIM,
                  marginTop: i === 0 ? 16 : 4,
                  opacity: ease(lf, 0, 1, 0, 6),
                  transform: `translateY(${ease(lf, 6, 0, 0, 6)}px)`,
                  lineHeight: 1.5,
                }}
              >
                {line}
              </div>
            );
          })}

        {badge && cmdDone && (
          <div
            style={{
              marginTop: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 6,
              background: `${badgeColor}15`,
              border: `1px solid ${badgeColor}40`,
              opacity: ease(frame - outputStart - output.length * 5, 0, 1, 0, 8),
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: badgeColor }} />
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: badgeColor, letterSpacing: "0.05em" }}>
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scene fade wrapper
// ---------------------------------------------------------------------------

function SceneFade({ dur, fade = 6, children }: { dur: number; fade?: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const inOp = ease(frame, 0, 1, 0, fade);
  const outOp = easeIn(frame, 1, 0, dur - fade, dur);
  const op = frame < dur - fade ? inOp : outOp;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
}

// ---------------------------------------------------------------------------
// Shared Scene Components
// ---------------------------------------------------------------------------

/** Large text reveal — spring animation for hooks and statements */
function BigText({
  line1,
  line2,
  line1Color = WHITE,
  line2Color = BLUE,
  fontSize = 72,
}: {
  line1: string;
  line2?: string;
  line1Color?: string;
  line2Color?: string;
  fontSize?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div
        style={{
          opacity: op,
          transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
          fontFamily: SANS,
          fontSize,
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: "-0.03em",
          color: line1Color,
          lineHeight: 1.15,
        }}
      >
        {line1}
      </div>
      {line2 && (
        <div
          style={{
            fontFamily: SANS,
            fontSize: fontSize * 0.85,
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.02em",
            color: line2Color,
            opacity: ease(frame, 0, 1, 12, 25),
            lineHeight: 1.2,
          }}
        >
          {line2}
        </div>
      )}
      <div style={{ width: ease(frame, 0, 300, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

/** Price reveal — strikethrough old price, animate in US$9 */
function PriceReveal({ oldPrice = "US$4,000/mes", delay = 0 }: { oldPrice?: string; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const strikeW = ease(frame - delay, 0, 100, 20, 40);
  const newOp = ease(frame - delay, 0, 1, 45, 60);
  const newScale = spring({ frame: frame - delay - 45, fps, config: { damping: 40, stiffness: 80 } });
  const badgeOp = ease(frame - delay, 0, 1, 100, 120);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 400, color: WHITE_DIM, opacity: ease(frame - delay, 0, 1, 0, 10) }}>
        Equipo completo costaría
      </div>

      <div style={{ position: "relative", opacity: ease(frame - delay, 0, 1, 5, 18) }}>
        <span style={{ fontFamily: SANS, fontSize: 52, fontWeight: 300, color: RED_STRIKE }}>{oldPrice}</span>
        <div style={{
          position: "absolute", top: "50%", left: 0,
          width: `${strikeW}%`, height: 3,
          background: "rgba(255,80,80,0.8)",
          transform: "translateY(-50%)",
        }} />
      </div>

      <div style={{
        opacity: newOp,
        transform: `scale(${interpolate(newScale, [0, 1], [0.7, 1])})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 96, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>US$9</span>
        <span style={{ fontFamily: SANS, fontSize: 20, fontWeight: 500, color: BLUE }}>pago único, sin mensualidad</span>
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 12, opacity: badgeOp, flexWrap: "wrap", justifyContent: "center", padding: "0 40px" }}>
        {["41 agentes", "7 squads", "Garantía 7 días", "Acceso inmediato"].map((b) => (
          <div key={b} style={{
            padding: "8px 16px", borderRadius: 8, background: BLUE_DIM,
            border: `1px solid ${BLUE_GLOW}`, fontFamily: SANS, fontSize: 13, fontWeight: 500, color: WHITE_DIM,
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** CTA end screen */
function CTAEnd() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 50, stiffness: 80 } });
  const shimmerX = interpolate((frame - 30) % 120, [0, 120], [-100, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnOp = ease(frame, 0, 1, 25, 40);
  const btnScale = spring({ frame: frame - 25, fps, config: { damping: 50, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 32 }}>
      <div style={{ fontFamily: SANS, fontSize: 56, fontWeight: 300, opacity: ease(frame, 0, 1, 0, 15), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})` }}>
        <span style={{ color: WHITE }}>AGENTES </span><span style={{ color: BLUE }}>[IA]</span>
      </div>

      <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, color: BLUE, opacity: ease(frame, 0, 1, 10, 22), letterSpacing: "0.02em" }}>
        agentesia.moronireis.com.br
      </div>

      <div style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        padding: "22px 44px", borderRadius: 12, background: BLUE, opacity: btnOp,
        transform: `scale(${interpolate(btnScale, [0, 1], [0.85, 1])})`,
        boxShadow: "0 0 40px rgba(74,144,255,0.3)", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: `${shimmerX}%`, width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
        <span style={{ fontFamily: SANS, fontSize: 24, fontWeight: 700, color: WHITE, position: "relative", zIndex: 1 }}>ACCEDER POR US$9</span>
      </div>

      <div style={{ display: "flex", gap: 24, opacity: ease(frame, 0, 1, 45, 60) }}>
        {["Garantía 7 días", "Pago único", "Acceso inmediato"].map((t) => (
          <span key={t} style={{ fontFamily: SANS, fontSize: 14, color: WHITE_MUTED }}>{t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Squad data
// ---------------------------------------------------------------------------

const SQUADS = [
  { name: "Strategy", action: "analiza tu mercado", count: 8, color: "#4A90FF" },
  { name: "Copy", action: "escribe tu página de ventas", count: 5, color: "#8DC4FF" },
  { name: "Brand", action: "construye tu marca", count: 5, color: "#6AADFF" },
  { name: "Design", action: "crea tu identidad visual", count: 6, color: "#2D7AFF" },
  { name: "Content", action: "produce tu contenido", count: 6, color: "#00B4FF" },
  { name: "Growth", action: "lanza tus campañas", count: 7, color: "#3570CC" },
  { name: "Ops", action: "coordina todo", count: 3, color: "#5B9FFF" },
];

// ---------------------------------------------------------------------------
// AD V1 — "ChatGPT Genérico" (29.5s) — ad_v6_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.5   hook: "¿Sigues usando ChatGPT para todo?"
//  4.5–10.0  comparison: genérico vs especialista
//  10.0–17.5 agents: 41 especialistas, Copywriter con Hormozi...
//  17.5–23.5 squad cards
//  23.5–27.5 price reveal
//  27.5–29.5 CTA

const V1_WORDS = v6Data.words as TranscriptWord[];

function V1_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ opacity: op, transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`, fontFamily: SANS, fontSize: 80, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", color: WHITE, lineHeight: 1.1 }}>
        ¿Sigues usando
      </div>
      <div style={{ fontFamily: SANS, fontSize: 80, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", color: BLUE, opacity: ease(frame, 0, 1, 10, 22), lineHeight: 1.1 }}>
        ChatGPT para todo?
      </div>
      <div style={{ width: ease(frame, 0, 300, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function V1_ComparisonScene() {
  const frame = useCurrentFrame();
  const op = ease(frame, 0, 1, 0, 12);
  const rightOp = ease(frame, 0, 1, 20, 35);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28, padding: "0 50px" }}>
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        <div style={{
          flex: 1, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.3)",
          borderRadius: 16, padding: "28px 20px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12, opacity: op,
        }}>
          <span style={{ fontFamily: SANS, fontSize: 16, color: "rgba(255,80,80,0.8)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>ChatGPT</span>
          <span style={{ fontFamily: SANS, fontSize: 44, fontWeight: 800, color: "rgba(255,80,80,0.7)" }}>Genérico</span>
          <span style={{ fontFamily: SANS, fontSize: 16, color: WHITE_DIM, textAlign: "center", lineHeight: 1.4 }}>Un prompt para todo el mundo</span>
        </div>

        <div style={{
          flex: 1, background: BLUE_DIM, border: `1px solid ${BLUE_GLOW}`,
          borderRadius: 16, padding: "28px 20px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12, opacity: rightOp,
        }}>
          <span style={{ fontFamily: SANS, fontSize: 16, color: BLUE, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Agentes [IA]</span>
          <span style={{ fontFamily: SANS, fontSize: 44, fontWeight: 800, color: WHITE }}>Especialista</span>
          <span style={{ fontFamily: SANS, fontSize: 16, color: WHITE_DIM, textAlign: "center", lineHeight: 1.4 }}>41 agentes, cada uno entrenado para una sola cosa</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function V1_AgentsScene() {
  const frame = useCurrentFrame();

  const roles = [
    { label: "Copywriter", sub: "Framework Hormozi", color: BLUE },
    { label: "Estratega", sub: "Posicionamiento de mercado", color: "#8DC4FF" },
    { label: "Diseñador", sub: "Identidad visual", color: "#6AADFF" },
    { label: "Gestor de tráfico", sub: "Meta Ads optimizado", color: "#2D7AFF" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "60px 50px" }}>
      <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, color: WHITE, opacity: ease(frame, 0, 1, 0, 12), letterSpacing: "-0.02em" }}>
        41 agentes especializados
      </div>
      <div style={{ fontFamily: SANS, fontSize: 18, color: WHITE_DIM, opacity: ease(frame, 0, 1, 5, 18) }}>
        Cada uno entrenado para una sola cosa
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", marginTop: 8 }}>
        {roles.map((r, i) => {
          const d = i * 8;
          const rOp = ease(frame, 0, 1, d + 10, d + 22);
          const rX = ease(frame, -30, 0, d + 10, d + 22);
          return (
            <div key={r.label} style={{
              display: "flex", alignItems: "center", gap: 16,
              background: "rgba(255,255,255,0.03)", border: `1px solid ${r.color}25`,
              borderRadius: 12, padding: "16px 20px",
              opacity: rOp, transform: `translateX(${rX}px)`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: WHITE }}>{r.label}</div>
                <div style={{ fontFamily: SANS, fontSize: 15, color: WHITE_DIM }}>{r.sub}</div>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 12, color: r.color, fontWeight: 600, background: `${r.color}15`, padding: "4px 10px", borderRadius: 6 }}>
                ACTIVO
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function V1_SquadScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "50px 50px" }}>
      <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 600, color: WHITE, opacity: ease(frame, 0, 1, 0, 10) }}>
        7 Squads Completos
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {SQUADS.map((sq, i) => {
          const d = i * 5;
          const s = spring({ frame: frame - d, fps, config: { damping: 80, stiffness: 120 } });
          return (
            <div key={sq.name} style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${sq.color}30`,
              borderRadius: 10, padding: "14px 18px", minWidth: 210,
              opacity: ease(frame, 0, 1, d, d + 10),
              transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
            }}>
              <div style={{ fontFamily: MONO, fontSize: 12, color: sq.color, letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" as const }}>{sq.name}</div>
              <div style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: WHITE, marginTop: 4 }}>
                {sq.count} <span style={{ fontSize: 13, color: WHITE_DIM, fontWeight: 400 }}>agentes</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

export const AdV1: React.FC = () => {
  const fps = 30;
  const totalFrames = 30 * 30; // 30s

  const scenes = [
    { id: "hook",       start: 0,    end: 4.5  },
    { id: "comparison", start: 4.5,  end: 10.0 },
    { id: "agents",     start: 10.0, end: 17.5 },
    { id: "squads",     start: 17.5, end: 23.5 },
    { id: "price",      start: 23.5, end: 27.5 },
    { id: "cta",        start: 27.5, end: 30.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook: <V1_HookScene />,
    comparison: <V1_ComparisonScene />,
    agents: <V1_AgentsScene />,
    squads: <V1_SquadScene />,
    price: <PriceReveal />,
    cta: <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_tts_¿Sigu_20260519_122848.mp3")} volume={1} />
      {scenes.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>{sceneComponents[scene.id]}</SceneFade>
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions words={V1_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD V2 — "Proyectos Reales" (24.8s) — ad_v4_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.2   hook: "60K+ dólares en proyectos reales"
//  4.2–8.5   results: copy que vende, campañas que convierten...
//  8.5–13.0  not generic: 41 especialistas con metodología propia
//  13.0–17.5 frameworks: Hormozi, AIDA, PAS badges
//  17.5–21.5 price reveal
//  21.5–25.0 CTA

const V2_WORDS = v4Data.words as TranscriptWord[];

function V2_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: op, fontWeight: 400 }}>
        Probé estos agentes en
      </div>
      <div style={{
        opacity: op,
        transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
        fontFamily: SANS, fontSize: 88, fontWeight: 800, textAlign: "center",
        letterSpacing: "-0.04em", color: BLUE, lineHeight: 1.0,
      }}>
        $60K+
      </div>
      <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 600, color: WHITE, opacity: ease(frame, 0, 1, 12, 25), letterSpacing: "-0.02em" }}>
        de proyectos reales
      </div>
      <div style={{ width: ease(frame, 0, 260, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function V2_ResultsScene() {
  const frame = useCurrentFrame();
  const results = [
    { label: "Copy que vende", icon: "✓" },
    { label: "Campañas que convierten", icon: "✓" },
    { label: "Sitios que cierran", icon: "✓" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      {results.map((r, i) => {
        const d = i * 12;
        const op = ease(frame, 0, 1, d, d + 14);
        const xSlide = ease(frame, -40, 0, d, d + 14);
        return (
          <div key={r.label} style={{
            display: "flex", alignItems: "center", gap: 16,
            opacity: op, transform: `translateX(${xSlide}px)`,
            width: "100%",
          }}>
            <span style={{ fontFamily: MONO, fontSize: 28, color: "#22c55e", fontWeight: 700, width: 36 }}>{r.icon}</span>
            <span style={{ fontFamily: SANS, fontSize: 40, fontWeight: 700, color: WHITE, letterSpacing: "-0.02em" }}>{r.label}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function V2_NotGenericScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 60, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, color: "rgba(255,80,80,0.7)", opacity: ease(frame, 0, 1, 0, 12), letterSpacing: "-0.02em", textAlign: "center", textDecoration: "line-through" }}>
        No son prompts genéricos
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 18, 30),
        transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 56, fontWeight: 800, color: BLUE, letterSpacing: "-0.03em" }}>41 especialistas</span>
        <span style={{ fontFamily: SANS, fontSize: 22, color: WHITE_DIM }}>con metodología propia</span>
      </div>
    </AbsoluteFill>
  );
}

function V2_FrameworksScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameworks = [
    { name: "Hormozi", color: "#4A90FF" },
    { name: "AIDA", color: "#8DC4FF" },
    { name: "PAS", color: "#6AADFF" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 32, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        Todo integrado
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {frameworks.map((fw, i) => {
          const d = i * 10;
          const s = spring({ frame: frame - d, fps, config: { damping: 50, stiffness: 100 } });
          return (
            <div key={fw.name} style={{
              padding: "20px 32px", borderRadius: 14,
              background: `${fw.color}15`, border: `1px solid ${fw.color}50`,
              opacity: ease(frame, 0, 1, d, d + 14),
              transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
            }}>
              <span style={{ fontFamily: SANS, fontSize: 44, fontWeight: 800, color: fw.color, letterSpacing: "-0.02em" }}>{fw.name}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 20, color: WHITE_DIM, opacity: ease(frame, 0, 1, 38, 50) }}>
        Lo usé para mis clientes. Ahora los puedes usar tú.
      </div>
    </AbsoluteFill>
  );
}

export const AdV2: React.FC = () => {
  const fps = 30;
  const totalFrames = 25 * 30; // 25s

  const scenes = [
    { id: "hook",       start: 0,    end: 4.2  },
    { id: "results",    start: 4.2,  end: 8.5  },
    { id: "notgeneric", start: 8.5,  end: 13.0 },
    { id: "frameworks", start: 13.0, end: 17.5 },
    { id: "price",      start: 17.5, end: 21.5 },
    { id: "cta",        start: 21.5, end: 25.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook: <V2_HookScene />,
    results: <V2_ResultsScene />,
    notgeneric: <V2_NotGenericScene />,
    frameworks: <V2_FrameworksScene />,
    price: <PriceReveal />,
    cta: <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_tts_Probé_20260519_122901.mp3")} volume={1} />
      {scenes.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>{sceneComponents[scene.id]}</SceneFade>
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions words={V2_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD V3 — "Costo Equipo" (22.8s) — ad_v5_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–3.5   hook: "US$4,000/mes" big
//  3.5–9.0   team roles appearing one by one
//  9.0–14.0  "O puedes tener 41 agentes de IA"
//  14.0–22.8 price reveal + CTA

const V3_WORDS = v5Data.words as TranscriptWord[];

function V3_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12), fontWeight: 400 }}>
        Un equipo de marketing completo
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 8, 20),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        fontFamily: SANS, fontSize: 86, fontWeight: 800,
        color: "rgba(255,80,80,0.7)", letterSpacing: "-0.04em",
      }}>
        US$4,000
      </div>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: ease(frame, 0, 1, 18, 28) }}>
        al mes
      </div>
    </AbsoluteFill>
  );
}

function V3_RolesScene() {
  const frame = useCurrentFrame();
  const roles = [
    "Copywriter",
    "Estratega",
    "Diseñador",
    "Gestor de tráfico",
    "Director de branding",
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 22, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 10) }}>
        Necesitas contratar:
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {roles.map((role, i) => {
          const d = i * 8;
          const op = ease(frame, 0, 1, d + 5, d + 16);
          const xSlide = ease(frame, 40, 0, d + 5, d + 16);
          return (
            <div key={role} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.2)",
              borderRadius: 10, padding: "16px 20px",
              opacity: op, transform: `translateX(${xSlide}px)`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,80,80,0.6)", flexShrink: 0 }} />
              <span style={{ fontFamily: SANS, fontSize: 26, fontWeight: 600, color: WHITE }}>{role}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function V3_AlternativeScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 10, fps, config: { damping: 50, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 26, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        O puedes tener
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 10, 22),
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 88, fontWeight: 800, color: BLUE, letterSpacing: "-0.04em" }}>41 agentes</span>
        <span style={{ fontFamily: SANS, fontSize: 24, color: WHITE, fontWeight: 600 }}>de IA que hacen el mismo trabajo.</span>
      </div>
      <div style={{
        display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
        opacity: ease(frame, 0, 1, 35, 50), padding: "0 20px",
      }}>
        {["7 squads", "41 agentes", "24h/7días"].map((b) => (
          <div key={b} style={{
            padding: "8px 18px", borderRadius: 8, background: BLUE_DIM,
            border: `1px solid ${BLUE_GLOW}`, fontFamily: SANS, fontSize: 15, fontWeight: 600, color: BLUE,
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

export const AdV3: React.FC = () => {
  const fps = 30;
  const totalFrames = 23 * 30; // 23s

  const scenes = [
    { id: "hook",        start: 0,    end: 3.5  },
    { id: "roles",       start: 3.5,  end: 9.0  },
    { id: "alternative", start: 9.0,  end: 14.0 },
    { id: "price",       start: 14.0, end: 20.0 },
    { id: "cta",         start: 20.0, end: 23.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook: <V3_HookScene />,
    roles: <V3_RolesScene />,
    alternative: <V3_AlternativeScene />,
    price: <PriceReveal />,
    cta: <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_tts_Un_eq_20260519_122921.mp3")} volume={1} />
      {scenes.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>{sceneComponents[scene.id]}</SceneFade>
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions words={V3_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD V4 — "Velocidad" (22.6s) — ad_v2_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.3   hook: "Lo que te toma días, estos agentes lo resuelven en minutos"
//  4.3–7.2   "Página de ventas — 12 min"
//  7.2–10.8  "Competidores — 8 min"
//  10.8–14.5 "Campaña completa — 15 min"
//  14.5–18.5 "41 agentes, 24h/7días"
//  18.5–22.6 price + CTA

const V4_WORDS = v2Data.words as TranscriptWord[];

function V4_HookScene() {
  return (
    <BigText
      line1="Lo que te toma días,"
      line2="en minutos."
      fontSize={68}
    />
  );
}

function V4_TimingScene({ task, time, color = BLUE }: { task: string; time: string; color?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 55, stiffness: 95 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div style={{
        fontFamily: SANS, fontSize: 32, fontWeight: 600, color: WHITE_DIM,
        opacity: ease(frame, 0, 1, 0, 12), textAlign: "center",
      }}>
        {task}
      </div>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 10,
        opacity: ease(frame, 0, 1, 10, 22),
        transform: `scale(${interpolate(s, [0, 1], [0.75, 1])})`,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 100, fontWeight: 800, color, letterSpacing: "-0.04em" }}>{time}</span>
      </div>
      <div style={{ width: ease(frame, 0, 200, 18, 30), height: 2, background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
    </AbsoluteFill>
  );
}

function V4_AlwaysOnScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 60, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        41 agentes especializados
      </div>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 16,
        opacity: ease(frame, 0, 1, 10, 22),
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 80, fontWeight: 800, color: BLUE, letterSpacing: "-0.04em" }}>24h</span>
        <span style={{ fontFamily: SANS, fontSize: 40, fontWeight: 400, color: WHITE_DIM }}>/</span>
        <span style={{ fontFamily: SANS, fontSize: 80, fontWeight: 800, color: BLUE, letterSpacing: "-0.04em" }}>7 días</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 22, color: WHITE, fontWeight: 600, opacity: ease(frame, 0, 1, 28, 40) }}>
        trabajando para ti
      </div>
    </AbsoluteFill>
  );
}

function V4_PriceAndCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 50, stiffness: 80 } });
  const shimmerX = interpolate((frame - 20) % 120, [0, 120], [-100, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 10) }}>
        Todo por solo
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 8, 20),
        transform: `scale(${interpolate(s, [0, 1], [0.75, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 96, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>US$9</span>
        <span style={{ fontFamily: SANS, fontSize: 20, color: BLUE, fontWeight: 500 }}>pago único, sin mensualidad</span>
      </div>

      <div style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        padding: "20px 40px", borderRadius: 12, background: BLUE,
        opacity: ease(frame, 0, 1, 30, 45),
        transform: `scale(${interpolate(spring({ frame: frame - 30, fps, config: { damping: 50, stiffness: 80 } }), [0, 1], [0.85, 1])})`,
        boxShadow: "0 0 40px rgba(74,144,255,0.3)", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: `${shimmerX}%`, width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
        <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: WHITE, position: "relative", zIndex: 1 }}>ACCEDER AHORA</span>
      </div>

      <div style={{ fontFamily: MONO, fontSize: 18, color: BLUE, opacity: ease(frame, 0, 1, 50, 62), letterSpacing: "0.02em" }}>
        agentesia.moronireis.com.br
      </div>
    </AbsoluteFill>
  );
}

export const AdV4: React.FC = () => {
  const fps = 30;
  const totalFrames = 23 * 30; // 23s

  const scenes = [
    { id: "hook",    start: 0,    end: 4.3  },
    { id: "task1",   start: 4.3,  end: 7.2  },
    { id: "task2",   start: 7.2,  end: 10.8 },
    { id: "task3",   start: 10.8, end: 14.5 },
    { id: "always",  start: 14.5, end: 18.5 },
    { id: "pricecta",start: 18.5, end: 23.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:     <V4_HookScene />,
    task1:    <V4_TimingScene task="Necesitas una página de ventas" time="12 min" />,
    task2:    <V4_TimingScene task="Necesitas analizar 3 competidores" time="8 min" color="#8DC4FF" />,
    task3:    <V4_TimingScene task="Necesitas una campaña completa" time="15 min" color="#6AADFF" />,
    always:   <V4_AlwaysOnScene />,
    pricecta: <V4_PriceAndCTA />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_tts_Lo_qu_20260519_122935.mp3")} volume={1} />
      {scenes.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>{sceneComponents[scene.id]}</SceneFade>
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions words={V4_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD V5 — "7 Squads" (27.6s) — ad_v1_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–5.0   hook: "7 squads, 41 agentes"
//  5.0–9.5   Strategy + Copy squads
//  9.5–14.0  Brand + Design squads
// 14.0–18.5  Content + Growth squads
// 18.5–22.5  Ops squad + counter 41
// 22.5–27.6  price + CTA

const V5_WORDS = v1Data.words as TranscriptWord[];

function V5_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14, padding: "0 60px" }}>
      <div style={{
        opacity: op,
        transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
        display: "flex", alignItems: "baseline", gap: 12,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 100, fontWeight: 800, color: BLUE, letterSpacing: "-0.04em" }}>7</span>
        <span style={{ fontFamily: SANS, fontSize: 56, fontWeight: 700, color: WHITE, letterSpacing: "-0.02em" }}>squads</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: ease(frame, 0, 1, 15, 26) }}>
        <span style={{ fontFamily: SANS, fontSize: 80, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>41</span>
        <span style={{ fontFamily: SANS, fontSize: 36, fontWeight: 400, color: WHITE_DIM }}>agentes</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 22, color: WHITE_DIM, opacity: ease(frame, 0, 1, 30, 42) }}>
        Cada uno especialista en los suyo
      </div>
      <div style={{ width: ease(frame, 0, 280, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function V5_SquadPairScene({ squads }: { squads: typeof SQUADS }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "60px 50px" }}>
      {squads.map((sq, i) => {
        const d = i * 12;
        const s = spring({ frame: frame - d, fps, config: { damping: 70, stiffness: 110 } });
        return (
          <div key={sq.name} style={{
            width: "100%", background: "rgba(255,255,255,0.03)",
            border: `1px solid ${sq.color}30`, borderRadius: 16,
            padding: "24px 28px", display: "flex", flexDirection: "column", gap: 8,
            opacity: ease(frame, 0, 1, d, d + 12),
            transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: sq.color }} />
              <span style={{ fontFamily: MONO, fontSize: 14, color: sq.color, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                {sq.name} Squad
              </span>
              <span style={{ marginLeft: "auto", fontFamily: SANS, fontSize: 20, fontWeight: 700, color: WHITE }}>
                {sq.count} <span style={{ fontSize: 13, color: WHITE_DIM, fontWeight: 400 }}>agentes</span>
              </span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 20, color: WHITE_DIM, paddingLeft: 22 }}>
              {sq.action}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function V5_CounterScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counter = Math.min(41, Math.floor(ease(frame, 0, 41, 5, 55)));
  const s = spring({ frame: frame - 60, fps, config: { damping: 40, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        Tu equipo completo de IA
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: ease(frame, 0, 1, 5, 18) }}>
        <span style={{ fontFamily: SANS, fontSize: 120, fontWeight: 800, color: BLUE, letterSpacing: "-0.05em" }}>{counter}</span>
        <span style={{ fontFamily: SANS, fontSize: 40, fontWeight: 400, color: WHITE_DIM }}>agentes</span>
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 60, 72),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        fontFamily: SANS, fontSize: 24, color: WHITE, fontWeight: 600,
      }}>
        9 dólares. Pago único.
      </div>
    </AbsoluteFill>
  );
}

export const AdV5: React.FC = () => {
  const fps = 30;
  const totalFrames = 28 * 30; // 28s

  const scenes = [
    { id: "hook",    start: 0,    end: 5.0  },
    { id: "pair1",   start: 5.0,  end: 9.5  },
    { id: "pair2",   start: 9.5,  end: 14.0 },
    { id: "pair3",   start: 14.0, end: 18.5 },
    { id: "counter", start: 18.5, end: 22.5 },
    { id: "price",   start: 22.5, end: 25.5 },
    { id: "cta",     start: 25.5, end: 28.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:    <V5_HookScene />,
    pair1:   <V5_SquadPairScene squads={SQUADS.slice(0, 2)} />,
    pair2:   <V5_SquadPairScene squads={SQUADS.slice(2, 4)} />,
    pair3:   <V5_SquadPairScene squads={SQUADS.slice(4)} />,
    counter: <V5_CounterScene />,
    price:   <PriceReveal />,
    cta:     <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_tts_7_squ_20260519_122947.mp3")} volume={1} />
      {scenes.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>{sceneComponents[scene.id]}</SceneFade>
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions words={V5_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD V6 — "Sin Programar" (26.9s) — ad_v3_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.3   hook: "No necesitas saber programar"
//  4.3–7.2   "Solo le dices lo que necesitas y él ejecuta"
//  7.2–11.0  terminal: "Quiero una página de ventas..." → ✓ Listo
// 11.0–15.2  terminal: "Quiero analizar mis competidores" → ✓ Listo
// 15.2–18.5  terminal: "Quiero una campaña de tráfico" → ✓ Listo
// 18.5–22.5  "Tú solo diriges"
// 22.5–27.0  price + CTA

const V6_WORDS = v3Data.words as TranscriptWord[];

function V6_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div style={{
        opacity: op,
        transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
        fontFamily: SANS, fontSize: 72, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.03em", color: WHITE, lineHeight: 1.15,
      }}>
        No necesitas
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 72, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.03em", color: BLUE,
        opacity: ease(frame, 0, 1, 10, 22), lineHeight: 1.15,
      }}>
        saber programar.
      </div>
      <div style={{ width: ease(frame, 0, 300, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function V6_SimpleScene() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 30, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12), textAlign: "center" }}>
        No necesitas ser técnico.
      </div>
      <div style={{ fontFamily: SANS, fontSize: 40, color: WHITE, fontWeight: 700, opacity: ease(frame, 0, 1, 15, 28), textAlign: "center", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
        Solo le dices lo que necesitas
      </div>
      <div style={{ fontFamily: SANS, fontSize: 40, color: BLUE, fontWeight: 700, opacity: ease(frame, 0, 1, 28, 40), textAlign: "center", letterSpacing: "-0.02em" }}>
        y él ejecuta.
      </div>
    </AbsoluteFill>
  );
}

function V6_TerminalScene({ command, result }: { command: string; result: string }) {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal
        command={command}
        output={[result]}
        typingSpeed={1}
        badge="LISTO"
        badgeColor="#22c55e"
      />
    </AbsoluteFill>
  );
}

function V6_DirectorScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 10, fps, config: { damping: 50, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        CloudCode hace todo el trabajo técnico.
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 12, 24),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        fontFamily: SANS, fontSize: 72, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.03em", color: WHITE,
      }}>
        Tú solo
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 72, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.03em", color: BLUE,
        opacity: ease(frame, 0, 1, 24, 36),
      }}>
        diriges.
      </div>
      <div style={{ display: "flex", gap: 14, opacity: ease(frame, 0, 1, 40, 55) }}>
        {["41 agentes listos", "Sin código"].map((b) => (
          <div key={b} style={{
            padding: "8px 18px", borderRadius: 8, background: BLUE_DIM,
            border: `1px solid ${BLUE_GLOW}`, fontFamily: SANS, fontSize: 15, fontWeight: 600, color: BLUE,
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

export const AdV6: React.FC = () => {
  const fps = 30;
  const totalFrames = 27 * 30; // 27s

  const scenes = [
    { id: "hook",     start: 0,    end: 4.3  },
    { id: "simple",   start: 4.3,  end: 7.2  },
    { id: "term1",    start: 7.2,  end: 11.0 },
    { id: "term2",    start: 11.0, end: 15.2 },
    { id: "term3",    start: 15.2, end: 18.5 },
    { id: "director", start: 18.5, end: 22.5 },
    { id: "price",    start: 22.5, end: 25.0 },
    { id: "cta",      start: 25.0, end: 27.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:     <V6_HookScene />,
    simple:   <V6_SimpleScene />,
    term1:    <V6_TerminalScene command='Quiero una página de ventas con Framework Hormozi' result="✓ Página lista en 12 minutos" />,
    term2:    <V6_TerminalScene command='Quiero analizar a mis competidores' result="✓ 5 gaps identificados, reporte listo" />,
    term3:    <V6_TerminalScene command='Quiero una campaña de tráfico' result="✓ 3 ad sets configurados, listo para aprobar" />,
    director: <V6_DirectorScene />,
    price:    <PriceReveal />,
    cta:      <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_tts_No_ne_20260519_123000.mp3")} volume={1} />
      {scenes.map((scene) => {
        const from = s2f(scene.start, fps);
        const dur = s2f(scene.end - scene.start, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={dur}>
            <SceneFade dur={dur}>{sceneComponents[scene.id]}</SceneFade>
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions words={V6_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};
