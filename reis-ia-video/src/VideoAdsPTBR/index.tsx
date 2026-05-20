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
import v1Data from "../../public/captions/ad_ptbr_v1_transcript.json";
import v2Data from "../../public/captions/ad_ptbr_v2_transcript.json";
import v3Data from "../../public/captions/ad_ptbr_v3_transcript.json";
import v4Data from "../../public/captions/ad_ptbr_v4_transcript.json";
import v5Data from "../../public/captions/ad_ptbr_v5_transcript.json";
import v6Data from "../../public/captions/ad_ptbr_v6_transcript.json";

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
  "agentes", "agente", "copy", "site", "campanha", "meta",
  "concorrentes", "app", "software", "social", "design", "vídeo",
  "branding", "executam", "300", "47", "reais", "único", "instalar",
  "profissional", "estratégia", "posicionamento", "chatgpt", "ia",
  "squads", "41", "7", "programar", "cloudcode", "hormozi",
  "aida", "pas", "24", "12", "15", "8", "minutos", "60",
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
// Background
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
// Captions — word-by-word highlight
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
// Terminal
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

/** Price reveal — strikethrough old price, animate in R$47 */
function PriceReveal({ oldPrice = "R$21.000/mês", delay = 0 }: { oldPrice?: string; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const strikeW = ease(frame - delay, 0, 100, 20, 40);
  const newOp = ease(frame - delay, 0, 1, 45, 60);
  const newScale = spring({ frame: frame - delay - 45, fps, config: { damping: 40, stiffness: 80 } });
  const badgeOp = ease(frame - delay, 0, 1, 100, 120);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 400, color: WHITE_DIM, opacity: ease(frame - delay, 0, 1, 0, 10) }}>
        Time completo custaria
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
        <span style={{ fontFamily: SANS, fontSize: 96, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>R$47</span>
        <span style={{ fontFamily: SANS, fontSize: 20, fontWeight: 500, color: BLUE }}>pagamento único, sem mensalidade</span>
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 12, opacity: badgeOp, flexWrap: "wrap", justifyContent: "center", padding: "0 40px" }}>
        {["41 agentes", "7 squads", "Garantia 7 dias", "Acesso imediato"].map((b) => (
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
        <span style={{ fontFamily: SANS, fontSize: 24, fontWeight: 700, color: WHITE, position: "relative", zIndex: 1 }}>ACESSAR POR R$47</span>
      </div>

      <div style={{ display: "flex", gap: 24, opacity: ease(frame, 0, 1, 45, 60) }}>
        {["Garantia 7 dias", "Pagamento único", "Acesso imediato"].map((t) => (
          <span key={t} style={{ fontFamily: SANS, fontSize: 14, color: WHITE_MUTED }}>{t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Squad data — PT-BR
// ---------------------------------------------------------------------------

const SQUADS = [
  { name: "Strategy", action: "analisa seu mercado", count: 8, color: "#4A90FF" },
  { name: "Copy", action: "escreve sua página de vendas", count: 5, color: "#8DC4FF" },
  { name: "Brand", action: "constrói sua marca", count: 5, color: "#6AADFF" },
  { name: "Design", action: "cria sua identidade visual", count: 6, color: "#2D7AFF" },
  { name: "Content", action: "produz seu conteúdo", count: 6, color: "#00B4FF" },
  { name: "Growth", action: "lança suas campanhas", count: 7, color: "#3570CC" },
  { name: "Ops", action: "coordena tudo", count: 3, color: "#5B9FFF" },
];

// ---------------------------------------------------------------------------
// AD PTBR V1 — "7 Squads" (27.5s → 840 frames) — ad_ptbr_v1_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–5.0   hook: "7 squads, 41 agentes"
//  5.0–9.5   Strategy + Copy squads
//  9.5–14.0  Brand + Design squads
// 14.0–18.5  Content + Growth squads
// 18.5–22.5  Ops squad + counter 41
// 22.5–25.5  price reveal
// 25.5–27.5  CTA

const PTBR_V1_WORDS = v1Data.words as TranscriptWord[];

function PTBRV1_HookScene() {
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
        Cada um especialista no que faz
      </div>
      <div style={{ width: ease(frame, 0, 280, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function PTBRV1_SquadPairScene({ squads }: { squads: typeof SQUADS }) {
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

function PTBRV1_CounterScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counter = Math.min(41, Math.floor(ease(frame, 0, 41, 5, 55)));
  const s = spring({ frame: frame - 60, fps, config: { damping: 40, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        Seu time completo de IA
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
        R$47. Pagamento único.
      </div>
    </AbsoluteFill>
  );
}

export const AdPTBR_V1: React.FC = () => {
  const fps = 30;
  const totalFrames = 840; // 28s

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
    hook:    <PTBRV1_HookScene />,
    pair1:   <PTBRV1_SquadPairScene squads={SQUADS.slice(0, 2)} />,
    pair2:   <PTBRV1_SquadPairScene squads={SQUADS.slice(2, 4)} />,
    pair3:   <PTBRV1_SquadPairScene squads={SQUADS.slice(4)} />,
    counter: <PTBRV1_CounterScene />,
    price:   <PriceReveal />,
    cta:     <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_ptbr_v1.mp3")} volume={1} />
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
        <Captions words={PTBR_V1_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD PTBR V2 — "Sem Programar" (24.3s → 750 frames) — ad_ptbr_v2_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.3   hook: "Não precisa saber programar"
//  4.3–7.2   "Você pede. Eles executam."
//  7.2–11.0  terminal: landing page
// 11.0–15.2  terminal: concorrentes
// 15.2–18.5  terminal: campanha
// 18.5–22.0  "Você só dirige"
// 22.0–24.3  CTA (no separate price — combined)

const PTBR_V2_WORDS = v2Data.words as TranscriptWord[];

function PTBRV2_HookScene() {
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
        Não precisa
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

function PTBRV2_SimpleScene() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 30, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12), textAlign: "center" }}>
        Não precisa ser técnico.
      </div>
      <div style={{ fontFamily: SANS, fontSize: 44, color: WHITE, fontWeight: 700, opacity: ease(frame, 0, 1, 15, 28), textAlign: "center", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
        Você pede.
      </div>
      <div style={{ fontFamily: SANS, fontSize: 44, color: BLUE, fontWeight: 700, opacity: ease(frame, 0, 1, 28, 40), textAlign: "center", letterSpacing: "-0.02em" }}>
        Eles executam.
      </div>
    </AbsoluteFill>
  );
}

function PTBRV2_TerminalScene({ command, result }: { command: string; result: string }) {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal
        command={command}
        output={[result]}
        typingSpeed={1}
        badge="PRONTO"
        badgeColor="#22c55e"
      />
    </AbsoluteFill>
  );
}

function PTBRV2_DirectorScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 10, fps, config: { damping: 50, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        Claude Code faz todo o trabalho técnico.
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 12, 24),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        fontFamily: SANS, fontSize: 72, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.03em", color: WHITE,
      }}>
        Você só
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 72, fontWeight: 800,
        textAlign: "center", letterSpacing: "-0.03em", color: BLUE,
        opacity: ease(frame, 0, 1, 24, 36),
      }}>
        dirige.
      </div>
      <div style={{ display: "flex", gap: 14, opacity: ease(frame, 0, 1, 40, 55) }}>
        {["41 agentes prontos", "Sem código"].map((b) => (
          <div key={b} style={{
            padding: "8px 18px", borderRadius: 8, background: BLUE_DIM,
            border: `1px solid ${BLUE_GLOW}`, fontFamily: SANS, fontSize: 15, fontWeight: 600, color: BLUE,
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function PTBRV2_PriceAndCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 50, stiffness: 80 } });
  const shimmerX = interpolate((frame - 20) % 120, [0, 120], [-100, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 10) }}>
        Tudo por apenas
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 8, 20),
        transform: `scale(${interpolate(s, [0, 1], [0.75, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 96, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>R$47</span>
        <span style={{ fontFamily: SANS, fontSize: 20, color: BLUE, fontWeight: 500 }}>pagamento único, sem mensalidade</span>
      </div>

      <div style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        padding: "20px 40px", borderRadius: 12, background: BLUE,
        opacity: ease(frame, 0, 1, 30, 45),
        transform: `scale(${interpolate(spring({ frame: frame - 30, fps, config: { damping: 50, stiffness: 80 } }), [0, 1], [0.85, 1])})`,
        boxShadow: "0 0 40px rgba(74,144,255,0.3)", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: `${shimmerX}%`, width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
        <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: WHITE, position: "relative", zIndex: 1 }}>ACESSAR AGORA</span>
      </div>

      <div style={{ fontFamily: MONO, fontSize: 18, color: BLUE, opacity: ease(frame, 0, 1, 50, 62), letterSpacing: "0.02em" }}>
        agentesia.moronireis.com.br
      </div>
    </AbsoluteFill>
  );
}

export const AdPTBR_V2: React.FC = () => {
  const fps = 30;
  const totalFrames = 750; // 25s

  const scenes = [
    { id: "hook",     start: 0,    end: 4.3  },
    { id: "simple",   start: 4.3,  end: 7.2  },
    { id: "term1",    start: 7.2,  end: 11.0 },
    { id: "term2",    start: 11.0, end: 15.2 },
    { id: "term3",    start: 15.2, end: 18.5 },
    { id: "director", start: 18.5, end: 22.0 },
    { id: "pricecta", start: 22.0, end: 25.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:     <PTBRV2_HookScene />,
    simple:   <PTBRV2_SimpleScene />,
    term1:    <PTBRV2_TerminalScene command="Quero uma landing page para oferta de R$497" result="✓ Landing page pronta em 12 minutos" />,
    term2:    <PTBRV2_TerminalScene command="Quero analisar meus concorrentes" result="✓ Top 3 concorrentes mapeados, gaps identificados" />,
    term3:    <PTBRV2_TerminalScene command="Quero uma campanha de tráfego frio R$50/dia" result="✓ 3 ad sets configurados, pronto para aprovar" />,
    director: <PTBRV2_DirectorScene />,
    pricecta: <PTBRV2_PriceAndCTA />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_ptbr_v2.mp3")} volume={1} />
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
        <Captions words={PTBR_V2_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD PTBR V3 — "Velocidade" (21.0s → 630 frames) — ad_ptbr_v3_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.3   hook: "O que te leva dias, esses agentes resolvem em minutos"
//  4.3–7.2   "Página de vendas — 12 min"
//  7.2–10.8  "Concorrentes — 8 min"
// 10.8–14.5  "Campanha completa — 15 min"
// 14.5–18.0  "41 agentes, 24h/7dias"
// 18.0–21.0  price + CTA

const PTBR_V3_WORDS = v3Data.words as TranscriptWord[];

function PTBRV3_HookScene() {
  return (
    <BigText
      line1="O que te leva dias,"
      line2="em minutos."
      fontSize={68}
    />
  );
}

function PTBRV3_TimingScene({ task, time, color = BLUE }: { task: string; time: string; color?: string }) {
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

function PTBRV3_AlwaysOnScene() {
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
        <span style={{ fontFamily: SANS, fontSize: 80, fontWeight: 800, color: BLUE, letterSpacing: "-0.04em" }}>7 dias</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 22, color: WHITE, fontWeight: 600, opacity: ease(frame, 0, 1, 28, 40) }}>
        trabalhando pra você
      </div>
    </AbsoluteFill>
  );
}

function PTBRV3_PriceAndCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 50, stiffness: 80 } });
  const shimmerX = interpolate((frame - 20) % 120, [0, 120], [-100, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 10) }}>
        Tudo por apenas
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 8, 20),
        transform: `scale(${interpolate(s, [0, 1], [0.75, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 96, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>R$47</span>
        <span style={{ fontFamily: SANS, fontSize: 20, color: BLUE, fontWeight: 500 }}>pagamento único, sem mensalidade</span>
      </div>

      <div style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        padding: "20px 40px", borderRadius: 12, background: BLUE,
        opacity: ease(frame, 0, 1, 30, 45),
        transform: `scale(${interpolate(spring({ frame: frame - 30, fps, config: { damping: 50, stiffness: 80 } }), [0, 1], [0.85, 1])})`,
        boxShadow: "0 0 40px rgba(74,144,255,0.3)", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: `${shimmerX}%`, width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
        <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: WHITE, position: "relative", zIndex: 1 }}>ACESSAR AGORA</span>
      </div>

      <div style={{ fontFamily: MONO, fontSize: 18, color: BLUE, opacity: ease(frame, 0, 1, 50, 62), letterSpacing: "0.02em" }}>
        agentesia.moronireis.com.br
      </div>
    </AbsoluteFill>
  );
}

export const AdPTBR_V3: React.FC = () => {
  const fps = 30;
  const totalFrames = 630; // 21s

  const scenes = [
    { id: "hook",    start: 0,    end: 4.3  },
    { id: "task1",   start: 4.3,  end: 7.2  },
    { id: "task2",   start: 7.2,  end: 10.8 },
    { id: "task3",   start: 10.8, end: 14.5 },
    { id: "always",  start: 14.5, end: 18.0 },
    { id: "pricecta",start: 18.0, end: 21.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:     <PTBRV3_HookScene />,
    task1:    <PTBRV3_TimingScene task="Precisa de uma página de vendas" time="12 min" />,
    task2:    <PTBRV3_TimingScene task="Precisa analisar 3 concorrentes" time="8 min" color="#8DC4FF" />,
    task3:    <PTBRV3_TimingScene task="Precisa de uma campanha completa" time="15 min" color="#6AADFF" />,
    always:   <PTBRV3_AlwaysOnScene />,
    pricecta: <PTBRV3_PriceAndCTA />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_ptbr_v3.mp3")} volume={1} />
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
        <Captions words={PTBR_V3_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD PTBR V4 — "Projetos Reais" (25.3s → 780 frames) — ad_ptbr_v4_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.2   hook: "Testei esses agentes em R$300K+ de projetos reais"
//  4.2–8.5   results: copy que vende, campanhas que convertem...
//  8.5–13.0  not generic: 41 especialistas com metodologia própria
// 13.0–17.5  frameworks: Hormozi, AIDA, PAS
// 17.5–21.5  price reveal
// 21.5–25.3  CTA

const PTBR_V4_WORDS = v4Data.words as TranscriptWord[];

function PTBRV4_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: op, fontWeight: 400 }}>
        Testei esses agentes em
      </div>
      <div style={{
        opacity: op,
        transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
        fontFamily: SANS, fontSize: 88, fontWeight: 800, textAlign: "center",
        letterSpacing: "-0.04em", color: BLUE, lineHeight: 1.0,
      }}>
        R$300K+
      </div>
      <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 600, color: WHITE, opacity: ease(frame, 0, 1, 12, 25), letterSpacing: "-0.02em" }}>
        de projetos reais
      </div>
      <div style={{ width: ease(frame, 0, 260, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function PTBRV4_ResultsScene() {
  const frame = useCurrentFrame();
  const results = [
    { label: "Copy que vende", icon: "✓" },
    { label: "Campanhas que convertem", icon: "✓" },
    { label: "Sites que fecham", icon: "✓" },
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

function PTBRV4_NotGenericScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 60, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, color: "rgba(255,80,80,0.7)", opacity: ease(frame, 0, 1, 0, 12), letterSpacing: "-0.02em", textAlign: "center", textDecoration: "line-through" }}>
        Não são prompts genéricos
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 18, 30),
        transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 56, fontWeight: 800, color: BLUE, letterSpacing: "-0.03em" }}>41 especialistas</span>
        <span style={{ fontFamily: SANS, fontSize: 22, color: WHITE_DIM }}>com metodologia própria</span>
      </div>
    </AbsoluteFill>
  );
}

function PTBRV4_FrameworksScene() {
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
        Tudo integrado
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
        Usei nos meus clientes. Agora você pode usar também.
      </div>
    </AbsoluteFill>
  );
}

export const AdPTBR_V4: React.FC = () => {
  const fps = 30;
  const totalFrames = 780; // 26s

  const scenes = [
    { id: "hook",       start: 0,    end: 4.2  },
    { id: "results",    start: 4.2,  end: 8.5  },
    { id: "notgeneric", start: 8.5,  end: 13.0 },
    { id: "frameworks", start: 13.0, end: 17.5 },
    { id: "price",      start: 17.5, end: 21.5 },
    { id: "cta",        start: 21.5, end: 26.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:       <PTBRV4_HookScene />,
    results:    <PTBRV4_ResultsScene />,
    notgeneric: <PTBRV4_NotGenericScene />,
    frameworks: <PTBRV4_FrameworksScene />,
    price:      <PriceReveal />,
    cta:        <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_ptbr_v4.mp3")} volume={1} />
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
        <Captions words={PTBR_V4_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD PTBR V5 — "Custo Equipe" (21.8s → 660 frames) — ad_ptbr_v5_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–3.5   hook: "R$21.000/mês" big
//  3.5–9.0   team roles appearing one by one
//  9.0–14.0  "Ou você pode ter 41 agentes de IA"
// 14.0–21.8  price reveal + CTA

const PTBR_V5_WORDS = v5Data.words as TranscriptWord[];

function PTBRV5_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 24, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12), fontWeight: 400 }}>
        Um time de marketing completo
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 8, 20),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        fontFamily: SANS, fontSize: 76, fontWeight: 800,
        color: "rgba(255,80,80,0.7)", letterSpacing: "-0.04em",
      }}>
        R$21.000
      </div>
      <div style={{ fontFamily: SANS, fontSize: 28, color: WHITE_DIM, opacity: ease(frame, 0, 1, 18, 28) }}>
        por mês
      </div>
    </AbsoluteFill>
  );
}

function PTBRV5_RolesScene() {
  const frame = useCurrentFrame();
  const roles = [
    "Copywriter",
    "Estrategista",
    "Designer",
    "Gestor de tráfego",
    "Diretor de branding",
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 22, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 10) }}>
        Você precisaria contratar:
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

function PTBRV5_AlternativeScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 10, fps, config: { damping: 50, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ fontFamily: SANS, fontSize: 26, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 12) }}>
        Ou você pode ter
      </div>
      <div style={{
        opacity: ease(frame, 0, 1, 10, 22),
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 88, fontWeight: 800, color: BLUE, letterSpacing: "-0.04em" }}>41 agentes</span>
        <span style={{ fontFamily: SANS, fontSize: 24, color: WHITE, fontWeight: 600 }}>de IA fazendo o mesmo trabalho.</span>
      </div>
      <div style={{
        display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
        opacity: ease(frame, 0, 1, 35, 50), padding: "0 20px",
      }}>
        {["7 squads", "41 agentes", "24h/7dias"].map((b) => (
          <div key={b} style={{
            padding: "8px 18px", borderRadius: 8, background: BLUE_DIM,
            border: `1px solid ${BLUE_GLOW}`, fontFamily: SANS, fontSize: 15, fontWeight: 600, color: BLUE,
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

export const AdPTBR_V5: React.FC = () => {
  const fps = 30;
  const totalFrames = 660; // 22s

  const scenes = [
    { id: "hook",        start: 0,    end: 3.5  },
    { id: "roles",       start: 3.5,  end: 9.0  },
    { id: "alternative", start: 9.0,  end: 14.0 },
    { id: "price",       start: 14.0, end: 19.0 },
    { id: "cta",         start: 19.0, end: 22.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:        <PTBRV5_HookScene />,
    roles:       <PTBRV5_RolesScene />,
    alternative: <PTBRV5_AlternativeScene />,
    price:       <PriceReveal />,
    cta:         <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_ptbr_v5.mp3")} volume={1} />
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
        <Captions words={PTBR_V5_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// AD PTBR V6 — "ChatGPT" (31.0s → 930 frames) — ad_ptbr_v6_transcript.json
// ---------------------------------------------------------------------------
// Scenes:
//  0.0–4.5   hook: "Você ainda usa ChatGPT pra tudo?"
//  4.5–10.0  comparison: genérico vs especialista
// 10.0–17.5  agents: 41 especialistas, Copywriter com Hormozi...
// 17.5–23.5  squad cards
// 23.5–27.5  price reveal
// 27.5–31.0  CTA

const PTBR_V6_WORDS = v6Data.words as TranscriptWord[];

function PTBRV6_HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const op = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 60px" }}>
      <div style={{ opacity: op, transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`, fontFamily: SANS, fontSize: 80, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", color: WHITE, lineHeight: 1.1 }}>
        Você ainda usa
      </div>
      <div style={{ fontFamily: SANS, fontSize: 80, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", color: BLUE, opacity: ease(frame, 0, 1, 10, 22), lineHeight: 1.1 }}>
        ChatGPT pra tudo?
      </div>
      <div style={{ width: ease(frame, 0, 300, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

function PTBRV6_ComparisonScene() {
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
          <span style={{ fontFamily: SANS, fontSize: 16, color: WHITE_DIM, textAlign: "center", lineHeight: 1.4 }}>Um prompt para todo mundo</span>
        </div>

        <div style={{
          flex: 1, background: BLUE_DIM, border: `1px solid ${BLUE_GLOW}`,
          borderRadius: 16, padding: "28px 20px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12, opacity: rightOp,
        }}>
          <span style={{ fontFamily: SANS, fontSize: 16, color: BLUE, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Agentes [IA]</span>
          <span style={{ fontFamily: SANS, fontSize: 44, fontWeight: 800, color: WHITE }}>Especialista</span>
          <span style={{ fontFamily: SANS, fontSize: 16, color: WHITE_DIM, textAlign: "center", lineHeight: 1.4 }}>41 agentes, cada um treinado para uma única coisa</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function PTBRV6_AgentsScene() {
  const frame = useCurrentFrame();

  const roles = [
    { label: "Copywriter", sub: "Framework Hormozi", color: BLUE },
    { label: "Estrategista", sub: "Posicionamento de mercado", color: "#8DC4FF" },
    { label: "Designer", sub: "Identidade visual", color: "#6AADFF" },
    { label: "Gestor de tráfego", sub: "Meta Ads otimizado", color: "#2D7AFF" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "60px 50px" }}>
      <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, color: WHITE, opacity: ease(frame, 0, 1, 0, 12), letterSpacing: "-0.02em" }}>
        41 agentes especializados
      </div>
      <div style={{ fontFamily: SANS, fontSize: 18, color: WHITE_DIM, opacity: ease(frame, 0, 1, 5, 18) }}>
        Cada um treinado para uma única coisa
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
                ATIVO
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function PTBRV6_SquadScene() {
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

export const AdPTBR_V6: React.FC = () => {
  const fps = 30;
  const totalFrames = 930; // 31s

  const scenes = [
    { id: "hook",       start: 0,    end: 4.5  },
    { id: "comparison", start: 4.5,  end: 10.0 },
    { id: "agents",     start: 10.0, end: 17.5 },
    { id: "squads",     start: 17.5, end: 23.5 },
    { id: "price",      start: 23.5, end: 27.5 },
    { id: "cta",        start: 27.5, end: 31.0 },
  ];

  const sceneComponents: Record<string, React.ReactNode> = {
    hook:       <PTBRV6_HookScene />,
    comparison: <PTBRV6_ComparisonScene />,
    agents:     <PTBRV6_AgentsScene />,
    squads:     <PTBRV6_SquadScene />,
    price:      <PriceReveal />,
    cta:        <CTAEnd />,
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />
      <Audio src={staticFile("audio/ad_ptbr_v6.mp3")} volume={1} />
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
        <Captions words={PTBR_V6_WORDS} />
      </Sequence>
    </AbsoluteFill>
  );
};
