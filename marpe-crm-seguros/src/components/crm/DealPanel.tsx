import { useState, useEffect } from 'react';

interface Stage { id: string; name: string; color: string; sort_order: number; }
interface Contact { id: string; name: string; phone: string | null; email: string | null; city: string | null; tags: string[]; }
interface Activity { id: string; type: string; description: string; created_at: string; }
interface Deal {
  id: string; title: string; ramo: string | null; seguradora: string | null; apolice: string | null;
  premio: number | null; comissao_pct: number | null; comissao_valor: number | null;
  vigencia_inicio: string | null; vigencia_fim: string | null; veiculo: string | null; placa: string | null;
  deal_type: string | null; next_action: string | null; next_action_date: string | null;
  stage_id: string; funnel_id: string;
  marpe_contacts: Contact | null;
  marpe_funnel_stages: { id: string; name: string; color: string } | null;
  marpe_funnels: { id: string; name: string } | null;
  marpe_deal_activities: Activity[];
}

interface Props {
  dealId: string;
  stages: Stage[];
  onClose: () => void;
  onUpdated: () => void;
}

function fmt(v: number | null) {
  if (!v) return '—';
  return `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
}

const ACTIVITY_ICONS: Record<string, string> = {
  stage_change: '↗',
  automation: '⚡',
  note: '📝',
  call: '📞',
  default: '·',
};

export default function DealPanel({ dealId, stages, onClose, onUpdated }: Props) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'activity'>('info');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  function load() {
    setLoading(true);
    fetch(`/api/deals/${dealId}`)
      .then(r => r.json())
      .then(d => { setDeal(d.deal); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, [dealId]);

  async function changeStage(stageId: string) {
    if (!deal || stageId === deal.stage_id) return;
    setSaving(true);
    await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage_id: stageId }),
    });
    setSaving(false);
    load();
    onUpdated();
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ next_action: newNote }),
    });
    setNewNote('');
    setSavingNote(false);
    load();
  }

  const s: Record<string, React.CSSProperties> = {
    panel: { width: 360, borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' },
    header: { padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 },
    row: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    label: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
    value: { fontSize: 12, color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right' as const, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
    tab: (active: boolean) => ({ padding: '8px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: active ? 'var(--accent-light)' : 'var(--text-muted)', background: 'none', border: 'none', borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`, fontFamily: 'inherit' }),
    closeBtn: { width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 },
  };

  if (loading) return (
    <div style={s.panel}>
      <div style={{ padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Carregando...</div>
    </div>
  );

  if (!deal) return (
    <div style={s.panel}>
      <div style={{ padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Negócio não encontrado</div>
    </div>
  );

  const contact = deal.marpe_contacts;

  return (
    <div style={s.panel}>
      {/* Header */}
      <div style={s.header}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{contact?.name || deal.title || '—'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {deal.marpe_funnels?.name} · {deal.marpe_funnel_stages?.name}
          </div>
        </div>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
      </div>

      {/* Stage selector */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Etapa</div>
        <select
          value={deal.stage_id}
          onChange={e => changeStage(e.target.value)}
          disabled={saving}
          style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
        >
          {stages.map(st => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>
        {saving && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Salvando...</div>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button style={s.tab(activeTab === 'info')} onClick={() => setActiveTab('info')}>Informações</button>
        <button style={s.tab(activeTab === 'activity')} onClick={() => setActiveTab('activity')}>
          Atividades ({deal.marpe_deal_activities?.length || 0})
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {activeTab === 'info' ? (
          <>
            {contact && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Contato</div>
                {[
                  ['Telefone', contact.phone],
                  ['E-mail', contact.email],
                  ['Cidade', contact.city],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k as string} style={s.row}>
                    <span style={s.label}>{k}</span>
                    <span style={s.value}>{v}</span>
                  </div>
                ))}
                <div style={{ height: 12 }} />
              </>
            )}

            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Seguro</div>
            {[
              ['Ramo', deal.ramo],
              ['Seguradora', deal.seguradora],
              ['Apólice', deal.apolice],
              ['Prêmio', fmt(deal.premio)],
              ['Comissão', deal.comissao_pct ? `${deal.comissao_pct}%` : null],
              ['Comissão R$', fmt(deal.comissao_valor)],
              ['Vigência início', fmtDate(deal.vigencia_inicio)],
              ['Vigência fim', fmtDate(deal.vigencia_fim)],
              ['Veículo', deal.veiculo],
              ['Placa', deal.placa],
            ].filter(([, v]) => v && v !== '—').map(([k, v]) => (
              <div key={k as string} style={s.row}>
                <span style={s.label}>{k}</span>
                <span style={s.value}>{v}</span>
              </div>
            ))}

            {deal.next_action && (
              <>
                <div style={{ height: 12 }} />
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Próxima ação</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: 8, padding: 10 }}>{deal.next_action}</div>
              </>
            )}

            <div style={{ height: 12 }} />
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Adicionar nota</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addNote(); }}
                placeholder="Próxima ação ou nota..."
                style={{ flex: 1, padding: '8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
              />
              <button
                onClick={addNote}
                disabled={savingNote || !newNote.trim()}
                style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Ok
              </button>
            </div>
          </>
        ) : (
          <>
            {(deal.marpe_deal_activities || []).length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nenhuma atividade registrada.</div>
            ) : [...(deal.marpe_deal_activities || [])].sort((a, b) => b.created_at.localeCompare(a.created_at)).map(act => (
              <div key={act.id} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>{ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.default}</span>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{act.description}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(act.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
