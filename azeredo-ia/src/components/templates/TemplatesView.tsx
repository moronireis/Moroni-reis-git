import { useState, useEffect, useRef } from 'react';
import { Toast, useToast } from '../ui/Toast';

interface Template {
  id: string;
  name: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: 'geral',      label: 'Geral' },
  { value: 'promocao',   label: 'Promoção' },
  { value: 'reativacao', label: 'Reativação' },
  { value: 'tabela',     label: 'Troca de Tabela' },
  { value: 'lancamento', label: 'Lançamento' },
  { value: 'follow_up',  label: 'Follow-up' },
];

const VARIABLES = [
  { token: '{{nome_fantasia}}', label: 'Nome Fantasia' },
  { token: '{{primeiro_nome}}', label: 'Primeiro nome' },
  { token: '{{cidade}}',        label: 'Cidade' },
  { token: '{{estado}}',        label: 'Estado' },
  { token: '{{contato}}',       label: 'Contato' },
  { token: '{{segmento}}',      label: 'Segmento' },
  { token: '{{periodo_dia}}',   label: 'Período do dia' },
];

const CAT_COLORS: Record<string, string> = {
  geral: '#7a7a82', promocao: '#4A90FF', reativacao: '#f59e0b',
  tabela: '#22c55e', lancamento: '#8b5cf6', follow_up: '#06b6d4',
};

const S = {
  root: { flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', background: '#0a0a0a' },
  header: {
    padding: '20px 24px', borderBottom: '1px solid #1e1e21',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  title: { fontSize: '16px', fontWeight: 600, color: '#f0f0f0' },
  btnPrimary: {
    padding: '8px 16px', borderRadius: '8px', border: 'none',
    background: '#4A90FF', color: '#fff', fontSize: '13px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px',
  },
  grid: { flex: 1, overflow: 'auto', padding: '20px 24px', display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', alignContent: 'start' },
  card: {
    background: '#111113', border: '1px solid #1e1e21', borderRadius: '10px',
    padding: '16px', display: 'flex', flexDirection: 'column' as const, gap: '10px',
    transition: 'border-color 0.15s',
  },
  cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' },
  cardName: { fontSize: '14px', fontWeight: 600, color: '#f0f0f0', lineHeight: 1.3 },
  badge: (color: string) => ({
    display: 'inline-flex', padding: '2px 8px', borderRadius: '4px',
    fontSize: '11px', fontWeight: 500, background: color + '18', color,
    border: `1px solid ${color}33`, flexShrink: 0,
  }),
  body: {
    fontSize: '13px', color: '#7a7a82', lineHeight: 1.6,
    background: '#0a0a0a', borderRadius: '6px', padding: '10px 12px',
    fontFamily: 'inherit', whiteSpace: 'pre-wrap' as const,
    maxHeight: '100px', overflow: 'hidden',
  },
  actions: { display: 'flex', gap: '8px' },
  btnSm: (danger?: boolean) => ({
    padding: '5px 10px', borderRadius: '6px', border: `1px solid ${danger ? '#ef444433' : '#1e1e21'}`,
    background: 'transparent', color: danger ? '#ef4444' : '#7a7a82',
    fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
  }),
  empty: { padding: '60px 24px', textAlign: 'center' as const, color: '#4a4a52', fontSize: '14px' },
  // Modal
  overlay: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
  },
  modal: {
    background: '#111113', border: '1px solid #1e1e21', borderRadius: '12px',
    width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column' as const, gap: '20px', padding: '24px',
  },
  modalTitle: { fontSize: '15px', fontWeight: 600, color: '#f0f0f0' },
  label: { fontSize: '12px', fontWeight: 600, color: '#7a7a82', marginBottom: '6px', display: 'block', letterSpacing: '0.01em' },
  fieldInput: {
    width: '100%', padding: '9px 12px', background: '#0a0a0a',
    border: '1px solid #1e1e21', borderRadius: '8px', color: '#f0f0f0',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit',
  },
  fieldSelect: {
    width: '100%', padding: '9px 12px', background: '#0a0a0a',
    border: '1px solid #1e1e21', borderRadius: '8px', color: '#f0f0f0',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
  },
  fieldTextarea: {
    width: '100%', padding: '9px 12px', background: '#0a0a0a',
    border: '1px solid #1e1e21', borderRadius: '8px', color: '#f0f0f0',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const,
    minHeight: '120px',
  },
  varChips: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginTop: '8px' },
  varChip: {
    padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
    background: 'rgba(74,144,255,0.1)', color: '#6AADFF',
    border: '1px solid rgba(74,144,255,0.2)', cursor: 'pointer', fontFamily: 'monospace',
  },
  preview: {
    background: '#0a0a0a', borderRadius: '8px', padding: '10px 12px',
    fontSize: '13px', color: '#c0c0c8', lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const, minHeight: '60px',
    border: '1px solid #1e1e21',
  },
  modalFooter: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  btnCancel: {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid #1e1e21',
    background: 'transparent', color: '#7a7a82', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
  },
  btnSave: {
    padding: '8px 16px', borderRadius: '8px', border: 'none',
    background: '#4A90FF', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
  },
};

interface ModalState {
  open: boolean;
  mode: 'create' | 'edit';
  template: Template | null;
}

export default function TemplatesView() {
  const { toasts, dismiss, success, error: showError } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'create', template: null });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formCat, setFormCat] = useState('geral');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function load() {
    setLoading(true);
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setFormName(''); setFormBody(''); setFormCat('geral');
    setModal({ open: true, mode: 'create', template: null });
  }

  function openEdit(t: Template) {
    setFormName(t.name); setFormBody(t.body); setFormCat(t.category);
    setModal({ open: true, mode: 'edit', template: t });
  }

  function closeModal() {
    setModal({ open: false, mode: 'create', template: null });
  }

  function insertVariable(token: string) {
    const el = textareaRef.current;
    if (!el) { setFormBody(prev => prev + token); return; }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = formBody.slice(0, start) + token + formBody.slice(end);
    setFormBody(next);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + token.length;
      el.focus();
    }, 0);
  }

  async function save() {
    if (!formName.trim() || !formBody.trim()) return;
    setSaving(true);
    try {
      const isEdit = modal.mode === 'edit' && modal.template;
      const url = isEdit ? `/api/templates/${modal.template!.id}` : '/api/templates';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, body: formBody, category: formCat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar');
      success(isEdit ? 'Template atualizado!' : 'Template criado!');
      load();
      closeModal();
    } catch (e: any) {
      showError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteTemplate(id: string) {
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao remover');
      success('Template removido.');
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      showError(e.message);
    } finally {
      setDeleteConfirm(null);
    }
  }

  const catLabel = (c: string) => CATEGORIES.find(x => x.value === c)?.label || c;

  return (
    <div style={S.root}>
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div style={S.header}>
        <span style={S.title}>Templates ({templates.length})</span>
        <button style={S.btnPrimary} onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo template
        </button>
      </div>

      <div style={S.grid}>
        {loading ? (
          <div style={S.empty}>Carregando...</div>
        ) : templates.length === 0 ? (
          <div style={{ ...S.empty, gridColumn: '1 / -1' }}>Nenhum template criado ainda.</div>
        ) : templates.map(t => (
          <div key={t.id} style={S.card}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#2a2a2e')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e21')}
          >
            <div style={S.cardHeader}>
              <span style={S.cardName}>{t.name}</span>
              <span style={S.badge(CAT_COLORS[t.category] || '#7a7a82')}>{catLabel(t.category)}</span>
            </div>
            <div style={S.body}>{t.body}</div>
            <div style={S.actions}>
              <button style={S.btnSm()} onClick={() => openEdit(t)}>Editar</button>
              {deleteConfirm === t.id ? (
                <>
                  <button style={S.btnSm(true)} onClick={() => deleteTemplate(t.id)}>Confirmar</button>
                  <button style={S.btnSm()} onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                </>
              ) : (
                <button style={S.btnSm(true)} onClick={() => setDeleteConfirm(t.id)}>Remover</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={S.modal}>
            <span style={S.modalTitle}>{modal.mode === 'create' ? 'Novo template' : 'Editar template'}</span>

            <div>
              <label style={S.label}>Nome</label>
              <input
                style={S.fieldInput}
                placeholder="Ex: Promoção de Março"
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label style={S.label}>Categoria</label>
              <select style={S.fieldSelect} value={formCat} onChange={e => setFormCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label style={S.label}>Corpo da mensagem</label>
              <textarea
                ref={textareaRef}
                style={S.fieldTextarea}
                placeholder="Olá, {{primeiro_nome}}! ..."
                value={formBody}
                onChange={e => setFormBody(e.target.value)}
              />
              <div style={S.varChips}>
                {VARIABLES.map(v => (
                  <span key={v.token} style={S.varChip} onClick={() => insertVariable(v.token)} title={v.label}>
                    {v.token}
                  </span>
                ))}
              </div>
            </div>

            {formBody && (
              <div>
                <label style={S.label}>Preview</label>
                <div style={S.preview}>
                  {formBody
                    .replace(/\{\{nome_fantasia\}\}/gi, 'Loja Exemplo')
                    .replace(/\{\{primeiro_nome\}\}/gi, 'João')
                    .replace(/\{\{cidade\}\}/gi, 'Porto Alegre')
                    .replace(/\{\{estado\}\}/gi, 'RS')
                    .replace(/\{\{contato\}\}/gi, 'João Silva')
                    .replace(/\{\{segmento\}\}/gi, 'Papelaria')
                    .replace(/\{\{periodo_dia\}\}/gi, 'Bom dia')}
                </div>
              </div>
            )}

            <div style={S.modalFooter}>
              <button style={S.btnCancel} onClick={closeModal}>Cancelar</button>
              <button
                style={{ ...S.btnSave, opacity: saving || !formName.trim() || !formBody.trim() ? 0.6 : 1 }}
                onClick={save}
                disabled={saving || !formName.trim() || !formBody.trim()}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
