import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ---------------------------------------------------------------------------
// Zoom Virtual Background — 1920x1080 looping motion
// REIS [IA] top-right, subtle animated grid + floating glow orbs
// ---------------------------------------------------------------------------

function ease(frame: number, from: number, to: number, start: number, end: number) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

export const ZoomBg: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow-moving glow orbs
  const orb1X = 35 + Math.sin(frame * 0.008) * 12;
  const orb1Y = 55 + Math.cos(frame * 0.006) * 10;
  const orb2X = 70 + Math.cos(frame * 0.007) * 10;
  const orb2Y = 40 + Math.sin(frame * 0.009) * 12;
  const orb3X = 50 + Math.sin(frame * 0.005 + 2) * 15;
  const orb3Y = 75 + Math.cos(frame * 0.007 + 1) * 8;

  // Subtle glow pulse
  const pulse1 = interpolate(Math.sin(frame * 0.015), [-1, 1], [0.06, 0.12]);
  const pulse2 = interpolate(Math.sin(frame * 0.012 + 1), [-1, 1], [0.04, 0.09]);
  const pulse3 = interpolate(Math.sin(frame * 0.018 + 2), [-1, 1], [0.03, 0.07]);

  // Grid slow drift
  const gridOffsetX = Math.sin(frame * 0.003) * 8;
  const gridOffsetY = Math.cos(frame * 0.004) * 6;

  // Logo fade in
  const logoOpacity = ease(frame, 0, 0.75, 0, 45);

  // Tagline fade in
  const tagOpacity = ease(frame, 0, 0.15, 20, 60);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #060818 0%, #0a0e1a 30%, #0c1628 60%, #081020 100%)",
    }}>
      {/* Animated dot grid */}
      <div style={{
        position: "absolute",
        inset: -20,
        backgroundImage: "radial-gradient(rgba(74,144,255,0.07) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
        backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
        maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 0%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 0%, transparent 80%)",
      }} />

      {/* Floating glow orb 1 — blue, left-center */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 500,
        left: `${orb1X}%`,
        top: `${orb1Y}%`,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(74,144,255,${pulse1}) 0%, transparent 65%)`,
        filter: "blur(40px)",
      }} />

      {/* Floating glow orb 2 — lighter blue, right */}
      <div style={{
        position: "absolute",
        width: 500,
        height: 400,
        left: `${orb2X}%`,
        top: `${orb2Y}%`,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(106,173,255,${pulse2}) 0%, transparent 60%)`,
        filter: "blur(50px)",
      }} />

      {/* Floating glow orb 3 — subtle, bottom */}
      <div style={{
        position: "absolute",
        width: 700,
        height: 350,
        left: `${orb3X}%`,
        top: `${orb3Y}%`,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(74,144,255,${pulse3}) 0%, transparent 60%)`,
        filter: "blur(60px)",
      }} />

      {/* Subtle horizontal lines — gives depth */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 119px, rgba(74,144,255,0.02) 119px, rgba(74,144,255,0.02) 120px)",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 75%)",
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
      }} />

      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 900,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(74,144,255,0.2) 50%, transparent)",
      }} />

      {/* Logo — top right */}
      <div style={{
        position: "absolute",
        top: 44,
        right: 56,
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 26,
        fontWeight: 300,
        letterSpacing: "-0.02em",
        color: `rgba(255,255,255,${logoOpacity})`,
        zIndex: 10,
      }}>
        REIS <span style={{ color: `rgba(74,144,255,${logoOpacity + 0.1})` }}>[IA]</span>
      </div>

      {/* Subtle bottom tagline */}
      <div style={{
        position: "absolute",
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: `rgba(255,255,255,${tagOpacity})`,
        zIndex: 10,
      }}>
        reisia.moronireis.com.br
      </div>
    </AbsoluteFill>
  );
};
