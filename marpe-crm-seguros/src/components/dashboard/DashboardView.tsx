import { useState, useEffect } from 'react';

interface Stats {
  totalContacts: number;
  totalDeals: number;
  totalPremio: number;
  totalComissao: number;
  ramoBreakdown: Record<string, number>;
  dealTypeBreakdown: Record<string, number>;
}

function formatK(n: number): string {
  if (n >= 1000000) return `R$ ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `R$ ${(n / 1000).toFixed(0)}K`;
  return `R$ ${n.toFixed(0)}`;
}

const DEAL_TYPE_LABELS: Record<string, string> = {
  prospeccao: 'Prospecção',
  renovacao: 'Renovação',
};

const RAMO_COLORS: Record<string, string> = {
  auto: 'var(--accent)', vida: 'var(--purple)', residencial: 'var(--green)',
  empresarial: 'var(--amber)', equipamento: 'var(--cyan)', vgrp: 'var(--purple)',
  fina: 'var(--red)', rcge: 'var(--amber)',
};

export default function DashboardView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '24px 32px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Carregando dados reais da Marpe...</p>
    </div>
  );

  if (!stats) return (
    <div style={{ padding: '24px 32px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: 'var(--red)', marginTop: 8 }}>Erro ao carregar dados.</p>
    </div>
  );

  const kpis = [
    { label: 'Clientes na carteira', value: stats.totalContacts.toLocaleString('pt-BR'), color: 'var(--accent)' },
    { label: 'Negócios / pólices', value: stats.totalDeals.toLocaleString('pt-BR'), color: 'var(--green)' },
    { label: 'Prêmio total', value: formatK(stats.totalPremio), color: 'var(--amber)' },
    { label: 'Comissão estimada', value: formatK(stats.totalComissao), color: 'var(--purple)' },
  ];

  // Top ramos by count
  const ramoEntries = Object.entries(stats.ramoBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxRamo = ramoEntries[0]?.[1] || 1;

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: '100%' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Dados reais sincronizados da Corp &mdash; Marpe Corretora</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
        {kpis.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginTop: 8, letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Row 2: Ramo breakdown + Deal types */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginTop: 14 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Negócios por ramo</h4>
          {ramoEntries.map(([ramo, count]) => (
            <div key={ramo} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', width: 100, flexShrink: 0, textTransform: 'uppercase' }}>{ramo}</span>
              <div style={{ flex: 1, height: 20, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(count / maxRamo) * 100}%`, background: RAMO_COLORS[ramo.toLowerCase()] || 'var(--accent)', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 40, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Tipo de negócio</h4>
          {Object.entries(stats.dealTypeBreakdown).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(26,26,42,0.3)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{DEAL_TYPE_LABELS[type] || type}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Source info */}
      <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>Dados sincronizados da Corp (Agia) &mdash; {stats.totalContacts} clientes, {stats.totalDeals} negócios/pólices</span>
      </div>
    </div>
  );
}
