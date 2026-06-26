'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Toast, useToast } from '../ui/Toast';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'sending' | 'completed' | 'error';
  total_count: number | null;
  sent_count: number | null;
  failed_count: number | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  az_templates: { name: string } | null;
}

interface Template { id: string; name: string; body: string; }
interface Brand    { id: string; name: string; }

interface SegmentFilter {
  brand_ids?: string[];
  cidade?: string;
  estado?: string;
  segmento?: string;
  status?: string;
}

interface PreviewResult {
  count: number;
  sample: { name: string; phone: string; cidade: string }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SEGMENTO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'Papelaria', label: 'Papelaria' },
  { value: 'Brinquedo', label: 'Brinquedo' },
  { value: 'Bazar', label: 'Bazar' },
  { value: 'Papelaria e Brinquedo', label: 'Papelaria e Brinquedo' },
  { value: 'Serviço', label: 'Serviço' },
  { value: 'Outros', label: 'Outros' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ativo', label: 'Ativos' },
  { value: 'inativo_recente', label: 'Inativo recente' },
  { value: 'inativo_antigo', label: 'Inativo antigo' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  draft:     { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: 'Rascunho' },
  sending:   { bg: 'rgba(37,211,102,0.12)',  color: '#25D366', label: 'Enviando' },
  completed: { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Concluído' },
  error:     { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Erro' },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function estimatedMinutes(total: number) {
  const seconds = total * 2;
  const mins = Math.ceil(seconds / 60);
  return mins === 1 ? '~1 minuto' : `~${mins} minutos`;
}

// ─── Shared style atoms ───────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: '#0d1410',
  border: '1px solid #1c2820',
  borderRadius: 8, color: '#e8f0e8',
  fontSize: 13, outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const btn = (variant: 'primary' | 'ghost' | 'danger' = 'ghost'): React.CSSProperties => ({
  padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
  fontFamily: 'inherit', fontWeight: 500, fontSize: 13,
  border: variant === 'ghost' ? '1px solid #1c2820' : 'none',
  background: variant === 'primary' ? '#25D366'
            : variant === 'danger'  ? '#25D366'
            : 'transparent',
  color: variant === 'ghost' ? '#8aaa90' : '#fff',
  transition: 'opacity 0.12s',
});

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#4a6050',
  textTransform: 'uppercase', letterSpacing: '0.06em',
  marginBottom: 6, display: 'block',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.draft;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 8px',
      borderRadius: 100, background: s.bg, color: s.color,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {status === 'sending' && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: s.color,
          animation: 'pulse-dot 1s ease-in-out infinite',
          display: 'inline-block',
        }} />
      )}
      {s.label}
    </span>
  );
}

function ProgressBar({ sent, total }: { sent: number; total: number }) {
  const pct = total > 0 ? Math.round((sent / total) * 100) : 0;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{
        height: 3, background: '#1c2820', borderRadius: 2, overflow: 'hidden', marginTop: 8,
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: '#25D366', borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ fontSize: 11, color: '#8aaa90', marginTop: 4 }}>
        {sent} / {total} enviados ({pct}%)
      </div>
    </div>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────

function CampaignCard({
  campaign,
  onExpand,
  expanded,
  onDelete,
}: {
  campaign: Campaign;
  onExpand: (id: string) => void;
  expanded: boolean;
  onDelete: (id: string) => void;
}) {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadRecipients = useCallback(async () => {
    if (recipients.length > 0) return;
    setLoadingRec(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`);
      const d = await res.json();
      setRecipients(d.recipients || []);
    } finally {
      setLoadingRec(false);
    }
  }, [campaign.id, recipients.length]);

  useEffect(() => {
    if (expanded) loadRecipients();
  }, [expanded, loadRecipients]);

  return (
    <div style={{
      background: '#111a12', border: '1px solid #1c2820',
      borderRadius: 10, marginBottom: 10, overflow: 'hidden',
    }}>
      {/* Card header row */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e8f0e8' }}>{campaign.name}</span>
            <StatusBadge status={campaign.status} />
            {campaign.az_templates?.name && (
              <span style={{ fontSize: 11, color: '#4a6050' }}>
                Template: {campaign.az_templates.name}
              </span>
            )}
          </div>

          {/* Metrics row */}
          {(campaign.total_count || 0) > 0 && (
            <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 4 }}>
              <span>
                <span style={{ color: '#4a6050' }}>Total </span>
                <span style={{ fontWeight: 600, color: '#e8f0e8' }}>{campaign.total_count ?? 0}</span>
              </span>
              <span>
                <span style={{ color: '#4a6050' }}>Enviados </span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>{campaign.sent_count ?? 0}</span>
              </span>
              <span>
                <span style={{ color: '#4a6050' }}>Falhos </span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{campaign.failed_count ?? 0}</span>
              </span>
            </div>
          )}

          {campaign.status === 'sending' && (campaign.total_count || 0) > 0 && (
            <ProgressBar
              sent={campaign.sent_count ?? 0}
              total={campaign.total_count ?? 0}
            />
          )}

          <div style={{ fontSize: 11, color: '#4a6050', marginTop: 4 }}>
            Criada {fmtDate(campaign.created_at)}
            {campaign.completed_at && ` · Concluída ${fmtDate(campaign.completed_at)}`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
          {/* Delete button — not allowed while sending */}
          {campaign.status !== 'sending' && (
            <button
              disabled={deleting}
              onClick={async () => {
                if (!confirm(`Excluir a campanha "${campaign.name}"?`)) return;
                setDeleting(true);
                try {
                  const r = await fetch(`/api/campaigns/${campaign.id}`, { method: 'DELETE' });
                  if (r.ok) onDelete(campaign.id);
                } finally { setDeleting(false); }
              }}
              title="Excluir campanha"
              style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
                borderRadius: 7, padding: '5px 8px', cursor: deleting ? 'not-allowed' : 'pointer',
                color: '#f87171', display: 'flex', alignItems: 'center', opacity: deleting ? 0.5 : 1,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          )}

          <button
            onClick={() => onExpand(campaign.id)}
            style={{
              ...btn('ghost'),
              fontSize: 12, padding: '6px 12px',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {expanded ? 'Fechar' : 'Detalhes'}
          </button>
        </div>
      </div>

      {/* Recipients panel */}
      {expanded && (
        <div style={{ borderTop: '1px solid #1c2820', padding: '12px 16px' }}>
          {loadingRec ? (
            <div style={{ color: '#4a6050', fontSize: 12 }}>Carregando destinatários...</div>
          ) : recipients.length === 0 ? (
            <div style={{ color: '#4a6050', fontSize: 12 }}>Nenhum destinatário registrado.</div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: '#4a6050', marginBottom: 8 }}>
                Mostrando até 100 destinatários
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {recipients.map((r: any) => {
                  const contact = r.az_contacts;
                  const name = contact?.nome_fantasia || contact?.razao_social || '—';
                  return (
                    <div key={r.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '6px 10px', borderRadius: 6,
                      background: '#0d1410', fontSize: 12,
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: r.status === 'sent' ? '#22c55e'
                                  : r.status === 'failed' ? '#ef4444'
                                  : '#4a6050',
                      }} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 500, color: '#e8f0e8' }}>{name}</span>
                        {contact?.cidade && (
                          <span style={{ color: '#4a6050', marginLeft: 6 }}>{contact.cidade}</span>
                        )}
                      </span>
                      <span style={{ color: '#4a6050', fontSize: 11 }}>
                        {r.status === 'sent' ? 'Enviado' : r.status === 'failed' ? 'Falhou' : 'Pendente'}
                      </span>
                      {r.error_message && (
                        <span style={{ color: '#ef4444', fontSize: 10 }} title={r.error_message}>!</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab 1: Campaign List ─────────────────────────────────────────────────────

function CampaignList({
  campaigns,
  loading,
  onDelete,
}: {
  campaigns: Campaign[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpanded(prev => prev === id ? null : id);
  }

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            height: 72, background: '#111a12', border: '1px solid #1c2820',
            borderRadius: 10, marginBottom: 10,
            animation: 'skeleton-pulse 1.4s ease-in-out infinite',
          }} />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 60, color: '#4a6050', gap: 8,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <div style={{ fontSize: 13 }}>Nenhuma campanha ainda.</div>
        <div style={{ fontSize: 12 }}>Crie uma na aba "Nova Campanha".</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {campaigns.map(c => (
        <CampaignCard
          key={c.id}
          campaign={c}
          onExpand={toggleExpand}
          expanded={expanded === c.id}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ─── Tab 2: Wizard ────────────────────────────────────────────────────────────

function NewCampaignWizard({
  onSuccess,
  toast,
}: {
  onSuccess: (campaignId: string) => void;
  toast: ReturnType<typeof useToast>;
}) {
  const [step, setStep] = useState(1);

  // Step 1: message
  const [name, setName] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const [templateId, setTemplateId] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Step 2: segment
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [filter, setFilter] = useState<SegmentFilter>({});
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  // Step 3: confirm
  const [sending, setSending] = useState(false);

  // Load templates + brands on mount
  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoadingTemplates(false); })
      .catch(() => setLoadingTemplates(false));

    fetch('/api/brands')
      .then(r => r.json())
      .then(d => { setBrands(d.brands || []); setLoadingBrands(false); })
      .catch(() => setLoadingBrands(false));
  }, []);

  const selectedTemplate = templates.find(t => t.id === templateId);
  const messageBody = useTemplate ? (selectedTemplate?.body || '') : customBody;

  // Step 1 → 2: create draft campaign first
  async function goToStep2() {
    if (!name.trim()) { toast.error('Nome da campanha é obrigatório'); return; }
    if (useTemplate && !templateId) { toast.error('Selecione um template'); return; }
    if (!useTemplate && !customBody.trim()) { toast.error('Escreva a mensagem'); return; }

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          template_id: useTemplate ? templateId : null,
          custom_body: !useTemplate ? customBody.trim() : null,
          segment_filter: {},
        }),
      });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || 'Erro ao criar campanha'); return; }
      setCampaignId(d.campaign.id);
      setStep(2);
    } catch {
      toast.error('Erro de conexão');
    }
  }

  // Fetch preview count
  async function loadPreview() {
    if (!campaignId) return;
    setPreviewLoading(true);
    setPreview(null);
    try {
      // Update segment filter first
      await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment_filter: filter }),
      });
      const res = await fetch(`/api/campaigns/${campaignId}/preview`);
      const d = await res.json();
      if (res.ok) setPreview(d);
      else toast.error(d.error || 'Erro ao contar destinatários');
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setPreviewLoading(false);
    }
  }

  // Step 2 → 3
  async function goToStep3() {
    if (!preview) { toast.error('Clique em "Contar destinatários" primeiro'); return; }
    if (preview.count === 0) { toast.error('Nenhum contato corresponde ao filtro'); return; }

    // Save final segment_filter to campaign
    if (campaignId) {
      await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment_filter: filter }),
      });
    }
    setStep(3);
  }

  // Step 3: fire!
  async function fireDisparo() {
    if (!campaignId) return;
    setSending(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: 'POST' });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || 'Erro ao disparar'); setSending(false); return; }
      toast.success(`Disparo iniciado — ${d.total} mensagens em fila`);
      onSuccess(campaignId);
    } catch {
      toast.error('Erro de conexão');
      setSending(false);
    }
  }

  function toggleBrand(id: string) {
    setFilter(f => {
      const ids = f.brand_ids || [];
      return {
        ...f,
        brand_ids: ids.includes(id) ? ids.filter(b => b !== id) : [...ids, id],
      };
    });
    setPreview(null);
  }

  // ── Render step ──

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {['Mensagem', 'Destinatários', 'Confirmar'].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done   = step > n;
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: done ? '#25D366' : active ? '#25D366' : '#1c2820',
                  color: (done || active) ? '#fff' : '#4a6050',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : n}
                </div>
                <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#e8f0e8' : '#4a6050' }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ width: 24, height: 1, background: '#1c2820', margin: '0 8px' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Mensagem ── */}
      {step === 1 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nome da campanha</label>
            <input
              style={inp}
              placeholder="Ex: Lançamento Outubro — Papelaria"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Toggle template vs custom */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mensagem</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[
                { id: true,  label: 'Usar template' },
                { id: false, label: 'Escrever mensagem' },
              ].map(opt => (
                <button
                  key={String(opt.id)}
                  onClick={() => setUseTemplate(opt.id)}
                  style={{
                    ...btn(useTemplate === opt.id ? 'primary' : 'ghost'),
                    fontSize: 12, padding: '6px 14px',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {useTemplate ? (
              loadingTemplates ? (
                <div style={{ fontSize: 12, color: '#4a6050' }}>Carregando templates...</div>
              ) : (
                <select
                  style={inp}
                  value={templateId}
                  onChange={e => setTemplateId(e.target.value)}
                >
                  <option value="">Selecione um template...</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )
            ) : (
              <div>
                <textarea
                  style={{ ...inp, minHeight: 120, resize: 'vertical', lineHeight: 1.5 }}
                  placeholder="Olá {{nome_fantasia}}, temos novidades para você..."
                  value={customBody}
                  onChange={e => setCustomBody(e.target.value)}
                />
                <div style={{ fontSize: 11, color: '#4a6050', marginTop: 4, textAlign: 'right' }}>
                  {customBody.length} caracteres
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {messageBody && (
            <div style={{
              background: '#0d1410', border: '1px solid #1c2820',
              borderRadius: 8, padding: 14, marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, color: '#4a6050', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Preview da mensagem
              </div>
              <div style={{ fontSize: 13, color: '#e8f0e8', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {messageBody
                  .replace(/\{\{nome_fantasia\}\}/gi, 'Papelaria Exemplo')
                  .replace(/\{\{nome\}\}/gi, 'Papelaria Exemplo')
                  .replace(/\{\{primeiro_nome\}\}/gi, 'Papelaria')
                  .replace(/\{\{cidade\}\}/gi, 'São Paulo')
                  .replace(/\{\{estado\}\}/gi, 'SP')
                  .replace(/\{\{contato\}\}/gi, 'João')
                  .replace(/\{\{segmento\}\}/gi, 'Papelaria')
                  .replace(/\{\{periodo_dia\}\}/gi, 'Bom dia')}
              </div>
            </div>
          )}

          <button onClick={goToStep2} style={btn('primary')}>
            Próximo →
          </button>
        </div>
      )}

      {/* ── Step 2: Destinatários ── */}
      {step === 2 && (
        <div>
          {/* Brands */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Marcas (multi-seleção)</label>
            {loadingBrands ? (
              <div style={{ fontSize: 12, color: '#4a6050' }}>Carregando marcas...</div>
            ) : brands.length === 0 ? (
              <div style={{ fontSize: 12, color: '#4a6050' }}>Nenhuma marca encontrada.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {brands.map(b => {
                  const active = (filter.brand_ids || []).includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleBrand(b.id)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12,
                        fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                        border: active ? 'none' : '1px solid #1c2820',
                        background: active ? '#25D366' : 'transparent',
                        color: active ? '#fff' : '#8aaa90',
                        transition: 'all 0.12s',
                      }}
                    >
                      {b.name}
                    </button>
                  );
                })}
              </div>
            )}
            {(filter.brand_ids?.length || 0) === 0 && (
              <div style={{ fontSize: 11, color: '#4a6050', marginTop: 6 }}>
                Nenhuma marca selecionada = todos os contatos com telefone.
              </div>
            )}
          </div>

          {/* Cidade */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Cidade</label>
            <input
              style={inp}
              placeholder="Ex: São Paulo"
              value={filter.cidade || ''}
              onChange={e => { setFilter(f => ({ ...f, cidade: e.target.value || undefined })); setPreview(null); }}
            />
          </div>

          {/* Segmento */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Segmento</label>
            <select
              style={inp}
              value={filter.segmento || ''}
              onChange={e => { setFilter(f => ({ ...f, segmento: e.target.value || undefined })); setPreview(null); }}
            >
              {SEGMENTO_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Status do cliente</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.map(o => {
                const active = (filter.status || '') === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => { setFilter(f => ({ ...f, status: o.value || undefined })); setPreview(null); }}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12,
                      fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                      border: active ? 'none' : '1px solid #1c2820',
                      background: active ? '#25D366' : 'transparent',
                      color: active ? '#fff' : '#8aaa90',
                      transition: 'all 0.12s',
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview count button */}
          <button
            onClick={loadPreview}
            disabled={previewLoading}
            style={{ ...btn('ghost'), marginBottom: 16, opacity: previewLoading ? 0.6 : 1 }}
          >
            {previewLoading ? 'Calculando...' : 'Contar destinatários'}
          </button>

          {/* Preview result */}
          {preview && (
            <div style={{
              background: '#0d1410', border: '1px solid #1c2820',
              borderRadius: 8, padding: 14, marginBottom: 20,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                <span style={{ color: '#25D366', fontSize: 22, fontWeight: 700 }}>{preview.count}</span>
                <span style={{ color: '#8aaa90', marginLeft: 6 }}>
                  {preview.count === 1 ? 'contato será atingido' : 'contatos serão atingidos'}
                </span>
              </div>
              {preview.sample.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: '#4a6050', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    Amostra
                  </div>
                  {preview.sample.map((s, i) => (
                    <div key={i} style={{
                      fontSize: 12, padding: '5px 0',
                      borderBottom: i < preview.sample.length - 1 ? '1px solid #1c2820' : 'none',
                      display: 'flex', gap: 10,
                    }}>
                      <span style={{ fontWeight: 500, flex: 1 }}>{s.name}</span>
                      {s.cidade && <span style={{ color: '#4a6050' }}>{s.cidade}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep(1)} style={btn('ghost')}>← Voltar</button>
            <button
              onClick={goToStep3}
              disabled={!preview || preview.count === 0}
              style={{ ...btn('primary'), opacity: (!preview || preview.count === 0) ? 0.5 : 1 }}
            >
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirmar e Disparar ── */}
      {step === 3 && (
        <div>
          <div style={{
            background: '#0d1410', border: '1px solid #1c2820',
            borderRadius: 10, padding: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Resumo da campanha</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#4a6050', width: 110, flexShrink: 0 }}>Nome</span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{name}</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#4a6050', width: 110, flexShrink: 0 }}>Mensagem</span>
                <span style={{ fontSize: 12, color: '#8aaa90' }}>
                  {useTemplate ? (selectedTemplate?.name || '—') : 'Mensagem personalizada'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#4a6050', width: 110, flexShrink: 0 }}>Destinatários</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#25D366' }}>
                  {preview?.count ?? 0} contatos
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#4a6050', width: 110, flexShrink: 0 }}>Estimativa</span>
                <span style={{ fontSize: 12, color: '#8aaa90' }}>
                  {estimatedMinutes(preview?.count ?? 0)}
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>(intervalo de 2s entre mensagens)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div style={{ fontSize: 12, color: '#f59e0b', lineHeight: 1.5 }}>
              Após iniciar, as mensagens serão enviadas em segundo plano com intervalo de 2 segundos.
              Não feche esta janela até receber a confirmação do disparo.
            </div>
          </div>

          {/* Fire button */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setStep(2)} style={btn('ghost')} disabled={sending}>
              ← Voltar
            </button>
            <button
              onClick={fireDisparo}
              disabled={sending}
              style={{
                ...btn('danger'),
                padding: '11px 28px', fontSize: 14, fontWeight: 700,
                opacity: sending ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {sending ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Iniciando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Iniciar Disparo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Root: DisparosView ───────────────────────────────────────────────────────

export default function DisparosView() {
  const [tab, setTab] = useState<'list' | 'new'>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toast = useToast();

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns?limit=50');
      const d = await res.json();
      setCampaigns(d.campaigns || []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Poll every 3s if any campaign is 'sending'
  useEffect(() => {
    const hasSending = campaigns.some(c => c.status === 'sending');

    if (hasSending) {
      if (!pollRef.current) {
        pollRef.current = setInterval(loadCampaigns, 3000);
      }
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [campaigns, loadCampaigns]);

  function onWizardSuccess(_campaignId: string) {
    // Switch to list and refresh
    setTab('list');
    setLoading(true);
    loadCampaigns();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        height: 56, borderBottom: '1px solid #1c2820', background: '#080c09',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 4, flexShrink: 0,
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, marginRight: 12 }}>Disparos</span>

        {/* Tabs */}
        {(['list', 'new'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500, fontSize: 13, border: 'none',
              background: tab === t ? 'rgba(37,211,102,0.1)' : 'transparent',
              color: tab === t ? '#25D366' : '#4a6050',
              transition: 'all 0.12s',
            }}
          >
            {t === 'list' ? 'Campanhas' : '+ Nova Campanha'}
          </button>
        ))}

        {/* Campaign count */}
        {tab === 'list' && !loading && (
          <span style={{ fontSize: 12, color: '#4a6050', marginLeft: 4 }}>
            {campaigns.length} {campaigns.length === 1 ? 'campanha' : 'campanhas'}
          </span>
        )}

        {/* Sending indicator */}
        {campaigns.some(c => c.status === 'sending') && (
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#25D366',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#25D366',
              animation: 'pulse-dot 1s ease-in-out infinite',
              display: 'inline-block',
            }} />
            Disparando...
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'list' ? (
          <CampaignList
            campaigns={campaigns}
            loading={loading}
            onRefresh={loadCampaigns}
            onDelete={id => setCampaigns(prev => prev.filter(c => c.id !== id))}
          />
        ) : (
          <NewCampaignWizard
            onSuccess={onWizardSuccess}
            toast={toast}
          />
        )}
      </div>

      <Toast toasts={toast.toasts} onDismiss={toast.dismiss} />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
