import { useState, useEffect, useRef } from 'react';

interface NumberItem {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  isRed?: boolean;
  isPending?: boolean;
  pendingHint?: string;
}

const numbers: NumberItem[] = [
  { value: 2000, suffix: '', label: 'Câmeras monitoradas' },
  {
    value: 0,
    suffix: '',
    label: 'Clientes ativos',
    isPending: true,
    pendingHint: 'confirmar com cliente'
  },
  { value: 0, prefix: 'R$', suffix: '', label: 'Custo da primeira consultoria', isRed: true },
  { value: 150, suffix: 'TB', label: 'Em nuvem 24h por dia' },
];

function useCountUp(target: number, duration: number, shouldStart: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    if (target === 0) { setCount(0); return; }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, shouldStart]);

  return count;
}

function NumberCard({ item, shouldAnimate }: { item: NumberItem; shouldAnimate: boolean }) {
  const count = useCountUp(item.value, 2000, shouldAnimate);
  const displayValue = item.value === 0 ? '0' : count.toLocaleString('pt-BR');

  if (item.isPending) {
    return (
      <div className="text-center group">
        <div
          className="text-2xl sm:text-4xl md:text-5xl font-light mb-3"
          style={{ color: 'rgba(230,57,70,0.3)', letterSpacing: '0.02em' }}
        >
          —
        </div>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(230,57,70,0.5)' }}>
          {item.label}
        </div>
        {item.pendingHint && (
          <div style={{ fontSize: '0.6rem', color: 'rgba(160,160,160,0.4)', fontStyle: 'italic', marginTop: '2px' }}>
            [{item.pendingHint}]
          </div>
        )}
        <div className="h-0.5 mx-auto mt-4" style={{ width: '2rem', backgroundColor: 'rgba(230,57,70,0.15)' }} />
      </div>
    );
  }

  return (
    <div className="text-center group">
      <div
        className="text-2xl sm:text-4xl md:text-5xl font-light mb-3 transition-all duration-500"
        style={{ color: item.isRed ? '#e63946' : '#ffffff' }}
      >
        {item.prefix && <span style={{ color: '#e63946' }}>{item.prefix}</span>}
        {displayValue}
        {item.suffix && <span className="text-2xl" style={{ color: '#e63946' }}>{item.suffix}</span>}
      </div>
      <div className="text-xs uppercase tracking-widest" style={{ color: '#a0a0a0' }}>
        {item.label}
      </div>
      <div
        className="h-0.5 mx-auto mt-4 transition-all duration-700"
        style={{
          width: shouldAnimate ? '3rem' : '0',
          backgroundColor: 'rgba(230, 57, 70, 0.4)',
        }}
      />
    </div>
  );
}

export default function AnimatedNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
      {numbers.map((item, i) => (
        <div
          key={i}
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: `${i * 150}ms`,
          }}
        >
          <NumberCard item={item} shouldAnimate={isVisible} />
        </div>
      ))}
    </div>
  );
}
