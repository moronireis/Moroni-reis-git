'use client';
import { lazy, Suspense, useEffect, useState } from 'react';

// Dynamically import to avoid SSR issues
const ShaderGradientCanvas = lazy(() =>
  import('shadergradient').then((mod) => ({ default: mod.ShaderGradientCanvas }))
);
const ShaderGradient = lazy(() =>
  import('shadergradient').then((mod) => ({ default: mod.ShaderGradient }))
);

interface Props {
  colors?: [string, string, string];
  speed?: number;
  grain?: 'on' | 'off';
  className?: string;
}

export default function ShaderGradientHero({
  colors = ['#e63946', '#0a0a0a', '#1a1a2e'],
  speed = 0.4,
  grain = 'on',
  className = '',
}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!mounted || reducedMotion) {
    return (
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${className}`}
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${colors[0]}15, transparent 60%), radial-gradient(ellipse at 70% 50%, ${colors[2]}10, transparent 60%), ${colors[1]}`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <Suspense
        fallback={
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: colors[1],
            }}
          />
        }
      >
        <ShaderGradientCanvas
          style={{ position: 'absolute', inset: 0 }}
          pointerEvents="none"
        >
          <ShaderGradient
            type="waterPlane"
            animate="on"
            uTime={0}
            uSpeed={speed}
            uStrength={1.5}
            uDensity={1.2}
            uFrequency={5.5}
            uAmplitude={3}
            positionX={-0.5}
            positionY={0.1}
            positionZ={0}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            color1={colors[0]}
            color2={colors[1]}
            color3={colors[2]}
            reflection={0.1}
            wireframe={false}
            shader="defaults"
            grain={grain}
            lightType="3d"
            brightness={1.2}
            envPreset="city"
            cAzimuthAngle={180}
            cPolarAngle={115}
            cDistance={3.9}
            cameraZoom={1}
          />
        </ShaderGradientCanvas>
      </Suspense>
    </div>
  );
}
