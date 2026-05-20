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
import transcriptData from "../../public/captions/agentes-demo-es-transcript.json";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

const allWords = transcriptData.words as TranscriptWord[];

// Scene boundaries derived from Spanish transcript segments (seconds)
// Audio total: 43s
// Seg 0:  0.00–3.78  → hook
// Seg 1:  4.52–8.16  → grid (41 agentes, cada uno entrenado...)
// Seg 2:  8.66–10.20 → grid continued (ya instalados en Cloud Code)
// Seg 3: 10.84–12.56 → site (Necesitas un sitio profesional?)
// Seg 4: 13.56–14.86 → copy (Copi que venda de verdad?)
// Seg 5: 15.68–17.66 → ads (Campaña de anuncios...)
// Seg 6: 18.36–21.22 → strategy (Analisis de competidores...)
// Seg 7: 21.78–23.58 → dev (Una app o software...)
// Seg 8: 24.08–26.78 → montage (Social, diseño, video, branding.)
// Seg 9: 26.78–29.34 → payoff (Tu pides, ellos ejecutan.)
// Segs 10–12: 30.06–38.22 → price (41 agentes por 9 dólares, pago único)
// Seg 13: 39.22–41.36 → install (5 minutos para instalar...)
// Seg 14: 41.96–43.00 → cta (Empieza soy / end)
const SCENES = [
  { id: "hook",     start: 0,     end: 4.5,   segs: [0] },
  { id: "grid",     start: 4.5,   end: 10.5,  segs: [1, 2] },
  { id: "site",     start: 10.5,  end: 13.3,  segs: [3] },
  { id: "copy",     start: 13.3,  end: 15.4,  segs: [4] },
  { id: "ads",      start: 15.4,  end: 18.1,  segs: [5] },
  { id: "strategy", start: 18.1,  end: 21.5,  segs: [6] },
  { id: "dev",      start: 21.5,  end: 23.8,  segs: [7] },
  { id: "montage",  start: 23.8,  end: 26.5,  segs: [8] },
  { id: "payoff",   start: 26.5,  end: 30.0,  segs: [9] },
  { id: "price",    start: 30.0,  end: 39.0,  segs: [10, 11, 12] },
  { id: "install",  start: 39.0,  end: 42.0,  segs: [13] },
  { id: "cta",      start: 42.0,  end: 43.0,  segs: [14] },
] as const;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BLUE = "#4A90FF";
const BLUE_DIM = "rgba(74,144,255,0.15)";
const BLUE_GLOW = "rgba(74,144,255,0.3)";
const WHITE = "#FFFFFF";
const WHITE_DIM = "rgba(255,255,255,0.6)";
const WHITE_MUTED = "rgba(255,255,255,0.35)";
const MONO = "'JetBrains Mono', 'SF Mono', monospace";
const SANS = "'Inter', system-ui, sans-serif";

const HIGHLIGHT_WORDS = new Set([
  "ai", "ia", "41", "agentes", "sitio", "copy", "campaña", "meta",
  "competidores", "app", "software", "social", "diseño", "video",
  "branding", "ejecutan", "pides", "9", "dólares", "único", "instalar",
  "agentesia", "profesional", "estrategia", "posicionamiento", "probados",
  "especialistas",
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

/** Convert seconds to frames */
function s2f(seconds: number, fps: number) {
  return Math.round(seconds * fps);
}

// ---------------------------------------------------------------------------
// Background — dark + dot grid + glow + grain (vertical)
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
// Animated Captions — word-by-word highlight synced to audio
// ---------------------------------------------------------------------------

function Captions() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Group words into display lines (~3 words for vertical)
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
            word.word.toLowerCase().replace(/[.,!?]/g, ""),
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
// Terminal (vertical-optimized)
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
// Scene Components
// ---------------------------------------------------------------------------

function HookScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 60, stiffness: 100 } });
  const opacity = ease(frame, 0, 1, 0, 15);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ opacity, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, fontFamily: SANS, fontSize: 72, fontWeight: 300, textAlign: "center", letterSpacing: "-0.03em" }}>
        <span style={{ color: WHITE }}>AGENTES </span>
        <span style={{ color: BLUE }}>[IA]</span>
      </div>
      <div style={{ width: ease(frame, 0, 300, 8, 25), height: 1, background: `linear-gradient(90deg, transparent, ${BLUE_GLOW}, transparent)` }} />
    </AbsoluteFill>
  );
}

const SQUADS = [
  { name: "Strategy", count: 8, color: "#4A90FF" },
  { name: "Copy", count: 5, color: "#8DC4FF" },
  { name: "Brand", count: 5, color: "#6AADFF" },
  { name: "Design", count: 6, color: "#2D7AFF" },
  { name: "Content", count: 6, color: "#00B4FF" },
  { name: "Growth", count: 7, color: "#3570CC" },
  { name: "Ops", count: 3, color: "#5B9FFF" },
];

function GridScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28, padding: "60px 50px" }}>
      <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 600, color: WHITE, opacity: ease(frame, 0, 1, 0, 10), letterSpacing: "-0.02em" }}>
        7 Squads Especializados
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 960 }}>
        {SQUADS.map((sq, i) => {
          const d = i * 4;
          const s = spring({ frame: frame - d, fps, config: { damping: 80, stiffness: 120 } });
          return (
            <div key={sq.name} style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${sq.color}30`, borderRadius: 10,
              padding: "14px 18px", minWidth: 200, opacity: ease(frame, 0, 1, d, d + 10),
              transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
            }}>
              <div style={{ fontFamily: MONO, fontSize: 12, color: sq.color, letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" as const }}>
                {sq.name}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 700, color: WHITE, marginTop: 4 }}>
                {sq.count} <span style={{ fontSize: 14, color: WHITE_DIM, fontWeight: 400 }}>agentes</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, opacity: ease(frame, 0, 1, 35, 50) }}>
        <span style={{ fontFamily: SANS, fontSize: 64, fontWeight: 800, color: BLUE }}>41</span>
        <span style={{ fontFamily: SANS, fontSize: 20, fontWeight: 400, color: WHITE_DIM }}>agentes listos</span>
      </div>
    </AbsoluteFill>
  );
}

function SiteScene() {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal command='@dev-agent "Landing page para oferta de US$97"' output={["Design system dark mode...", "Hero + secciones + checkout...", "✓ Sitio completo — 12 min"]} typingSpeed={1} badge="DEPLOYED" />
    </AbsoluteFill>
  );
}

function CopyScene() {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal command='@copy-squad "Página Hormozi 4 ángulos"' output={["Copywriter → Humanizer → Reviewer...", '✓ "Deja de explicar. Empieza a facturar."']} typingSpeed={1} badge="APPROVED" badgeColor={BLUE} />
    </AbsoluteFill>
  );
}

function AdsScene() {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal command='@traffic-manager "Campaña tráfico frío US$9/día"' output={["3 ad sets segmentados...", "Creativos uploaded...", "✓ Campaña creada"]} typingSpeed={1} badge="PAUSED" badgeColor="#eab308" />
    </AbsoluteFill>
  );
}

function StrategyScene() {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal command='@market-research "Top 3 competidores"' output={["Posicionamiento mapeado...", "Precios y canales analizados...", "✓ 5 gaps identificados"]} typingSpeed={1} badge="REPORT READY" />
    </AbsoluteFill>
  );
}

function DevScene() {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <Terminal command='@integration-engineer "Webhook leads"' output={["Endpoint + RLS + notificación...", "✓ Pipeline activo"]} typingSpeed={1} badge="DEPLOYED" />
    </AbsoluteFill>
  );
}

function MontageScene() {
  const frame = useCurrentFrame();
  const caps = ["Social Media", "Design System", "Video Editing", "Branding", "Email Sequences", "Funnels"];
  const active = Math.floor(frame / 15) % caps.length;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 50px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 900 }}>
        {caps.map((c, i) => {
          const isOn = i === active;
          return (
            <div key={c} style={{
              background: isOn ? "rgba(74,144,255,0.1)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isOn ? BLUE_GLOW : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10, padding: "20px 18px", textAlign: "center",
              opacity: ease(frame, 0, isOn ? 1 : 0.5, i * 6, i * 6 + 10),
              transform: `scale(${isOn ? 1.04 : 1})`,
            }}>
              <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: isOn ? BLUE : WHITE_DIM }}>{c}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function PayoffScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 15, fps, config: { damping: 50, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
      <div style={{
        fontFamily: SANS, fontSize: 56, fontWeight: 700, color: WHITE, textAlign: "center",
        opacity: ease(frame, 0, 1, 0, 15), letterSpacing: "-0.03em",
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
      }}>
        Tu pides.
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 56, fontWeight: 700, color: BLUE, textAlign: "center",
        opacity: ease(frame, 0, 1, 20, 35), letterSpacing: "-0.03em",
      }}>
        Ellos ejecutan.
      </div>
    </AbsoluteFill>
  );
}

function PriceScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const strikeW = ease(frame, 0, 100, 30, 50);
  const newOp = ease(frame, 0, 1, 55, 70);
  const newScale = spring({ frame: frame - 55, fps, config: { damping: 40, stiffness: 80 } });
  const badgeOp = ease(frame, 0, 1, 120, 140);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 400, color: WHITE_DIM, opacity: ease(frame, 0, 1, 0, 10) }}>
        Equipo completo costaría
      </div>

      <div style={{ position: "relative", opacity: ease(frame, 0, 1, 5, 18) }}>
        <span style={{ fontFamily: SANS, fontSize: 48, fontWeight: 300, color: "rgba(255,80,80,0.6)" }}>US$4,000/mes</span>
        <div style={{ position: "absolute", top: "50%", left: 0, width: `${strikeW}%`, height: 3, background: "rgba(255,80,80,0.7)", transform: "translateY(-50%)" }} />
      </div>

      <div style={{ opacity: newOp, transform: `scale(${interpolate(newScale, [0, 1], [0.7, 1])})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: SANS, fontSize: 88, fontWeight: 800, color: WHITE, letterSpacing: "-0.04em" }}>US$9</span>
        <span style={{ fontFamily: SANS, fontSize: 20, fontWeight: 500, color: BLUE }}>pago único, sin mensualidad</span>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 16, opacity: badgeOp, flexWrap: "wrap", justifyContent: "center", padding: "0 40px" }}>
        {["41 agentes", "7 squads", "4 videotutoriales", "Garantía 7 días"].map((b) => (
          <div key={b} style={{
            padding: "8px 16px", borderRadius: 8, background: BLUE_DIM,
            border: `1px solid ${BLUE_GLOW}`, fontFamily: SANS, fontSize: 13, fontWeight: 500, color: WHITE_DIM,
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function InstallScene() {
  const frame = useCurrentFrame();
  const pct = ease(frame, 0, 100, 20, 80);
  const doneOp = ease(frame, 0, 1, 85, 100);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <div style={{
        width: 940, background: "rgba(10,10,10,0.95)", borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden",
        boxShadow: "0 0 60px rgba(74,144,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ padding: "24px 24px" }}>
          <div style={{ fontFamily: MONO, fontSize: 18, color: WHITE }}>
            <span style={{ color: BLUE }}>&gt;</span> claude install agentes-ia
          </div>
          <div style={{ marginTop: 20, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${BLUE}, #00B4FF)`, borderRadius: 3 }} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 14, color: WHITE_MUTED, marginTop: 12 }}>
            {pct < 100 ? `Instalando... ${Math.floor(pct)}%` : ""}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 18, color: "#22c55e", marginTop: 12, opacity: doneOp }}>
            ✓ 41 agentes instalados — 7 squads
          </div>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8, opacity: ease(frame, 0, 1, 105, 120) }}>
            {SQUADS.map((sq) => (
              <div key={sq.name} style={{
                padding: "5px 12px", borderRadius: 6, background: `${sq.color}15`, border: `1px solid ${sq.color}30`,
                fontFamily: MONO, fontSize: 11, color: sq.color, fontWeight: 600,
              }}>{sq.name} ({sq.count})</div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function CTAScene() {
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
// Main Composition
// ---------------------------------------------------------------------------

const SCENE_MAP: Record<string, React.ReactNode> = {
  hook: <HookScene />,
  grid: <GridScene />,
  site: <SiteScene />,
  copy: <CopyScene />,
  ads: <AdsScene />,
  strategy: <StrategyScene />,
  dev: <DevScene />,
  montage: <MontageScene />,
  payoff: <PayoffScene />,
  price: <PriceScene />,
  install: <InstallScene />,
  cta: <CTAScene />,
};

export const AgentesDemoES: React.FC = () => {
  const fps = 30;
  const totalDuration = 43; // seconds — matches Spanish audio
  const totalFrames = totalDuration * fps;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Background />

      {/* Audio — Spanish voiceover */}
      <Audio src={staticFile("audio/agentes-demo-es-vo.mp3")} volume={1} />

      {/* Scenes synced to Spanish transcript timestamps */}
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

      {/* Captions overlay — always on top, synced to audio */}
      <Sequence from={0} durationInFrames={totalFrames}>
        <Captions />
      </Sequence>
    </AbsoluteFill>
  );
};
