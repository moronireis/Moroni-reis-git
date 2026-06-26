import { useState, useEffect, useCallback } from 'react';

interface Process {
  id: string;
  title: string;
  body: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

const CATEGORIES = ['Geral', 'Disparos', 'Atendimento', 'Vendas', 'Interno'];

const CATEGORY_COLORS: Record<string, string> = {
  Disparos:    { bg: 'rgba(37,211,102,0.12)',  color: '#4de08c'  } as any,
  Atendimento: { bg: 'rgba(59,130,246,0.12)',  color: '#93c5fd'  } as any,
  Vendas:      { bg: 'rgba(251,191,36,0.12)',  color: '#fcd34d'  } as any,
  Interno:     { bg: 'rgba(168,85,247,0.12)',  color: '#c4b5fd'  } as any,
  Geral:       { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8'  } as any,
};

function getCat(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Geral'];
}

const empty: Omit<Process, 'id' | 'is_active'> = { title: '', body: '', category: 'Geral', display_order: 0 };

export default function ProcessosView() {
  const [processes, setProcesses]   = useState<Process[]>([]);
  const [loading, setLoading]       = useState(true);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [selected, setSelected]     = useState<Process | null>(null);
  const [editing, setEditing]       = useState(false);
  const [form, setForm]             = useState<typeof empty>(empty);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [filterCat, setFilterCat]   = useState('');
  const [search, setSearch]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/processes');
      const d = await r.json();
      setProcesses(Array.isArray(d) ? d : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Detect admin from sidebar role text
  useEffect(() => {
    const roleEl = document.querySelector('.user-role');
    if (roleEl?.textContent?.includes('admin')) setIsAdmin(true);
  }, []);

  const openNew = () => {
    setSelected(null);
    setForm({ ...empty, display_order: processes.length + 1 });
    setEditing(true);
  };

  const openEdit = (p: Process) => {
    setSelected(p);
    setForm({ title: p.title, body: p.body, category: p.category, display_order: p.display_order });
    setEditing(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      if (selected) {
        await fetch(`/api/processes/${selected.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, body: form.body }),
        });
      } else {
        await fetch('/api/processes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, body: form.body }),
        });
      }
      setEditing(false);
      await load();
    } finally { setSaving(false); }
  };

  const del = async (p: Process) => {
    if (!confirm(`Excluir "${p.title}"?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/processes/${p.id}`, { method: 'DELETE' });
      if (selected?.id === p.id) setSelected(null);
      await load();
    } finally { setDeleting(false); }
  };

  const filtered = processes.filter(p => {
    if (filterCat && p.category !== filterCat) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = CATEGORIES.reduce<Record<string, Process[]>>((acc, cat) => {
    const items = filtered.filter(p => p.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* List panel */}
      <div style={{ width: 340, borderRight: '1px solid #1e2820', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #1e2820' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f2' }}>Processos e Padrões</div>
              <div style={{ fontSize: 12, color: '#6b7a72', marginTop: 2 }}>{processes.length} documentos</div>
            </div>
            {isAdmin && (
              <button onClick={openNew} style={{
                background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
                padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo
              </button>
            )}
          </div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4b5a52' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar processos..."
              style={{
                width: '100%', background: '#0d1410', border: '1px solid #1e2820',
                borderRadius: 8, padding: '8px 10px 8px 32px', color: '#e2e8e4',
                fontSize: 13, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 6, paddingBottom: 12, flexWrap: 'wrap' }}>
            {['', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none',
                background: filterCat === cat ? '#25D366' : '#131a16',
                color: filterCat === cat ? '#fff' : '#6b7a72',
              }}>
                {cat || 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4b5a52', fontSize: 13 }}>Carregando...</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4b5a52', fontSize: 13 }}>Nenhum processo encontrado</div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div style={{ padding: '10px 20px 4px', fontSize: 10, fontWeight: 700, color: '#4b5a52', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cat}
                </div>
                {items.map(p => {
                  const c = getCat(p.category) as any;
                  const isActive = selected?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => { setSelected(p); setEditing(false); }}
                      style={{
                        margin: '2px 8px', padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                        background: isActive ? 'rgba(37,211,102,0.08)' : 'transparent',
                        border: isActive ? '1px solid rgba(37,211,102,0.15)' : '1px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#e2e8e4' : '#c9d5cc' }}>{p.title}</div>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: c.bg, color: c.color, fontWeight: 600, flexShrink: 0 }}>
                          {p.category}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#4b5a52', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {p.body.split('\n')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail / Edit panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#080c09' }}>
        {editing ? (
          /* Edit form */
          <div style={{ flex: 1, padding: 32, overflowY: 'auto', maxWidth: 720 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f2', marginBottom: 24 }}>
              {selected ? 'Editar Processo' : 'Novo Processo'}
            </div>

            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7a72', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Título *</div>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Processo de Atendimento"
                style={{
                  width: '100%', background: '#0d1410', border: '1px solid #1e2820',
                  borderRadius: 8, padding: '10px 14px', color: '#e2e8e4', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <label>
                <div style={{ fontSize: 12, color: '#6b7a72', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categoria</div>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{
                    width: '100%', background: '#0d1410', border: '1px solid #1e2820',
                    borderRadius: 8, padding: '10px 14px', color: '#e2e8e4', fontSize: 14,
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <div style={{ fontSize: 12, color: '#6b7a72', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ordem</div>
                <input
                  type="number" min={0}
                  value={form.display_order}
                  onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '100%', background: '#0d1410', border: '1px solid #1e2820',
                    borderRadius: 8, padding: '10px 14px', color: '#e2e8e4', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </label>
            </div>

            <label style={{ display: 'block', marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#6b7a72', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Conteúdo *</div>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                rows={12}
                placeholder="Descreva o processo passo a passo..."
                style={{
                  width: '100%', background: '#0d1410', border: '1px solid #1e2820',
                  borderRadius: 8, padding: '10px 14px', color: '#e2e8e4', fontSize: 13,
                  outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.7, boxSizing: 'border-box',
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving || !form.title || !form.body} style={{
                background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving || !form.title || !form.body ? 0.6 : 1,
              }}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setEditing(false)} style={{
                background: '#131a16', color: '#6b7a72', border: '1px solid #1e2820',
                borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer',
              }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : selected ? (
          /* View detail */
          <div style={{ flex: 1, padding: 32, overflowY: 'auto', maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f2', marginBottom: 8 }}>{selected.title}</div>
                {(() => { const c = getCat(selected.category) as any; return (
                  <span style={{ fontSize: 11, padding: '3px 12px', borderRadius: 20, background: c.bg, color: c.color, fontWeight: 600 }}>
                    {selected.category}
                  </span>
                ); })()}
              </div>
              {isAdmin && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(selected)} style={{
                    background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)',
                    borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Editar
                  </button>
                  <button onClick={() => del(selected)} disabled={deleting} style={{
                    background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Excluir
                  </button>
                </div>
              )}
            </div>

            <div style={{
              background: '#0d1410', border: '1px solid #1e2820', borderRadius: 12,
              padding: '24px 28px',
            }}>
              {selected.body.split('\n').map((line, i) => (
                <p key={i} style={{
                  margin: '0 0 8px', fontSize: 14, color: line.match(/^\d+\./) ? '#e2e8e4' : '#9aad9e',
                  lineHeight: 1.7, fontWeight: line.match(/^\d+\./) ? 500 : 400,
                }}>
                  {line || <br />}
                </p>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a3a2e" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <div style={{ fontSize: 14, color: '#4b5a52' }}>Selecione um processo para visualizar</div>
            {isAdmin && (
              <button onClick={openNew} style={{
                marginTop: 8, background: 'rgba(37,211,102,0.1)', color: '#25D366',
                border: '1px solid rgba(37,211,102,0.2)', borderRadius: 8, padding: '8px 20px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                + Criar primeiro processo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
