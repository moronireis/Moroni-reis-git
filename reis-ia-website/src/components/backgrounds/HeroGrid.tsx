import { useRef, useEffect, useState } from 'react';

export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, rafId = 0;
    const mouse = { x: -9999, y: -9999 };
    const SP = 48, BR = 1.2, REPEL = 200;
    let dots: { x: number; y: number; offX: number; offY: number }[] = [];

    function resize() {
      w = container!.offsetWidth;
      h = container!.offsetHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.scale(dpr, dpr);
      dots = [];
      for (let y = SP / 2; y < h; y += SP)
        for (let x = SP / 2; x < w; x += SP)
          dots.push({ x, y, offX: 0, offY: 0 });
    }

    resize();

    const onMove = (e: MouseEvent) => {
      const r = container!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave);

    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(container);

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const hm = mouse.x > -1000;
      for (const d of dots) {
        let tox = 0, toy = 0;
        if (hm) {
          const dx = d.x - mouse.x, dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL && dist > 0) {
            const f = 1 - dist / REPEL;
            const e = f * f;
            tox = (dx / dist) * e * 25;
            toy = (dy / dist) * e * 25;
          }
        }
        d.offX += (tox - d.offX) * 0.06;
        d.offY += (toy - d.offY) * 0.06;
        const cDist = Math.hypot(d.x - w/2, d.y - h/2);
        const cMax = Math.hypot(w/2, h/2);
        const cFade = 1 - Math.min(cDist / (cMax * 0.7), 1);
        const baseA = 0.12 * cFade + 0.03;
        const repelA = Math.hypot(d.offX, d.offY) > 0.5 ? Math.min(baseA + 0.15, 0.35) : baseA;
        ctx!.fillStyle = `rgba(74,144,255,${repelA})`;
        ctx!.beginPath();
        ctx!.arc(d.x + d.offX, d.y + d.offY, BR, 0, Math.PI * 2);
        ctx!.fill();
      }
      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  }, [mounted]);

  if (!mounted) return <div style={{ position: 'absolute', inset: 0 }} />;

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {/* Primary center glow */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(74,144,255,0.12) 0%, rgba(74,144,255,0.04) 40%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      {/* Secondary top-right orb */}
      <div className="hero-orb-float" style={{ position: 'absolute', top: '10%', right: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(74,144,255,0.08) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      {/* Tertiary bottom-left orb */}
      <div className="hero-orb-float-reverse" style={{ position: 'absolute', bottom: '15%', left: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(45,122,255,0.06) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
    </div>
  );
}
