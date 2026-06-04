import { useState, useEffect } from 'react';

interface Template { id: string; name: string; body: string; }
interface Campaign {
  id: string; name: string; status: string;
  sent_count: number; delivered_count: number; failed_count: number; read_count: number;
  scheduled_at: string | null; created_at: string;
  marpe_templates: { id: string; name: string; body: string } | null;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft:    { bg: 'rgba(107,114,128,0.12)', color: 'var(--text-muted)' },
  sending:  { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  sent:     { bg: 'rgba(34,197,94,0.12)',  color: 'var(--green)' },
  failed:   { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
};
const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho', sending: 'Enviando', sent: 'Enviado', failed: 'Erro',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', template_id: '' });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [error, setError] = useState('');

  function load() {
    Promise.all([
      fetch('/api/campaigns').then(r => r.json()),
      fetch('/api/templates').then(r => r.json()),
    ]).then(([c, t]) => {
      setCampaigns(c.campaigns || []);
      setTemplates(t.templates || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function createCampaign() {
    if (!form.name) { setError('Nome obrigatório'); return; }
    setSaving(true); setError('');
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, template_id: form.template_id || null }),
    });
    const d = await res.json();
    setSaving(false);
    if (!res.ok) { setError(d.error || 'Erro'); return; }
    setShowForm(false);
    setForm({ name: '', template_id: '' });
    load();
  }

  async function send(id: string) {
    if (!confirm('Disparar esta campanha para todos os contatos correspondentes?')) return;
    setSending(id);
    const res = await fetch(`/api/campaigns/${id}/send`, { method: 'POST' });
    const d = await res.json();
    setSending(null);
    if (!res.ok) { alert(d.error || 'Erro ao disparar'); return; }
    alert(d.message || 'Campanha disparada!');
    load();
  }

  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit', marginBottom: 10 };
  const btn = (primary?: boolean): React.CSSProperties => ({ padding: '9px 18px', borderRadius: 8, border: primary ? 'none' : '1px solid var(--border)', background: primary ? 'var(--accent)' : 'transparent', color: primary ? '#fff' : 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>Campanhas</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{campaigns.length} campanhas</span>
        <button onClick={() => setShowForm(true)} style={{ ...btn(true), marginLeft: 'auto' }}>+ Nova campanha</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {showForm && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Nova campanha</div>
            <input style={inp} placeholder="Nome da campanha" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <select style={inp} value={form.template_id} onChange={e => setForm(f => ({ ...f, template_id: e.target.value }))}>
              <option value="">Selecionar template...</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {error && <div style={{ fontSize: 12, color: '#f87171', marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createCampaign} disabled={saving} style={btn(true)}>{saving ? 'Salvando...' : 'Criar'}</button>
              <button onClick={() => setShowForm(false)} style={btn()}>Cancelar</button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Carregando...</div>
        ) : campaigns.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Nenhuma campanha. Crie a primeira clicando em "+ Nova campanha".</div>
        ) : campaigns.map(c => {
          const sc = STATUS_COLORS[c.status] || STATUS_COLORS.draft;
          return (
            <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: sc.bg, color: sc.color }}>{STATUS_LABELS[c.status] || c.status}</span>
                </div>
                {c.marpe_templates && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Template: {c.marpe_templates.name}</div>
                )}
                {c.status === 'sent' && (
                  <div style={{ display: 'flex', gap: 14, fontSize: 11 }}>
                    <span><span style={{ color: 'var(--text-muted)' }}>Enviados </span><span style={{ color: 'var(--green)', fontWeight: 600 }}>{c.sent_count || 0}</span></span>
                    <span><span style={{ color: 'var(--text-muted)' }}>Falhas </span><span style={{ color: '#f87171', fontWeight: 600 }}>{c.failed_count || 0}</span></span>
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{fmtDate(c.created_at)}</div>
              </div>
              {c.status === 'draft' && (
                <button
                  onClick={() => send(c.id)}
                  disabled={sending === c.id}
                  style={{ ...btn(true), fontSize: 12, padding: '8px 14px', flexShrink: 0 }}
                >
                  {sending === c.id ? 'Disparando...' : '▶ Disparar'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
