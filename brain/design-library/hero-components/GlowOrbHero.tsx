'use client';
import { useRef, useEffect, useState } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  phase: number;
}

interface Props {
  colors?: string[];
  orbCount?: number;
  blurAmount?: number;
  className?: string;
}

export default function GlowOrbHero({
  colors = ['#e63946', '#1a1a3e', '#e6394640'],
  orbCount = 4,
  blurAmount = 80,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const orbs: Orb[] = [];

    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * window.devicePixelRatio;
      canvas!.height = height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function initOrbs() {
      orbs.length = 0;
      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 200 + 100,
          color: colors[i % colors.length],
          opacity: Math.random() * 0.3 + 0.15,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function hexToRgba(hex: string, alpha: number): string {
      // Handle shorthand hex (#abc) and full hex (#aabbcc), with optional alpha (#aabbccdd)
      const clean = hex.replace('#', '');
      if (clean.length === 3) {
        const r = parseInt(clean[0] + clean[0], 16);
        const g = parseInt(clean[1] + clean[1], 16);
        const b = parseInt(clean[2] + clean[2], 16);
        return `rgba(${r},${g},${b},${alpha})`;
      }
      if (clean.length >= 6) {
        const r = parseInt(clean.slice(0, 2), 16);
        const g = parseInt(clean.slice(2, 4), 16);
        const b = parseInt(clean.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha})`;
      }
      return `rgba(255,255,255,${alpha})`;
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);

      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Wrap around edges
        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        // Pulsing opacity
        const pulse = Math.sin(time * 0.001 + orb.phase) * 0.1 + orb.opacity;
        const clampedPulse = Math.max(0, Math.min(1, pulse));

        const gradient = ctx!.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, hexToRgba(orb.color, clampedPulse));
        gradient.addColorStop(1, hexToRgba(orb.color, 0));

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    initOrbs();
    animationId = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initOrbs();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [colors, orbCount, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${className}`}
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${colors[0]}18, transparent 50%), radial-gradient(ellipse at 70% 60%, ${colors[1] || colors[0]}10, transparent 50%)`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ filter: `blur(${blurAmount}px)`, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
