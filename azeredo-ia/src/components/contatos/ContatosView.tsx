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

export default function ContatosView() {
  const { toasts, dismiss, error: showError } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={S.root}>
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div style={S.header}>
        <div style={S.headerTop}>
          <span style={S.title}>Contatos</span>
          <span style={S.count}>{total.toLocaleString('pt-BR')} registros</span>
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
    </div>
  );
}
