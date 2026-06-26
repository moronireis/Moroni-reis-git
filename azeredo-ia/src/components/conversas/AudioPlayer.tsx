import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string | null;
  mime?: string | null;
  outbound?: boolean;
}

const BAR_COUNT = 52;

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Deterministic waveform heights from URL hash — bell-curve shaped */
function buildBars(src: string): number[] {
  const seed = hashStr(src);
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const bell = Math.sin((i / (BAR_COUNT - 1)) * Math.PI);
    const noise = Math.abs(Math.sin(seed * (i + 1) * 0.4271 + i)) * 0.6;
    return 0.15 + bell * 0.55 + noise * 0.3;
  });
}

export default function AudioPlayer({ src, mime, outbound = false }: Props) {
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const canvasRef   = useRef<HTMLCanvasElement | null>(null);
  const rafRef      = useRef<number>(0);
  const [playing, setPlaying]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const bars = src ? buildBars(src) : Array(BAR_COUNT).fill(0.3);

  // Colors
  const filled   = outbound ? 'rgba(37,211,102,0.9)'  : 'rgba(96,165,250,0.9)';
  const playhead = outbound ? 'rgba(77,224,140,0.7)'  : 'rgba(147,197,253,0.7)';
  const unfilled = 'rgba(255,255,255,0.18)';

  const draw = () => {
    const canvas = canvasRef.current;
    const audio  = audioRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const progress = audio && duration > 0 ? audio.currentTime / duration : 0;
    const barW = W / BAR_COUNT;
    bars.forEach((h, i) => {
      const x       = i * barW + barW * 0.15;
      const bw      = barW * 0.7;
      const bh      = Math.max(3, h * H * 0.8);
      const by      = (H - bh) / 2;
      const isPlayed = i / BAR_COUNT < progress;
      ctx.fillStyle = isPlayed ? filled : unfilled;
      ctx.beginPath();
      ctx.roundRect(x, by, bw, bh, 2);
      ctx.fill();
    });
    // Playhead
    if (progress > 0 && progress < 1) {
      const px = progress * W;
      ctx.fillStyle = playhead;
      ctx.beginPath();
      ctx.arc(px, H / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const tick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setElapsed(audio.currentTime);
    draw();
    if (!audio.paused) rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  });

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => { setPlaying(true); rafRef.current = requestAnimationFrame(tick); }).catch(() => setLoadError(true));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas || !duration) return;
    const rect = canvas.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
    draw();
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!src) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', color: '#6b7a72', fontSize: 12 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        Áudio indisponível
      </div>
    );
  }

  if (loadError) {
    return (
      <a href={src} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Abrir áudio
      </a>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200, maxWidth: 260 }}>
      {/* Hidden audio element with multiple source fallbacks */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => { setPlaying(false); setElapsed(0); draw(); }}
        onError={() => setLoadError(true)}
      >
        {mime && <source src={src} type={mime} />}
        <source src={src} type="audio/ogg" />
        <source src={src} type="audio/mpeg" />
        <source src={src} type="audio/mp4" />
      </audio>

      {/* Play/Pause button */}
      <button
        onClick={toggle}
        style={{
          width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
          background: outbound ? 'rgba(37,211,102,0.2)' : 'rgba(96,165,250,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: playing ? `0 0 0 3px ${outbound ? 'rgba(37,211,102,0.2)' : 'rgba(96,165,250,0.2)'}` : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={outbound ? '#25D366' : '#60a5fa'}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={outbound ? '#25D366' : '#60a5fa'}><polygon points="5 3 19 12 5 21 5 3"/></svg>
        )}
      </button>

      {/* Waveform canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <canvas
          ref={canvasRef}
          width={180} height={36}
          onClick={seek}
          style={{ cursor: 'pointer', width: '100%', height: 36 }}
        />
        <div style={{ fontSize: 10, color: outbound ? 'rgba(37,211,102,0.7)' : 'rgba(96,165,250,0.7)', textAlign: 'right' }}>
          {playing ? fmt(elapsed) : fmt(duration)}
        </div>
      </div>
    </div>
  );
}
