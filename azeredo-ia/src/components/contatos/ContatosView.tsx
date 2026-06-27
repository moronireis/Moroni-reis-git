import { useState, useEffect, useCallback } from 'react';
import { Toast, useToast } from '../ui/Toast';

interface Brand { id: string; name: string; slug: string; }
interface Contact {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string | null;
  phone_primary: string | null;
  cidade: string | null;
  estado: string | null;
  segmento: string | null;
  status: string;
  contato: string | null;
  brands: Brand[];
}

const STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo',
  inativo_recente: 'Inativo recente',
  inativo_antigo: 'Inativo antigo',
};
const STATUS_COLORS: Record<string, string> = {
  ativo: '#22c55e',
  inativo_recente: '#f59e0b',
  inativo_antigo: '#ef4444',
};

const S = {
  root: { flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', background: '#080c09' },
  header: { padding: '20px 24px 0', borderBottom: '1px solid #1c2820', flexShrink: 0 },
  headerTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  title: { fontSize: '16px', fontWeight: 600, color: '#e8f0e8' },
  count: { fontSize: '13px', color: '#4a6050' },
  filters: { display: 'flex', gap: '10px', paddingBottom: '16px', flexWrap: 'wrap' as const },
  input: {
    background: '#111a12', border: '1px solid #1c2820', borderRadius: '8px',
    color: '#e8f0e8', fontSize: '13px', padding: '7px 12px', outline: 'none',
    fontFamily: 'inherit',
  },
  select: {
    background: '#111a12', border: '1px solid #1c2820', borderRadius: '8px',
    color: '#e8f0e8', fontSize: '13px', padding: '7px 12px', outline: 'none',
    fontFamily: 'inherit', cursor: 'pointer',
  },
  tableWrap: { flex: 1, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px' },
  th: {
    padding: '10px 16px', textAlign: 'left' as const, fontSize: '11px',
    fontWeight: 600, color: '#4a6050', textTransform: 'uppercase' as const,
    letterSpacing: '0.05em', borderBottom: '1px solid #1c2820',
    background: '#080c09', position: 'sticky' as const, top: 0, zIndex: 1,
  },
  td: { padding: '11px 16px', borderBottom: '1px solid #1c2820', color: '#8aaa90', verticalAlign: 'middle' as const },
  tdPrimary: { padding: '11px 16px', borderBottom: '1px solid #1c2820', color: '#e8f0e8', fontWeight: 500, verticalAlign: 'middle' as const },
  badge: (color: string) => ({
    display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
    borderRadius: '4px', fontSize: '11px', fontWeight: 500,
    background: color + '18', color, border: `1px solid ${color}33`,
  }),
  brandBadge: {
    display: 'inline-flex', alignItems: 'center', padding: '2px 7px',
    borderRadius: '4px', fontSize: '11px', fontWeight: 500, marginRight: '4px', marginBottom: '2px',
    background: 'rgba(37,211,102,0.1)', color: '#4de08c', border: '1px solid rgba(37,211,102,0.2)',
  },
  footer: {
    padding: '12px 24px', borderTop: '1px solid #1c2820', display: 'flex',
    alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  pageBtn: (disabled: boolean) => ({
    padding: '6px 12px', borderRadius: '6px', border: '1px solid #1c2820',
    background: disabled ? 'transparent' : '#111a12', color: disabled ? '#243228' : '#e8f0e8',
    fontSize: '12px', cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit',
  }),
  empty: { padding: '60px 24px', textAlign: 'center' as const, color: '#4a6050', fontSize: '14px' },
};

const SEGMENTO_OPTIONS = ['Papelaria', 'Brinquedo', 'Bazar', 'Papelaria e Brinquedo', 'Serviço', 'Outros'];

const emptyForm = {
  razao_social: '', nome_fantasia: '', cnpj: '', phone_primary: '',
  contato: '', cidade: '', estado: 'RS', segmento: '', status: 'ativo',
  brand_ids: [] as string[],
};

export default function ContatosView() {
  const { toasts, dismiss, error: showError, success: showSuccess } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // New-contact modal
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Filters
  const [q, setQ] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [cidadeFilter, setCidadeFilter] = useState('');
  const [segmentoFilter, setSegmentoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const LIMIT = 50;

  // Load brands for filter dropdown
  useEffect(() => {
    fetch('/api/brands')
      .then(r => r.json())
      .then(d => setBrands(d.brands || []))
      .catch(() => {});
  }, []);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (q)             params.set('q', q);
      if (brandFilter)   params.set('brand_id', brandFilter);
      if (cidadeFilter)  params.set('cidade', cidadeFilter);
      if (segmentoFilter) params.set('segmento', segmentoFilter);
      if (statusFilter)  params.set('status', statusFilter);

      const res = await fetch(`/api/contacts?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar contatos');
      setContacts(data.contacts || []);
      setTotal(data.total || 0);
      setPage(p);
    } catch (e: any) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  }, [q, brandFilter, cidadeFilter, segmentoFilter, statusFilter, showError]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(1), 350);
    return () => clearTimeout(t);
  }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  const toggleFormBrand = (id: string) => {
    setForm(f => ({
      ...f,
      brand_ids: f.brand_ids.includes(id) ? f.brand_ids.filter(b => b !== id) : [...f.brand_ids, id],
    }));
  };

  const saveContact = async () => {
    if (!form.razao_social.trim()) { showError('Razão social / nome é obrigatório'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar contato');
      showSuccess('Contato criado');
      setShowForm(false);
      setForm(emptyForm);
      load(1);
    } catch (e: any) {
      showError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.root}>
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div style={S.header}>
        <div style={S.headerTop}>
          <span style={S.title}>Contatos</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={S.count}>{total.toLocaleString('pt-BR')} registros</span>
            <button
              onClick={() => { setForm(emptyForm); setShowForm(true); }}
              style={{
                background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
                padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo contato
            </button>
          </div>
        </div>
        <div style={S.filters}>
          <input
            style={{ ...S.input, width: '220px' }}
            placeholder="Buscar nome, CNPJ, contato..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select style={S.select} value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
            <option value="">Todas as marcas</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <input
            style={{ ...S.input, width: '140px' }}
            placeholder="Cidade"
            value={cidadeFilter}
            onChange={e => setCidadeFilter(e.target.value)}
          />
          <input
            style={{ ...S.input, width: '140px' }}
            placeholder="Segmento"
            value={segmentoFilter}
            onChange={e => setSegmentoFilter(e.target.value)}
          />
          <select style={S.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo_recente">Inativo recente</option>
            <option value="inativo_antigo">Inativo antigo</option>
          </select>
        </div>
      </div>

      <div style={S.tableWrap}>
        {loading ? (
          <div style={S.empty}>Carregando...</div>
        ) : contacts.length === 0 ? (
          <div style={S.empty}>Nenhum contato encontrado.</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Nome Fantasia / Razão Social</th>
                <th style={S.th}>CNPJ</th>
                <th style={S.th}>Telefone</th>
                <th style={S.th}>Cidade</th>
                <th style={S.th}>Segmento</th>
                <th style={S.th}>Marcas</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id} style={{ transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#111a12')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#080c09')}
                >
                  <td style={S.tdPrimary}>
                    <div>{c.nome_fantasia || c.razao_social}</div>
                    {c.nome_fantasia && (
                      <div style={{ fontSize: '11px', color: '#4a6050', marginTop: '2px' }}>{c.razao_social}</div>
                    )}
                    {c.contato && (
                      <div style={{ fontSize: '11px', color: '#8aaa90', marginTop: '1px' }}>{c.contato}</div>
                    )}
                  </td>
                  <td style={S.td}>{c.cnpj || '—'}</td>
                  <td style={S.td}>{c.phone_primary || '—'}</td>
                  <td style={S.td}>{c.cidade ? `${c.cidade}/${c.estado || 'RS'}` : '—'}</td>
                  <td style={S.td}>{c.segmento || '—'}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                      {c.brands.length === 0 ? '—' : c.brands.map(b => (
                        <span key={b.id} style={S.brandBadge}>{b.name}</span>
                      ))}
                    </div>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(STATUS_COLORS[c.status] || '#8aaa90')}>
                      {STATUS_LABELS[c.status] || c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={S.footer}>
          <button style={S.pageBtn(page <= 1)} disabled={page <= 1} onClick={() => load(page - 1)}>
            Anterior
          </button>
          <span style={{ fontSize: '12px', color: '#4a6050' }}>
            Página {page} de {totalPages}
          </span>
          <button style={S.pageBtn(page >= totalPages)} disabled={page >= totalPages} onClick={() => load(page + 1)}>
            Próxima
          </button>
        </div>
      )}

      {showForm && (
        <div
          onClick={() => !saving && setShowForm(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d1410', border: '1px solid #1c2820', borderRadius: 14,
              width: '100%', maxWidth: 520, padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#e8f0e8' }}>Novo contato</span>
              <button onClick={() => !saving && setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6050', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Razão social / Nome *" full>
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.razao_social}
                  onChange={e => setForm(f => ({ ...f, razao_social: e.target.value }))} placeholder="Ex: Equipe u4digital - Teste" />
              </Field>
              <Field label="Nome fantasia" full>
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.nome_fantasia}
                  onChange={e => setForm(f => ({ ...f, nome_fantasia: e.target.value }))} />
              </Field>
              <Field label="Telefone (WhatsApp)">
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.phone_primary}
                  onChange={e => setForm(f => ({ ...f, phone_primary: e.target.value }))} placeholder="51999999999" />
              </Field>
              <Field label="Contato (pessoa)">
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.contato}
                  onChange={e => setForm(f => ({ ...f, contato: e.target.value }))} />
              </Field>
              <Field label="CNPJ">
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.cnpj}
                  onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} />
              </Field>
              <Field label="Cidade">
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.cidade}
                  onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} />
              </Field>
              <Field label="Estado">
                <input style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} value={form.estado}
                  onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} maxLength={2} />
              </Field>
              <Field label="Segmento">
                <select style={{ ...S.select, width: '100%', boxSizing: 'border-box' }} value={form.segmento}
                  onChange={e => setForm(f => ({ ...f, segmento: e.target.value }))}>
                  <option value="">—</option>
                  {SEGMENTO_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select style={{ ...S.select, width: '100%', boxSizing: 'border-box' }} value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo_recente">Inativo recente</option>
                  <option value="inativo_antigo">Inativo antigo</option>
                </select>
              </Field>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4a6050', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Marcas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {brands.map(b => {
                  const active = form.brand_ids.includes(b.id);
                  return (
                    <button key={b.id} onClick={() => toggleFormBrand(b.id)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                      border: active ? 'none' : '1px solid #1c2820',
                      background: active ? '#25D366' : 'transparent',
                      color: active ? '#fff' : '#8aaa90',
                    }}>
                      {b.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button onClick={saveContact} disabled={saving} style={{
                background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1, fontFamily: 'inherit',
              }}>
                {saving ? 'Salvando...' : 'Salvar contato'}
              </button>
              <button onClick={() => setShowForm(false)} disabled={saving} style={{
                background: '#131a16', color: '#8aaa90', border: '1px solid #1c2820',
                borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', gridColumn: full ? '1 / -1' : 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#4a6050', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}
