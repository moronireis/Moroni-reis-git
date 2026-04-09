import React, { useState, useCallback, useRef, useEffect } from 'react';

// CRM Board v3 — Opportunities panel + responsive

// ─── Types ───────────────────────────────────────────────────────────────────

interface Deal {
  id: string;
  title: string;
  contact_id?: string;
  contact_name: string;
  company: string;
  value: number;
  stage: DealStage;
  type: 'systems' | 'builders' | 'marketing';
  notes?: string;
  created_at: string;
  last_activity: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
  company?: string;
  source?: string;
  form_type?: string;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at?: string;
  opportunity_score?: number;
  best_fit_product?: string;
  cargo?: string;
  faturamento?: string;
  objetivo?: string;
}

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type ViewMode = 'pipeline' | 'list' | 'prospects' | 'oportunidades';
type ProductFilter = '' | 'marketing' | 'systems' | 'builders-mentoria' | 'builders-comunidade' | 'builders-formacao';

interface CRMBoardProps {
  initialDeals: Deal[];
  initialContacts: Contact[];
  totalContacts: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'rgba(255,255,255,0.5)' },
  { id: 'qualified', label: 'Qualificado', color: '#4A90FF' },
  { id: 'proposal', label: 'Proposta', color: '#F59E0B' },
  { id: 'negotiation', label: 'Negociação', color: '#8B5CF6' },
  { id: 'won', label: 'Fechado', color: '#22C55E' },
  { id: 'lost', label: 'Perdido', color: '#EF4444' },
];

const typeLabels: Record<string, { label: string; bg: string; color: string }> = {
  systems: { label: 'Systems', bg: 'rgba(74,144,255,0.1)', color: '#4A90FF' },
  builders: { label: 'Builders', bg: 'rgba(45,122,255,0.1)', color: '#2D7AFF' },
  marketing: { label: 'Marketing', bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
};

const PRODUCT_META: Record<string, { label: string; ticket: string; bg: string; color: string; border: string }> = {
  marketing: { label: 'Marketing', ticket: 'R$2K+', bg: 'rgba(139,92,246,0.08)', color: '#8B5CF6', border: 'rgba(139,92,246,0.2)' },
  systems: { label: 'Systems', ticket: 'R$5K+', bg: 'rgba(74,144,255,0.08)', color: '#4A90FF', border: 'rgba(74,144,255,0.2)' },
  'builders-mentoria': { label: 'Mentoria', ticket: 'R$3K+', bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
  'builders-comunidade': { label: 'Comunidade', ticket: 'R$497', bg: 'rgba(34,197,94,0.08)', color: '#22C55E', border: 'rgba(34,197,94,0.2)' },
  'builders-formacao': { label: 'Formação', ticket: 'R$1.5K', bg: 'rgba(6,182,212,0.08)', color: '#06B6D4', border: 'rgba(6,182,212,0.2)' },
};

const ALL_TAGS = ['MDV', 'AI Hunters', 'Formação', 'Mentoria MDA', 'Imersão', 'Diagnóstico', 'Outros', 'Boas-vindas', 'Comprador'];

const FATURAMENTO_OPTIONS = [
  'Não fatura',
  'Até R$5 mil',
  'De R$5 mil à R$10 mil',
  'De R$10 mil à R$20 mil',
  'De R$20 mil à R$30 mil',
  'Mais de R$30 mil',
];

const CARGO_OPTIONS = [
  'Empresário / Fundador / Sócio / CEO',
  'C-Level / Diretor',
  'Gerente/ Gestor/ Coordenador/ Supervisor',
  'Analista / Operacional',
  'Estudante',
];

const PRODUCT_KEYS = ['marketing', 'systems', 'builders-mentoria', 'builders-comunidade', 'builders-formacao'] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function getScoreBadgeStyle(score: number | undefined): React.CSSProperties {
  if (score === undefined || score === null) return { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' };
  if (score >= 90) return { background: 'rgba(34,197,94,0.12)', color: '#22C55E' };
  if (score >= 70) return { background: 'rgba(74,144,255,0.12)', color: '#4A90FF' };
  if (score >= 50) return { background: 'rgba(245,158,11,0.12)', color: '#F59E0B' };
  return { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' };
}

// ─── Input styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  background: '#161616',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '5px',
  display: 'block',
};

const fieldGroupStyle: React.CSSProperties = {
  marginBottom: '14px',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CRMBoard({ initialDeals, initialContacts, totalContacts }: CRMBoardProps) {
  // ── Deals state
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealEdits, setDealEdits] = useState<Partial<Deal>>({});
  const [dealSaving, setDealSaving] = useState(false);

  // ── Contacts state
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [contactTotal, setContactTotal] = useState(totalContacts);
  const [contactPage, setContactPage] = useState(1);
  const [contactSearch, setContactSearch] = useState('');
  const [contactTagFilter, setContactTagFilter] = useState('');
  const [contactFatFilter, setContactFatFilter] = useState('');
  const [contactCargoFilter, setContactCargoFilter] = useState('');
  const [contactPhoneFilter, setContactPhoneFilter] = useState(false);
  const [contactIgFilter, setContactIgFilter] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactEdits, setContactEdits] = useState<Partial<Contact>>({});
  const [contactSaving, setContactSaving] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Opportunities state
  const [oppContacts, setOppContacts] = useState<Contact[]>([]);
  const [oppTotal, setOppTotal] = useState(0);
  const [oppLoading, setOppLoading] = useState(false);
  const [oppProductFilter, setOppProductFilter] = useState<ProductFilter>('');
  const [oppPage, setOppPage] = useState(1);
  const [oppLoadingMore, setOppLoadingMore] = useState(false);
  const [oppSummary, setOppSummary] = useState<Record<string, { count: number; avgScore: number }>>({});

  // ── Shared state
  const [view, setView] = useState<ViewMode>('pipeline');
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [newDealForm, setNewDealForm] = useState({
    title: '',
    contact_name: '',
    company: '',
    value: '',
    type: 'systems' as Deal['type'],
    stage: 'lead' as DealStage,
  });
  const [saving, setSaving] = useState(false);

  // ─── Derived ───────────────────────────────────────────────────────────────
  const activePipelineStages = STAGES.filter(s => s.id !== 'lost');
  const totalPipeline = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((sum, d) => sum + d.value, 0);
  const totalWon = deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0);

  // Count of high-value opportunities (score >= 70)
  const [highValueCount, setHighValueCount] = useState(0);

  // ─── Load opportunities on tab switch ──────────────────────────────────────

  const fetchOpportunities = useCallback(async (product: ProductFilter, page: number, append = false) => {
    if (!append) setOppLoading(true);
    else setOppLoadingMore(true);
    try {
      const params = new URLSearchParams({
        sort: 'opportunity_score',
        order: 'desc',
        limit: '50',
        page: String(page),
        min_score: '1',
      });
      if (product) params.set('product', product);
      const res = await fetch(`/api/contacts?${params}`);
      if (!res.ok) { setError('Erro ao carregar oportunidades'); return; }
      const json = await res.json();
      if (append) {
        setOppContacts(prev => [...prev, ...(json.data || [])]);
      } else {
        setOppContacts(json.data || []);
      }
      setOppTotal(json.total || 0);
      setOppPage(page);
    } catch {
      setError('Erro de conexão');
    } finally {
      setOppLoading(false);
      setOppLoadingMore(false);
    }
  }, []);

  const fetchOppSummary = useCallback(async () => {
    // Fetch count + avg score per product
    const results: Record<string, { count: number; avgScore: number }> = {};
    await Promise.all(
      PRODUCT_KEYS.map(async (product) => {
        try {
          const params = new URLSearchParams({ sort: 'opportunity_score', order: 'desc', limit: '500', page: '1', product, min_score: '1' });
          const res = await fetch(`/api/contacts?${params}`);
          if (!res.ok) return;
          const json = await res.json();
          const items: Contact[] = json.data || [];
          const total: number = json.total || 0;
          const scores = items.map(c => c.opportunity_score || 0).filter(s => s > 0);
          const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
          results[product] = { count: total, avgScore: avg };
        } catch {
          results[product] = { count: 0, avgScore: 0 };
        }
      })
    );
    setOppSummary(results);

    // Count high-value (score >= 70) across all products
    try {
      const params = new URLSearchParams({ sort: 'opportunity_score', order: 'desc', limit: '1', page: '1', min_score: '70' });
      const res = await fetch(`/api/contacts?${params}`);
      if (res.ok) {
        const json = await res.json();
        setHighValueCount(json.total || 0);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (view === 'oportunidades') {
      fetchOpportunities(oppProductFilter, 1);
      if (Object.keys(oppSummary).length === 0) {
        fetchOppSummary();
      }
    }
    if (view === 'prospects' && contacts.length === 0) {
      fetchContacts('', '', 1);
    }
  }, [view]);

  // Fetch high-value count once on mount for summary card
  useEffect(() => {
    fetchOppSummary();
  }, []);

  // ─── Deal handlers ─────────────────────────────────────────────────────────

  const handleDrop = async (stage: DealStage) => {
    if (!draggedDeal) return;
    const previousDeals = deals;
    setDeals(prev => prev.map(d => d.id === draggedDeal
      ? { ...d, stage, last_activity: new Date().toISOString().split('T')[0] }
      : d
    ));
    setDraggedDeal(null);
    try {
      const res = await fetch(`/api/deals/${draggedDeal}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao atualizar deal');
        setDeals(previousDeals);
      }
    } catch {
      setError('Erro de conexão');
      setDeals(previousDeals);
    }
  };

  const handleCreateDeal = async () => {
    if (!newDealForm.title.trim() || !newDealForm.contact_name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDealForm.title.trim(),
          contact_name: newDealForm.contact_name.trim(),
          company: newDealForm.company.trim(),
          value: parseFloat(newDealForm.value) || 0,
          type: newDealForm.type,
          stage: newDealForm.stage,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao criar deal');
        return;
      }
      const newDeal = await res.json();
      setDeals(prev => [newDeal, ...prev]);
      setNewDealForm({ title: '', contact_name: '', company: '', value: '', type: 'systems', stage: 'lead' });
      setShowNewDeal(false);
    } catch {
      setError('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    const previousDeals = deals;
    setDeals(prev => prev.filter(d => d.id !== dealId));
    setSelectedDeal(null);
    try {
      const res = await fetch(`/api/deals/${dealId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao excluir deal');
        setDeals(previousDeals);
      }
    } catch {
      setError('Erro de conexão');
      setDeals(previousDeals);
    }
  };

  const openDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealEdits({
      title: deal.title,
      contact_name: deal.contact_name,
      company: deal.company,
      value: deal.value,
      stage: deal.stage,
      type: deal.type,
      notes: deal.notes || '',
    });
  };

  const handleSaveDeal = async () => {
    if (!selectedDeal) return;
    setDealSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${selectedDeal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealEdits),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao salvar deal');
        return;
      }
      const updated = await res.json();
      setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
      setSelectedDeal(updated);
      setDealEdits({
        title: updated.title,
        contact_name: updated.contact_name,
        company: updated.company,
        value: updated.value,
        stage: updated.stage,
        type: updated.type,
        notes: updated.notes || '',
      });
    } catch {
      setError('Erro de conexão');
    } finally {
      setDealSaving(false);
    }
  };

  // ─── Contact handlers ──────────────────────────────────────────────────────

  const fetchContacts = useCallback(async (search: string, tag: string, page: number, append = false, filters?: { faturamento?: string; cargo?: string; hasPhone?: boolean; hasIg?: boolean }) => {
    if (!append) setContactsLoading(true);
    else setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (search) params.set('q', search);
      if (tag) params.set('tag', tag);
      if (filters?.faturamento) params.set('faturamento', filters.faturamento);
      if (filters?.cargo) params.set('cargo', filters.cargo);
      if (filters?.hasPhone) params.set('has_phone', 'true');
      if (filters?.hasIg) params.set('has_ig', 'true');
      const res = await fetch(`/api/contacts?${params}`);
      if (!res.ok) { setError('Erro ao carregar contatos'); return; }
      const json = await res.json();
      if (append) {
        setContacts(prev => [...prev, ...(json.data || [])]);
      } else {
        setContacts(json.data || []);
      }
      setContactTotal(json.total || 0);
      setContactPage(page);
    } catch {
      setError('Erro de conexão');
    } finally {
      setContactsLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const getFilters = (overrides?: Partial<{ faturamento: string; cargo: string; hasPhone: boolean; hasIg: boolean }>) => ({
    faturamento: overrides?.faturamento ?? contactFatFilter,
    cargo: overrides?.cargo ?? contactCargoFilter,
    hasPhone: overrides?.hasPhone ?? contactPhoneFilter,
    hasIg: overrides?.hasIg ?? contactIgFilter,
  });

  const handleSearchChange = (value: string) => {
    setContactSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchContacts(value, contactTagFilter, 1, false, getFilters());
    }, 350);
  };

  const handleTagFilterChange = (tag: string) => {
    setContactTagFilter(tag);
    fetchContacts(contactSearch, tag, 1, false, getFilters());
  };

  const handleFatFilterChange = (fat: string) => {
    setContactFatFilter(fat);
    fetchContacts(contactSearch, contactTagFilter, 1, false, getFilters({ faturamento: fat }));
  };

  const handleCargoFilterChange = (cargo: string) => {
    setContactCargoFilter(cargo);
    fetchContacts(contactSearch, contactTagFilter, 1, false, getFilters({ cargo }));
  };

  const handlePhoneFilterToggle = () => {
    const next = !contactPhoneFilter;
    setContactPhoneFilter(next);
    fetchContacts(contactSearch, contactTagFilter, 1, false, getFilters({ hasPhone: next }));
  };

  const handleIgFilterToggle = () => {
    const next = !contactIgFilter;
    setContactIgFilter(next);
    fetchContacts(contactSearch, contactTagFilter, 1, false, getFilters({ hasIg: next }));
  };

  const handleLoadMore = () => {
    fetchContacts(contactSearch, contactTagFilter, contactPage + 1, true, getFilters());
  };

  const openContact = (contact: Contact) => {
    setSelectedContact(contact);
    setContactEdits({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      instagram: contact.instagram || '',
      company: contact.company || '',
      notes: contact.notes || '',
      tags: contact.tags ? [...contact.tags] : [],
    });
    setNewTagInput('');
    setShowTagInput(false);
  };

  const handleSaveContact = async () => {
    if (!selectedContact) return;
    setContactSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactEdits),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao salvar contato');
        return;
      }
      const updated = await res.json();
      setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
      setOppContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedContact(updated);
      setContactEdits({
        name: updated.name,
        email: updated.email,
        phone: updated.phone || '',
        instagram: updated.instagram || '',
        company: updated.company || '',
        notes: updated.notes || '',
        tags: updated.tags ? [...updated.tags] : [],
      });
    } catch {
      setError('Erro de conexão');
    } finally {
      setContactSaving(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    const prev = contacts;
    setContacts(c => c.filter(x => x.id !== contactId));
    setOppContacts(c => c.filter(x => x.id !== contactId));
    setContactTotal(t => t - 1);
    setSelectedContact(null);
    try {
      const res = await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao excluir contato');
        setContacts(prev);
        setContactTotal(t => t + 1);
      }
    } catch {
      setError('Erro de conexão');
      setContacts(prev);
      setContactTotal(t => t + 1);
    }
  };

  const removeTag = (tag: string) => {
    setContactEdits(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));
  };

  const addTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    const existing = contactEdits.tags || [];
    if (existing.includes(trimmed)) return;
    setContactEdits(prev => ({ ...prev, tags: [...(prev.tags || []), trimmed] }));
    setNewTagInput('');
    setShowTagInput(false);
  };

  // ─── Opportunity handlers ──────────────────────────────────────────────────

  const handleOppProductFilter = (product: ProductFilter) => {
    setOppProductFilter(product);
    fetchOpportunities(product, 1);
  };

  const handleOppLoadMore = () => {
    fetchOpportunities(oppProductFilter, oppPage + 1, true);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '8px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          color: '#EF4444', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="crm-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Pipeline Total</div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>{formatCurrency(totalPipeline)}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{deals.filter(d => !['won','lost'].includes(d.stage)).length} deals ativos</div>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Fechados</div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#22C55E' }}>{formatCurrency(totalWon)}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{deals.filter(d => d.stage === 'won').length} deals</div>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Prospects</div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#4A90FF' }}>{contactTotal.toLocaleString('pt-BR')}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>contatos</div>
        </div>
        <div
          onClick={() => setView('oportunidades')}
          style={{ padding: '20px', borderRadius: '12px', background: '#0A0A0A', border: `1px solid ${view === 'oportunidades' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: 'border-color 200ms ease' }}
        >
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Oportunidades</div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#8B5CF6' }}>
            {highValueCount > 0 ? highValueCount.toLocaleString('pt-BR') : '—'}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>score 70+</div>
        </div>
      </div>

      {/* View Toggle + New Deal */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '10px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
          {(['pipeline', 'list', 'prospects', 'oportunidades'] as ViewMode[]).map(v => {
            const labels: Record<ViewMode, string> = { pipeline: 'Pipeline', list: 'Lista', prospects: 'Leads', oportunidades: 'Oportunidades' };
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer',
                  background: view === v ? '#111111' : 'transparent',
                  color: view === v ? '#fff' : 'rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>
        {(view === 'pipeline' || view === 'list') && (
          <button
            onClick={() => setShowNewDeal(true)}
            style={{ padding: '8px 16px', borderRadius: '8px', background: '#4A90FF', color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            + Novo Deal
          </button>
        )}
      </div>

      {/* New Deal Form */}
      {showNewDeal && (
        <div style={{ marginBottom: '20px', padding: '20px', borderRadius: '12px', background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '16px' }}>Novo Deal</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <input placeholder="Título *" value={newDealForm.title} onChange={e => setNewDealForm(f => ({ ...f, title: e.target.value }))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
            <input placeholder="Nome do contato *" value={newDealForm.contact_name} onChange={e => setNewDealForm(f => ({ ...f, contact_name: e.target.value }))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
            <input placeholder="Empresa" value={newDealForm.company} onChange={e => setNewDealForm(f => ({ ...f, company: e.target.value }))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
            <input placeholder="Valor (R$)" type="number" value={newDealForm.value} onChange={e => setNewDealForm(f => ({ ...f, value: e.target.value }))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
            <select value={newDealForm.type} onChange={e => setNewDealForm(f => ({ ...f, type: e.target.value as Deal['type'] }))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              <option value="systems">Systems</option>
              <option value="builders">Builders</option>
              <option value="marketing">Marketing</option>
            </select>
            <select value={newDealForm.stage} onChange={e => setNewDealForm(f => ({ ...f, stage: e.target.value as DealStage }))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleCreateDeal} disabled={saving} style={{ padding: '10px 20px', borderRadius: '8px', background: '#4A90FF', color: '#fff', fontSize: '13px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Criando...' : 'Criar Deal'}
            </button>
            <button onClick={() => setShowNewDeal(false)} style={{ padding: '10px 14px', borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Deal Detail Slide-over ────────────────────────────────────────── */}
      {selectedDeal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setSelectedDeal(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div className="slideover-panel" style={{ position: 'relative', width: '480px', maxWidth: '100vw', height: '100%', background: '#0A0A0A', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '32px', overflowY: 'auto' }}>
            <button onClick={() => setSelectedDeal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '20px' }}>×</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: typeLabels[selectedDeal.type].bg, color: typeLabels[selectedDeal.type].color }}>{typeLabels[selectedDeal.type].label}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: STAGES.find(s => s.id === selectedDeal.stage)?.color }}>{STAGES.find(s => s.id === selectedDeal.stage)?.label}</span>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>Editar Deal</div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Título</label>
              <input value={dealEdits.title || ''} onChange={e => setDealEdits(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Nome do Contato</label>
              <input value={dealEdits.contact_name || ''} onChange={e => setDealEdits(p => ({ ...p, contact_name: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Empresa</label>
              <input value={dealEdits.company || ''} onChange={e => setDealEdits(p => ({ ...p, company: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Valor (R$)</label>
              <input type="number" value={dealEdits.value ?? ''} onChange={e => setDealEdits(p => ({ ...p, value: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Estágio</label>
                <select value={dealEdits.stage || 'lead'} onChange={e => setDealEdits(p => ({ ...p, stage: e.target.value as DealStage }))} style={{ ...inputStyle, color: 'rgba(255,255,255,0.7)' }}>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select value={dealEdits.type || 'systems'} onChange={e => setDealEdits(p => ({ ...p, type: e.target.value as Deal['type'] }))} style={{ ...inputStyle, color: 'rgba(255,255,255,0.7)' }}>
                  <option value="systems">Systems</option>
                  <option value="builders">Builders</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Notas</label>
              <textarea value={dealEdits.notes || ''} onChange={e => setDealEdits(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button
              onClick={handleSaveDeal}
              disabled={dealSaving}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', background: '#4A90FF', color: '#fff', fontSize: '13px', fontWeight: 500, border: 'none', cursor: dealSaving ? 'not-allowed' : 'pointer', opacity: dealSaving ? 0.6 : 1, marginBottom: '24px' }}
            >
              {dealSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Criado em: {formatDate(selectedDeal.created_at)}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Última atividade: {selectedDeal.last_activity}</div>
            </div>

            {/* WhatsApp — find phone from contacts by name match */}
            {(() => {
              const matchedContact = contacts.find(c =>
                c.name.toLowerCase() === (selectedDeal.contact_name || '').toLowerCase() ||
                (c.company && c.company.toLowerCase() === (selectedDeal.company || '').toLowerCase())
              );
              const phone = matchedContact?.phone;
              if (!phone) return null;
              return (
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer', width: '100%', textDecoration: 'none', marginBottom: '8px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chamar no WhatsApp
                </a>
              );
            })()}

            <button
              onClick={() => handleDeleteDeal(selectedDeal.id)}
              style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', width: '100%' }}
            >
              Excluir deal
            </button>
          </div>
        </div>
      )}

      {/* ── Contact Detail Slide-over ─────────────────────────────────────── */}
      {selectedContact && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setSelectedContact(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div className="slideover-panel" style={{ position: 'relative', width: '480px', maxWidth: '100vw', height: '100%', background: '#0A0A0A', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '32px', overflowY: 'auto' }}>
            <button onClick={() => setSelectedContact(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '20px' }}>×</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {selectedContact.source && (
                <div style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(74,144,255,0.1)', color: '#4A90FF' }}>
                  Origem: {selectedContact.source}
                </div>
              )}
              {selectedContact.best_fit_product && PRODUCT_META[selectedContact.best_fit_product] && (
                <div style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: PRODUCT_META[selectedContact.best_fit_product].bg, color: PRODUCT_META[selectedContact.best_fit_product].color, border: `1px solid ${PRODUCT_META[selectedContact.best_fit_product].border}` }}>
                  {PRODUCT_META[selectedContact.best_fit_product].label}
                </div>
              )}
              {selectedContact.opportunity_score !== undefined && selectedContact.opportunity_score !== null && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '2px 8px', borderRadius: '6px', ...getScoreBadgeStyle(selectedContact.opportunity_score) }}>
                  Score: {selectedContact.opportunity_score}
                </div>
              )}
            </div>

            <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>Editar Contato</div>

            {selectedContact.cargo && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Cargo: {selectedContact.cargo}</div>
            )}
            {selectedContact.faturamento && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>Faturamento: {selectedContact.faturamento}</div>
            )}

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Nome</label>
              <input value={contactEdits.name || ''} onChange={e => setContactEdits(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={contactEdits.email || ''} onChange={e => setContactEdits(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Telefone</label>
              <input value={contactEdits.phone || ''} onChange={e => setContactEdits(p => ({ ...p, phone: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Instagram</label>
              <input value={contactEdits.instagram || ''} onChange={e => setContactEdits(p => ({ ...p, instagram: e.target.value }))} style={inputStyle} placeholder="@usuario" />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Empresa</label>
              <input value={contactEdits.company || ''} onChange={e => setContactEdits(p => ({ ...p, company: e.target.value }))} style={inputStyle} />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Notas</label>
              <textarea value={contactEdits.notes || ''} onChange={e => setContactEdits(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Tags */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                {(contactEdits.tags || []).map(tag => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(74,144,255,0.1)', color: '#4A90FF', border: '1px solid rgba(74,144,255,0.2)' }}>
                    {tag}
                    <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#4A90FF', cursor: 'pointer', fontSize: '13px', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
                {showTagInput ? (
                  <input
                    autoFocus
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') setShowTagInput(false); }}
                    onBlur={addTag}
                    placeholder="nova tag..."
                    style={{ ...inputStyle, width: '120px', padding: '3px 8px', fontSize: '12px' }}
                  />
                ) : (
                  <button
                    onClick={() => setShowTagInput(true)}
                    style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                  >
                    + Adicionar tag
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleSaveContact}
              disabled={contactSaving}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', background: '#4A90FF', color: '#fff', fontSize: '13px', fontWeight: 500, border: 'none', cursor: contactSaving ? 'not-allowed' : 'pointer', opacity: contactSaving ? 0.6 : 1, marginBottom: '24px' }}
            >
              {contactSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Criado em: {formatDate(selectedContact.created_at)}</div>
              {selectedContact.form_type && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Formulário: {selectedContact.form_type}</div>
              )}
            </div>

            {/* WhatsApp button */}
            {(contactEdits.phone || selectedContact.phone) && (
              <a
                href={`https://wa.me/${(contactEdits.phone || selectedContact.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer', width: '100%', textDecoration: 'none', marginBottom: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chamar no WhatsApp
              </a>
            )}

            <button
              onClick={() => handleDeleteContact(selectedContact.id)}
              style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', width: '100%' }}
            >
              Excluir contato
            </button>
          </div>
        </div>
      )}

      {/* ── Pipeline View ─────────────────────────────────────────────────── */}
      {view === 'pipeline' && (
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${activePipelineStages.length}, minmax(200px, 1fr))`, gap: '12px', minWidth: '900px' }}>
            {activePipelineStages.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage.id);
              const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div
                  key={stage.id}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(stage.id)}
                  style={{ borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', padding: '14px', minHeight: '350px' }}
                >
                  <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '9999px', background: stage.color }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{stage.label}</span>
                      <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{stageDeals.length}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{formatCurrency(stageTotal)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => setDraggedDeal(deal.id)}
                        onDragEnd={() => setDraggedDeal(null)}
                        onClick={() => openDeal(deal)}
                        style={{ padding: '12px', borderRadius: '10px', background: '#111111', border: '1px solid rgba(255,255,255,0.06)', cursor: 'grab', opacity: draggedDeal === deal.id ? 0.5 : 1 }}
                      >
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: 400, marginBottom: '4px' }}>{deal.title}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{deal.contact_name}{deal.company ? ` — ${deal.company}` : ''}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{formatCurrency(deal.value)}</span>
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: typeLabels[deal.type].bg, color: typeLabels[deal.type].color }}>{typeLabels[deal.type].label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── List View ─────────────────────────────────────────────────────── */}
      {view === 'list' && (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', minWidth: '600px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Deal', 'Contato', 'Valor', 'Estágio', 'Tipo', 'Última Atividade'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map(deal => (
                  <tr key={deal.id} onClick={() => openDeal(deal)} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#fff' }}>{deal.title}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', color: '#fff' }}>{deal.contact_name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{deal.company}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500, color: '#fff' }}>{formatCurrency(deal.value)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', color: STAGES.find(s => s.id === deal.stage)?.color }}>
                        {STAGES.find(s => s.id === deal.stage)?.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: typeLabels[deal.type].bg, color: typeLabels[deal.type].color }}>{typeLabels[deal.type].label}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{deal.last_activity}</td>
                  </tr>
                ))}
                {deals.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Nenhum deal ainda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Prospects View ────────────────────────────────────────────────── */}
      {view === 'prospects' && (
        <div>
          {/* Search + Filter Bar */}
          <div style={{ marginBottom: '16px', padding: '16px', borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Row 1: Search + count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 200px', background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0 12px', minWidth: '200px' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                  <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  value={contactSearch}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Buscar por nome, email, telefone..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', padding: '10px 0' }}
                />
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                {contactsLoading ? '...' : `${contactTotal.toLocaleString('pt-BR')} contatos`}
              </div>
            </div>

            {/* Row 2: Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginRight: '4px' }}>Filtros</span>

              <select value={contactTagFilter} onChange={e => handleTagFilterChange(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', background: contactTagFilter ? 'rgba(74,144,255,0.1)' : '#111111', border: `1px solid ${contactTagFilter ? 'rgba(74,144,255,0.2)' : 'rgba(255,255,255,0.07)'}`, color: contactTagFilter ? '#4A90FF' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                <option value="">Origem</option>
                {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select value={contactFatFilter} onChange={e => handleFatFilterChange(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', background: contactFatFilter ? 'rgba(74,144,255,0.1)' : '#111111', border: `1px solid ${contactFatFilter ? 'rgba(74,144,255,0.2)' : 'rgba(255,255,255,0.07)'}`, color: contactFatFilter ? '#4A90FF' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                <option value="">Faturamento</option>
                {FATURAMENTO_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>

              <select value={contactCargoFilter} onChange={e => handleCargoFilterChange(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', background: contactCargoFilter ? 'rgba(74,144,255,0.1)' : '#111111', border: `1px solid ${contactCargoFilter ? 'rgba(74,144,255,0.2)' : 'rgba(255,255,255,0.07)'}`, color: contactCargoFilter ? '#4A90FF' : 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                <option value="">Cargo</option>
                {CARGO_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button onClick={handlePhoneFilterToggle}
                style={{ padding: '6px 10px', borderRadius: '6px', background: contactPhoneFilter ? 'rgba(34,197,94,0.1)' : '#111111', border: `1px solid ${contactPhoneFilter ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`, color: contactPhoneFilter ? '#22C55E' : 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer' }}>
                Com telefone
              </button>

              <button onClick={handleIgFilterToggle}
                style={{ padding: '6px 10px', borderRadius: '6px', background: contactIgFilter ? 'rgba(139,92,246,0.1)' : '#111111', border: `1px solid ${contactIgFilter ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.07)'}`, color: contactIgFilter ? '#8B5CF6' : 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer' }}>
                Com Instagram
              </button>

              {(contactTagFilter || contactFatFilter || contactCargoFilter || contactPhoneFilter || contactIgFilter) && (
                <button onClick={() => {
                  setContactTagFilter('');
                  setContactFatFilter('');
                  setContactCargoFilter('');
                  setContactPhoneFilter(false);
                  setContactIgFilter(false);
                  fetchContacts(contactSearch, '', 1, false, { faturamento: '', cargo: '', hasPhone: false, hasIg: false });
                }}
                  style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}>
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Contacts Table */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', minWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Nome', 'Email', 'Telefone', 'Instagram', 'Origem', 'Tags'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contactsLoading && contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Carregando...</td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Nenhum contato encontrado.</td>
                    </tr>
                  ) : (
                    contacts.map(contact => (
                      <tr
                        key={contact.id}
                        onClick={() => openContact(contact)}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#fff', fontWeight: 400 }}>{contact.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{contact.email}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{contact.phone || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{contact.instagram || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.source ? (
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(74,144,255,0.08)', color: '#4A90FF', border: '1px solid rgba(74,144,255,0.15)' }}>{contact.source}</span>
                          ) : <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>—</span>}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {(contact.tags || []).slice(0, 2).map(tag => (
                              <span key={tag} style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{tag}</span>
                            ))}
                            {(contact.tags || []).length > 2 && (
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>+{(contact.tags || []).length - 2}</span>
                            )}
                            {(!contact.tags || contact.tags.length === 0) && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>—</span>}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {contacts.length < contactTotal && !contactsLoading && (
                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{ padding: '9px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: loadingMore ? 'not-allowed' : 'pointer', opacity: loadingMore ? 0.6 : 1 }}
                  >
                    {loadingMore ? 'Carregando...' : `Carregar mais (${contactTotal - contacts.length} restantes)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Oportunidades View ─────────────────────────────────────────────── */}
      {view === 'oportunidades' && (
        <div>
          {/* Product Summary Cards */}
          <div className="opp-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {PRODUCT_KEYS.map(product => {
              const meta = PRODUCT_META[product];
              const summary = oppSummary[product];
              return (
                <div
                  key={product}
                  onClick={() => handleOppProductFilter(oppProductFilter === product ? '' : product)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: oppProductFilter === product ? meta.bg : '#0A0A0A',
                    border: `1px solid ${oppProductFilter === product ? meta.border : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    transition: 'background 200ms ease, border-color 200ms ease',
                  }}
                >
                  <div style={{ fontSize: '11px', color: meta.color, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{meta.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    {summary ? summary.count.toLocaleString('pt-BR') : '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>{meta.ticket}</div>
                  {summary && summary.avgScore > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', padding: '2px 7px', borderRadius: '5px', ...getScoreBadgeStyle(summary.avgScore) }}>
                      Score: {summary.avgScore}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Product Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '10px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px', overflowX: 'auto', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleOppProductFilter('')}
              style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: oppProductFilter === '' ? '#111111' : 'transparent', color: oppProductFilter === '' ? '#fff' : 'rgba(255,255,255,0.5)' }}
            >
              Todos
            </button>
            {PRODUCT_KEYS.map(product => {
              const meta = PRODUCT_META[product];
              const active = oppProductFilter === product;
              return (
                <button
                  key={product}
                  onClick={() => handleOppProductFilter(active ? '' : product)}
                  style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    background: active ? meta.bg : 'transparent',
                    color: active ? meta.color : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          {/* Leads Table */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', minWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Score', 'Nome', 'Cargo', 'Faturamento', 'Produto'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {oppLoading && oppContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Carregando...</td>
                    </tr>
                  ) : oppContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Nenhuma oportunidade encontrada.</td>
                    </tr>
                  ) : (
                    oppContacts.map(contact => {
                      const productMeta = contact.best_fit_product ? PRODUCT_META[contact.best_fit_product] : null;
                      return (
                        <tr
                          key={contact.id}
                          onClick={() => openContact(contact)}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, ...getScoreBadgeStyle(contact.opportunity_score) }}>
                              {contact.opportunity_score ?? '—'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontSize: '13px', color: '#fff', fontWeight: 400 }}>{contact.name}</div>
                            {contact.email && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{contact.email}</div>}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                            {contact.cargo || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            {contact.faturamento || '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {productMeta ? (
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: productMeta.bg, color: productMeta.color, border: `1px solid ${productMeta.border}` }}>
                                {productMeta.label}
                              </span>
                            ) : <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {oppContacts.length < oppTotal && !oppLoading && (
                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <button
                    onClick={handleOppLoadMore}
                    disabled={oppLoadingMore}
                    style={{ padding: '9px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: oppLoadingMore ? 'not-allowed' : 'pointer', opacity: oppLoadingMore ? 0.6 : 1 }}
                  >
                    {oppLoadingMore ? 'Carregando...' : `Carregar mais (${oppTotal - oppContacts.length} restantes)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Won/Lost summary (Pipeline + List views only) ─────────────────── */}
      {(view === 'pipeline' || view === 'list') && (
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {(['won', 'lost'] as DealStage[]).map(stageId => {
            const stage = STAGES.find(s => s.id === stageId)!;
            const stageDeals = deals.filter(d => d.stage === stageId);
            return (
              <div key={stageId} style={{ borderRadius: '12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '9999px', background: stage.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{stage.label}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>({stageDeals.length})</span>
                </div>
                {stageDeals.map(deal => (
                  <div key={deal.id} onClick={() => openDeal(deal)} style={{ padding: '10px', borderRadius: '8px', background: '#111111', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{deal.title}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{deal.contact_name}</div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: stage.color }}>{formatCurrency(deal.value)}</span>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Nenhum deal</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .opp-summary-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .crm-summary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .opp-summary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .slideover-panel {
            width: 100vw !important;
            max-width: 100vw !important;
          }
        }
        @media (max-width: 400px) {
          .crm-summary-grid {
            grid-template-columns: 1fr !important;
          }
          .opp-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
