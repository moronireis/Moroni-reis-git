'use client';
import { useRef, useEffect, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  brightness: number;
  baseOpacity: number;
}

interface Props {
  nodeCount?: number;
  gridColor?: string;
  accentColor?: string;
  className?: string;
}

export default function CyberGridHero({
  nodeCount = 18,
  gridColor = 'rgba(230, 57, 70, 0.04)',
  accentColor = '#e63946',
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

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const nodes: Node[] = [];
    let pulseRadius = 0;
    let pulseOpacity = 0;
    let lastPulse = 0;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // 30fps

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 2 + 1,
          brightness: 0,
          baseOpacity: Math.random() * 0.3 + 0.15,
        });
      }
    }

    function drawGrid() {
      // Horizontal perspective lines
      const horizLines = 12;
      const vanishY = height * 0.35;
      const vanishX = width * 0.5;

      ctx!.strokeStyle = gridColor;
      ctx!.lineWidth = 1;

      // Horizontal lines with perspective spacing (closer at top, wider at bottom)
      for (let i = 0; i <= horizLines; i++) {
        const t = i / horizLines;
        const y = vanishY + (height - vanishY) * (t * t); // quadratic spacing for perspective
        const spreadFactor = t * 1.5;
        const x1 = vanishX - (width * 0.6 * spreadFactor);
        const x2 = vanishX + (width * 0.6 * spreadFactor);

        ctx!.beginPath();
        ctx!.moveTo(x1, y);
        ctx!.lineTo(x2, y);
        ctx!.stroke();
      }

      // Vertical converging lines
      const vertLines = 16;
      for (let i = 0; i <= vertLines; i++) {
        const t = i / vertLines;
        const bottomX = width * t;

        ctx!.beginPath();
        ctx!.moveTo(vanishX, vanishY);
        ctx!.lineTo(bottomX, height + 20);
        ctx!.stroke();
      }

      // Subtle top glow at vanishing point
      const glow = ctx!.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, 200);
      glow.addColorStop(0, 'rgba(230, 57, 70, 0.06)');
      glow.addColorStop(1, 'transparent');
      ctx!.fillStyle = glow;
      ctx!.fillRect(vanishX - 200, vanishY - 200, 400, 400);
    }

    function drawNodes(_time: number) {
      const connectionDist = 160;

      // Update + draw connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;

        // Wrap around
        if (a.x < -20) a.x = width + 20;
        if (a.x > width + 20) a.x = -20;
        if (a.y < -20) a.y = height + 20;
        if (a.y > height + 20) a.y = -20;

        // Decay brightness from pulse
        a.brightness *= 0.96;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.12;
            const boost = Math.max(a.brightness, b.brightness);
            ctx!.strokeStyle = `rgba(230, 57, 70, ${opacity + boost * 0.3})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Draw node dots
      for (const node of nodes) {
        const opacity = node.baseOpacity + node.brightness * 0.6;
        const r = node.radius + node.brightness * 2;

        // Outer glow
        if (node.brightness > 0.1) {
          const glow = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 6);
          glow.addColorStop(0, `rgba(230, 57, 70, ${node.brightness * 0.2})`);
          glow.addColorStop(1, 'transparent');
          ctx!.fillStyle = glow;
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, r * 6, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Core dot
        ctx!.fillStyle = `rgba(230, 57, 70, ${opacity})`;
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function drawPulse(time: number) {
      // Trigger pulse every 4 seconds
      if (time - lastPulse > 4000) {
        lastPulse = time;
        pulseRadius = 0;
        pulseOpacity = 0.25;
      }

      if (pulseOpacity > 0.01) {
        pulseRadius += 3;
        pulseOpacity *= 0.985;

        const cx = width * 0.5;
        const cy = height * 0.4;

        // Draw pulse ring
        ctx!.strokeStyle = `rgba(230, 57, 70, ${pulseOpacity})`;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
        ctx!.stroke();

        // Light up nodes the pulse passes through
        for (const node of nodes) {
          const dx = node.x - cx;
          const dy = node.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - pulseRadius) < 30) {
            node.brightness = Math.min(node.brightness + 0.3, 1);
          }
        }
      }
    }

    function animate(time: number) {
      // Throttle to 30fps
      if (time - lastFrame < FRAME_INTERVAL) {
        animId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = time;

      ctx!.clearRect(0, 0, width, height);
      drawGrid();
      drawNodes(time);
      drawPulse(time);

      animId = requestAnimationFrame(animate);
    }

    resize();
    initNodes();
    animId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => { resize(); initNodes(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [nodeCount, gridColor, accentColor, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${className}`}
        style={{
          background: `
            radial-gradient(ellipse at 50% 35%, rgba(230,57,70,0.06), transparent 50%),
            linear-gradient(180deg, transparent 30%, rgba(230,57,70,0.02) 100%)
          `,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
