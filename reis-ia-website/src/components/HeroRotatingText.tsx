import { useState, useEffect } from 'react';

interface HeroItem {
  phrase: string;
  icon: React.ReactNode;
}

const IC = 'rgba(106,173,255,0.55)';
const S = { stroke: IC, strokeWidth: '1.3', fill: 'none' } as const;
const SF = { ...S, fill: 'rgba(74,144,255,0.04)' } as const;

const items: HeroItem[] = [
  {
    phrase: 'Aumente suas vendas',
    icon: (
      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...S}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    phrase: 'Encante clientes',
    icon: (
      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...SF}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    phrase: 'Atraia mais leads',
    icon: (
      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...S}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
  },
  {
    phrase: 'Diminua seus custos',
    icon: (
      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...S}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    phrase: 'Aumente sua eficiência',
    icon: (
      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...SF}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const INTERVAL = 3200;

export default function HeroRotatingText() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setAnimate(true);
      }, 400);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current = items[index];
  const animClass = animate ? 'hero-rotating-in' : 'hero-rotating-out';

  return (
    <div
      className="hero-rotating-container"
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease' }}
    >
      {/* Icon with glow */}
      <div className={`hero-float hero-icon-wrap ${animClass}`}>
        <div className="hero-glow-pulse hero-glow-inner" />
        <div className="hero-glow-pulse-slow hero-glow-outer" />
        <div className="hero-icon-svg">{current.icon}</div>
      </div>

      {/* Rotating phrase */}
      <span className={`hero-rotating-word hero-phrase ${animClass}`}>
        {current.phrase}
      </span>

      {/* com a REIS [IA] */}
      <span className="hero-brand-line">
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>com a</span>
        {' '}
        <span className="hero-brand-reis" style={{ fontWeight: 300 }}>REIS</span>
        {' '}
        <span className="hero-brand-gradient" style={{ fontWeight: 300 }}>[IA]</span>
      </span>
    </div>
  );
}
