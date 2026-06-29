import { useState, useEffect } from 'react';
import type { Contact, LeadStage, EventType } from '../../lib/types';

interface ContactDetailProps {
  contact: Contact;
  onUpdate: (updated: Contact) => void;
}

const STAGES: { value: LeadStage; label: string; color: string }[] = [
  { value: 'novo',              label: 'Novo',              color: '#52796F' },
  { value: 'contato_feito',    label: 'Contato feito',     color: '#4A80A4' },
  { value: 'proposta_enviada', label: 'Proposta enviada',  color: '#7B68B0' },
  { value: 'visita_agendada',  label: 'Visita agendada',   color: '#C9A96E' },
  { value: 'visita_realizada', label: 'Visita realizada',  color: '#D4845A' },
  { value: 'negociacao',       label: 'Negociação',        color: '#B07A40' },
  { value: 'fechado',          label: 'Fechado',           color: '#3A7D44' },
  { value: 'perdido',          label: 'Perdido',           color: '#8B3A3A' },
];

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'casamento',        label: 'Casamento' },
  { value: 'debutante',        label: 'Debutante' },
  { value: 'corporativo',      label: 'Corporativo' },
  { value: 'confraternizacao', label: 'Confraternização' },
  { value: 'outro',            label: 'Outro' },
];

const BUDGET_OPTIONS = [
  '< R$ 50k',
  'R$ 50k – 100k',
  'R$ 100k – 200k',
  'R$ 200k+',
];

const SOURCE_OPTIONS = ['WhatsApp', 'Site', 'Instagram', 'Indicação', 'Outro'];

const s = {
  panel: {
    width: 280,
    borderLeft: '1px solid var(--gold-dim)',
    background: '#162019',
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
    flexShrink: 0,
  },
  header: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--gold-dim)',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--gold)',
    fontWeight: 500,
  },
  section: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(244,239,230,0.04)',
  },
  label: {
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'rgba(244,239,230,0.45)',
    marginBottom: '0.35rem',
  },
  input: {
    width: '100%',
    background: 'var(--forest-deep)',
    border: '1px solid rgba(201,169,110,0.2)',
    color: 'var(--cream)',
    padding: '0.4rem 0.6rem',
    fontSize: '0.82rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    background: 'var(--forest-deep)',
    border: '1px solid rgba(201,169,110,0.2)',
    color: 'var(--cream)',
    padding: '0.4rem 0.6rem',
    fontSize: '0.82rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
    appearance: 'none' as const,
  },
  textarea: {
    width: '100%',
    background: 'var(--forest-deep)',
    border: '1px solid rgba(201,169,110,0.2)',
    color: 'var(--cream)',
    padding: '0.4rem 0.6rem',
    fontSize: '0.82rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: 80,
    boxSizing: 'border-box' as const,
  },
  saveBtn: {
    width: '100%',
    background: 'var(--gold)',
    border: 'none',
    color: 'var(--forest-deep)',
    padding: '0.55rem',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
  },
  stagePill: (active: boolean, color: string) => ({
    padding: '0.25rem 0.5rem',
    fontSize: '0.65rem',
    letterSpacing: '0.05em',
    border: `1px solid ${active ? color : 'rgba(244,239,230,0.12)'}`,
    background: active ? `${color}22` : 'transparent',
    color: active ? color : 'rgba(244,239,230,0.45)',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  }),
};

export function ContactDetail({ contact, onUpdate }: ContactDetailProps) {
  const [form, setForm] = useState({
    name: contact.name || '',
    email: contact.email || '',
    lead_stage: contact.lead_stage || 'novo',
    event_type: contact.event_type || '',
    event_date: contact.event_date || '',
    guest_count: contact.guest_count?.toString() || '',
    budget_range: contact.budget_range || '',
    source: contact.source || '',
    notes: contact.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Reset form when contact changes
  useEffect(() => {
    setForm({
      name: contact.name || '',
      email: contact.email || '',
      lead_stage: contact.lead_stage || 'novo',
      event_type: contact.event_type || '',
      event_date: contact.event_date || '',
      guest_count: contact.guest_count?.toString() || '',
      budget_range: contact.budget_range || '',
      source: contact.source || '',
      notes: contact.notes || '',
    });
    setSaved(false);
  }, [contact.id]);

  const set = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name || null,
        email: form.email || null,
        lead_stage: form.lead_stage || null,
        event_type: form.event_type || null,
        event_date: form.event_date || null,
        guest_count: form.guest_count ? Number(form.guest_count) : null,
        budget_range: form.budget_range || null,
        source: form.source || null,
        notes: form.notes || null,
      };
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const currentStage = STAGES.find(s => s.value === form.lead_stage);

  return (
    <div style={s.panel}>
      <div style={s.header}>Detalhes do lead</div>

      {/* Stage pipeline */}
      <div style={{ ...s.section, borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <div style={s.label}>Estágio</div>
        {currentStage && (
          <div style={{
            fontSize: '0.78rem', color: currentStage.color,
            fontWeight: 600, marginBottom: '0.6rem', letterSpacing: '0.03em',
          }}>
            {currentStage.label}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {STAGES.map(st => (
            <button
              key={st.value}
              onClick={() => set('lead_stage', st.value)}
              style={s.stagePill(form.lead_stage === st.value, st.color)}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div style={s.section}>
        <div style={s.label}>Nome</div>
        <input
          style={s.input}
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder={contact.push_name || contact.phone}
        />
        <div style={{ ...s.label, marginTop: '0.65rem' }}>Email</div>
        <input
          style={s.input}
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          placeholder="—"
        />
      </div>

      {/* Event info */}
      <div style={s.section}>
        <div style={s.label}>Tipo de evento</div>
        <select style={s.select} value={form.event_type} onChange={e => set('event_type', e.target.value)}>
          <option value="">— Selecionar —</option>
          {EVENT_TYPES.map(et => (
            <option key={et.value} value={et.value}>{et.label}</option>
          ))}
        </select>

        <div style={{ ...s.label, marginTop: '0.65rem' }}>Data do evento</div>
        <input
          style={s.input}
          type="date"
          value={form.event_date}
          onChange={e => set('event_date', e.target.value)}
        />

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
          <div style={{ flex: 1 }}>
            <div style={s.label}>Convidados</div>
            <input
              style={s.input}
              type="number"
              min="1"
              value={form.guest_count}
              onChange={e => set('guest_count', e.target.value)}
              placeholder="—"
            />
          </div>
        </div>

        <div style={{ ...s.label, marginTop: '0.65rem' }}>Orçamento</div>
        <select style={s.select} value={form.budget_range} onChange={e => set('budget_range', e.target.value)}>
          <option value="">— Selecionar —</option>
          {BUDGET_OPTIONS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Source */}
      <div style={s.section}>
        <div style={s.label}>Origem</div>
        <select style={s.select} value={form.source} onChange={e => set('source', e.target.value)}>
          <option value="">— Selecionar —</option>
          {SOURCE_OPTIONS.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div style={s.section}>
        <div style={s.label}>Notas</div>
        <textarea
          style={s.textarea}
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Observações sobre o lead..."
        />
      </div>

      {/* Save */}
      <div style={{ padding: '0.75rem 1rem', marginTop: 'auto' }}>
        <button onClick={handleSave} disabled={saving} style={{
          ...s.saveBtn,
          opacity: saving ? 0.6 : 1,
          background: saved ? '#3A7D44' : 'var(--gold)',
          color: saved ? '#fff' : 'var(--forest-deep)',
        }}>
          {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
