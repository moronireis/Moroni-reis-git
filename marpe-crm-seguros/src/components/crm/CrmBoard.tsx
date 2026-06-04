import { useState, useEffect } from 'react';
import DealPanel from './DealPanel';

const RAMO_COLORS: Record<string, { bg: string; color: string }> = {
  auto: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA' },
  vida: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  vgrp: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  residencial: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
  empresarial: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  equipamento: { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
  fina: { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
};

interface Funnel { id: string; name: string; stages: Stage[]; }
interface Stage { id: string; name: string; color: string; sort_order: number; }
interface Deal {
  id: string; title: string; ramo: string | null; seguradora: string | null; apolice: string | null;
  premio: number | null; comissao_valor: number | null; deal_type: string | null;
  vigencia_inicio: string | null; vigencia_fim: string | null; stage_id: string;
  marpe_contacts: { id: string; name: string; phone: string | null } | null;
  marpe_funnel_stages: { id: string; name: string; color: string } | null;
}

export default function CrmBoard() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [activeFunnelId, setActiveFunnelId] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'grade'>('kanban');
  const [loading, setLoading] = useState(true);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/funnels').then(r => r.json()).then(d => {
      setFunnels(d.funnels || []);
      if (d.funnels?.length) setActiveFunnelId(d.funnels[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activeFunnelId) return;
    setLoading(true);
    fetch(`/api/deals?funnel_id=${activeFunnelId}&limit=500`)
      .then(r => r.json())
      .then(d => { setDeals(d.deals || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeFunnelId]);

  const activeFunnel = funnels.find(f => f.id === activeFunnelId);
  const stages = activeFunnel?.stages || [];

  function reloadDeals() {
    if (!activeFunnelId) return;
    fetch(`/api/deals?funnel_id=${activeFunnelId}&limit=500`)
      .then(r => r.json())
      .then(d => setDeals(d.deals || []));
  }

  const dealsByStage = (stageId: string) => deals.filter(d => d.stage_id === stageId);

  function formatPremio(v: number | null) {
    if (!v) return '—';
    return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Topbar */}
      <div style={{ height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>Funis</span>
        <select value={activeFunnelId} onChange={e => setActiveFunnelId(e.target.value)}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
          {funnels.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{deals.length} negócios</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {(['kanban', 'grade'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              style={{ padding: '7px 14px', borderRadius: 6, border: `1px solid ${viewMode === m ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`, background: viewMode === m ? 'var(--accent-dim)' : 'transparent', color: viewMode === m ? 'var(--accent-light)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              {m === 'kanban' ? 'Kanban' : 'Grade'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>Carregando negócios...</div>
      ) : viewMode === 'kanban' ? (
        <div style={{ flex: 1, overflowX: 'auto', padding: 20, display: 'flex', gap: 14 }}>
          {stages.map(stage => {
            const stageDeals = dealsByStage(stage.id);
            const sum = stageDeals.reduce((a, d) => a + (d.premio || 0), 0);
            return (
              <div key={stage.id} style={{ minWidth: 280, maxWidth: 280, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{stage.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 100, marginLeft: 'auto' }}>{stageDeals.length}</span>
                  {sum > 0 && <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>{formatPremio(sum)}</span>}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stageDeals.slice(0, 50).map(d => {
                    const r = RAMO_COLORS[d.ramo?.toLowerCase() || ''] || { bg: 'var(--border)', color: 'var(--text-muted)' };
                    return (
                      <div key={d.id} onClick={() => setActiveDealId(d.id)} style={{ background: activeDealId === d.id ? 'rgba(59,130,246,0.06)' : 'var(--bg-card)', border: `1px solid ${activeDealId === d.id ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`, borderRadius: 10, padding: 14, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{d.marpe_contacts?.name || d.title}</span>
                          {d.ramo && <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 100, textTransform: 'uppercase', background: r.bg, color: r.color }}>{d.ramo}</span>}
                        </div>
                        {d.seguradora && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{d.seguradora}</div>}
                        <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                          {d.premio && <span><span style={{ color: 'var(--text-muted)' }}>Prêmio </span><span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{formatPremio(d.premio)}</span></span>}
                          {d.apolice && <span style={{ color: 'var(--text-muted)' }}>#{d.apolice.slice(-6)}</span>}
                        </div>
                      </div>
                    );
                  })}
                  {stageDeals.length === 0 && <div style={{ padding: 20, border: '1px dashed var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Nenhum negócio</div>}
                  {stageDeals.length > 50 && <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: 8 }}>+{stageDeals.length - 50} mais</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>{['Cliente', 'Ramo', 'Seguradora', 'Prêmio', 'Apólice', 'Etapa', 'Vigência'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {deals.slice(0, 200).map(d => {
                const r = RAMO_COLORS[d.ramo?.toLowerCase() || ''] || { bg: 'var(--border)', color: 'var(--text-muted)' };
                return (
                  <tr key={d.id}>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 500 }}>{d.marpe_contacts?.name || '—'}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}>{d.ramo && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: r.bg, color: r.color, textTransform: 'uppercase' }}>{d.ramo}</span>}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{d.seguradora || '—'}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{formatPremio(d.premio)}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11 }}>{d.apolice || '—'}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)' }}><span style={{ fontSize: 10, color: d.marpe_funnel_stages?.color || 'var(--text-muted)' }}>{d.marpe_funnel_stages?.name || '—'}</span></td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11 }}>{d.vigencia_fim || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {deals.length > 200 && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Mostrando 200 de {deals.length}</p>}
        </div>
      )}
    </div>
    {activeDealId && (
      <DealPanel
        dealId={activeDealId}
        stages={stages}
        onClose={() => setActiveDealId(null)}
        onUpdated={reloadDeals}
      />
    )}
    </div>
  );
}
