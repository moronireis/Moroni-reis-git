'use client';
import { useEffect, useState, useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

interface Props {
  color?: string;
  particleCount?: number;
  linkDistance?: number;
  className?: string;
}

export default function ParticleFieldHero({
  color = '#e63946',
  particleCount = 60,
  linkDistance = 150,
  className = '',
}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  if (!mounted || reducedMotion) {
    return (
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${className}`}
        style={{ background: '#0a0a0a' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <Particles
        id="hero-particles"
        init={init}
        options={{
          fullScreen: false,
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: color },
            links: {
              color: color,
              distance: linkDistance,
              enable: true,
              opacity: 0.12,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.6,
              direction: 'none',
              outModes: { default: 'bounce' },
            },
            number: {
              value: particleCount,
              density: { enable: true, width: 1200, height: 800 },
            },
            opacity: {
              value: { min: 0.1, max: 0.4 },
              animation: { enable: true, speed: 0.5, sync: false },
            },
            shape: { type: 'circle' },
            size: {
              value: { min: 1, max: 2.5 },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
            },
            modes: {
              grab: { distance: 180, links: { opacity: 0.25 } },
            },
          },
          detectRetina: true,
        }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
