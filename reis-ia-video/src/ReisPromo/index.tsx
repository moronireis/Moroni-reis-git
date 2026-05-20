import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ---------------------------------------------------------------------------
// Hero phrases — exactly matching reisia.moronireis.com.br
// ---------------------------------------------------------------------------

const PHRASES = [
  { text: "Aumente suas vendas", icon: "chart" },
  { text: "Encante clientes", icon: "star" },
  { text: "Atraia mais leads", icon: "users" },
  { text: "Diminua seus custos", icon: "dollar" },
  { text: "Aumente sua eficiência", icon: "bolt" },
] as const;

type IconType = typeof PHRASES[number]["icon"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ease(frame: number, from: number, to: number, start: number, end: number) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function easeIn(frame: number, from: number, to: number, start: number, end: number) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
}

// ---------------------------------------------------------------------------
// Icon SVGs (matching the site)
// ---------------------------------------------------------------------------

function HeroIcon({ type, size = 48 }: { type: IconType; size?: number }) {
  const stroke = "rgba(106,173,255,0.8)";
  const sw = "1.5";
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (type) {
    case "chart":
      return <svg {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
    case "star":
      return <svg {...props} fill="rgba(74,144,255,0.06)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case "users":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
    case "dollar":
      return <svg {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
    case "bolt":
      return <svg {...props} fill="rgba(74,144,255,0.06)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  }
}

// ---------------------------------------------------------------------------
// Background — radial gradient + dot grid + glow (matching hero)
// ---------------------------------------------------------------------------

function Background() {
  const frame = useCurrentFrame();
  const glowPulse = interpolate(Math.sin(frame * 0.025), [-1, 1], [0.06, 0.14]);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(50% 50% at 50% 100%, #0a1a3a 0%, #000000 100%)" }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(74,144,255,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 70%)",
      }} />
      {/* Center glow */}
      <div style={{
        position: "absolute", width: 800, height: 800,
        top: "45%", left: "50%", transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(74,144,255,${glowPulse}) 0%, transparent 65%)`,
      }} />
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(74,144,255,0.3) 50%, transparent)",
      }} />
      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
      }} />
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Single phrase scene — icon + text + "com a REIS [IA]"
// ---------------------------------------------------------------------------

function PhraseScene({ phrase, icon }: { phrase: string; icon: IconType }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = 2.2 * fps;

  // Smooth crossfade enter (0-15 frames)
  const enterOpacity = ease(frame, 0, 1, 0, 15);
  const enterY = ease(frame, 24, 0, 0, 18);

  // Smooth crossfade exit (last 10 frames)
  const exitStart = totalFrames - 10;
  const exitOpacity = easeIn(frame, 1, 0, exitStart, totalFrames);
  const exitY = easeIn(frame, 0, -16, exitStart, totalFrames);

  const opacity = frame < exitStart ? enterOpacity : exitOpacity;
  const y = frame < exitStart ? enterY : exitY;

  // Icon glow pulse
  const glowScale = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.85, 1.15]);

  // Icon spring — gentle
  const iconScale = spring({ frame, fps, config: { damping: 80, stiffness: 80 } });

  return (
    <AbsoluteFill style={{
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: 28,
    }}>
      {/* Icon with glow */}
      <div style={{
        position: "relative",
        width: 80, height: 80,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity,
        transform: `translateY(${y}px) scale(${iconScale})`,
      }}>
        <div style={{
          position: "absolute", inset: -20, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(74,144,255,0.15) 0%, transparent 70%)`,
          transform: `scale(${glowScale})`,
        }} />
        <div style={{
          position: "absolute", inset: -40, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(74,144,255,0.06) 0%, transparent 70%)`,
          transform: `scale(${glowScale * 0.9})`,
        }} />
        <HeroIcon type={icon} size={48} />
      </div>

      {/* Phrase text only — no "com a REIS [IA]" */}
      <div style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 72,
        fontWeight: 500,
        letterSpacing: "-0.04em",
        lineHeight: 1.15,
        color: "#fff",
        textAlign: "center",
        opacity,
        transform: `translateY(${y}px)`,
        padding: "0 60px",
      }}>
        {phrase}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Badge scene — "ECOSSISTEMA DE IA PARA NEGÓCIOS"
// ---------------------------------------------------------------------------

function BadgeIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 80, stiffness: 100 } });
  const opacity = ease(frame, 0, 1, 0, 15);
  const scale = interpolate(s, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}>
      {/* Badge */}
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "14px 32px",
        borderRadius: 6,
        border: "1px solid rgba(74,144,255,0.25)",
        background: "rgba(74,144,255,0.06)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "0.15em",
        color: "#4A90FF",
        textTransform: "uppercase" as const,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A90FF" }} />
        ECOSSISTEMA DE IA PARA NEGÓCIOS
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Subtitle + CTA scene
// ---------------------------------------------------------------------------

function ClosingScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "com a REIS [IA]" — enters first
  const brandOpacity = ease(frame, 0, 1, 0, 18);
  const brandY = ease(frame, 20, 0, 0, 18);

  // Subtitle — enters after
  const subDelay = 15;
  const subOpacity = ease(frame, 0, 1, subDelay, subDelay + 15);

  // CTA — enters last
  const ctaDelay = 30;
  const ctaS = spring({ frame: frame - ctaDelay, fps, config: { damping: 60, stiffness: 100 } });
  const ctaOpacity = ease(frame, 0, 1, ctaDelay, ctaDelay + 12);
  const ctaScale = interpolate(ctaS, [0, 1], [0.85, 1]);

  // Shimmer sweep position
  const shimmerX = interpolate((frame - ctaDelay) % 105, [0, 105], [-100, 200], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 32 }}>
      {/* "com a REIS [IA]" */}
      <div style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 72,
        fontWeight: 500,
        letterSpacing: "-0.04em",
        lineHeight: 1.15,
        textAlign: "center",
        opacity: brandOpacity,
        transform: `translateY(${brandY}px)`,
      }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>com a </span>
        <span style={{ color: "#fff", fontWeight: 300 }}>REIS </span>
        <span style={{ color: "#4A90FF", fontWeight: 300 }}>[IA]</span>
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 28,
        fontWeight: 400,
        lineHeight: 1.55,
        color: "rgba(255,255,255,0.5)",
        textAlign: "center",
        maxWidth: 700,
        opacity: subOpacity,
        padding: "0 60px",
      }}>
        Marketing, vendas, educação e IA para empresários que querem resultados reais no caixa.
      </div>

      {/* CTA pill — glass style matching site hero */}
      <div style={{
        opacity: ctaOpacity,
        transform: `scale(${ctaScale})`,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "18px 34px 18px 38px",
        borderRadius: 200,
        background: "linear-gradient(135deg, rgba(74,144,255,0.15) 0%, rgba(74,144,255,0.06) 100%)",
        border: "1px solid rgba(74,144,255,0.3)",
        boxShadow: "0 0 24px rgba(74,144,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 22,
        fontWeight: 500,
        color: "#fff",
        letterSpacing: "0.01em",
        overflow: "hidden",
      }}>
        {/* Shimmer sweep */}
        <div style={{
          position: "absolute",
          top: 0, left: `${shimmerX}%`,
          width: "70%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          pointerEvents: "none",
        }} />
        <span style={{ position: "relative", zIndex: 1 }}>Agendar diagnóstico</span>
        <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", color: "#4A90FF" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Main composition — 15s hero showcase
// ---------------------------------------------------------------------------

export const ReisPromo: React.FC = () => {
  const fps = 30;

  // Timing: badge(1.2s) + 5 phrases(2s each = 10s) + closing(3.8s) = 15s
  const badgeFrames = Math.round(1.2 * fps);       // 36
  const phraseFrames = Math.round(2 * fps);        // 60 each
  const closingFrames = Math.round(3.8 * fps);     // 114

  let offset = 0;

  return (
    <AbsoluteFill>
      <Background />

      {/* Badge intro */}
      <Sequence from={offset} durationInFrames={badgeFrames}>
        <BadgeIntro />
      </Sequence>
      {(offset += badgeFrames)}

      {/* 5 rotating phrases — just the phrase + icon, fluid transitions */}
      {PHRASES.map((p, i) => {
        const from = offset + i * phraseFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={phraseFrames}>
            <PhraseScene phrase={p.text} icon={p.icon} />
          </Sequence>
        );
      })}
      {(offset += PHRASES.length * phraseFrames)}

      {/* Closing: "com a REIS [IA]" + subtitle + CTA */}
      <Sequence from={offset} durationInFrames={closingFrames}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
