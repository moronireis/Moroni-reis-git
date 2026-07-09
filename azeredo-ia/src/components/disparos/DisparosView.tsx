'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Toast, useToast } from '../ui/Toast';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'sending' | 'completed' | 'cancelled' | 'error';
  total_count: number | null;
  sent_count: number | null;
  delivered_count: number | null;
  failed_count: number | null;
  last_error?: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  az_templates: { name: string } | null;
  az_whatsapp_instances: { display_name: string | null; uazapi_name: string; phone_number: string | null } | null;
}

interface Template { id: string; name: string; body: string; media_url?: string | null; media_type?: 'image' | 'video' | null; }
interface Brand    { id: string; name: string; }
interface Instance {
  id: string;
  display_name: string | null;
  uazapi_name: string;
  phone_number: string | null;
  status: string;
}

interface SegmentFilter {
  brand_ids?: string[];
  cidade?: string;
  estado?: string;
  segmento?: string;
  status?: string;          // legado: rascunhos antigos salvaram single-select
  status_in?: string[];     // multi-select de status do cliente
  vendedor?: string;        // vendedor_principal (M3 — carteira Mercos)
  tags?: string[];
  include_ids?: string[];   // contatos adicionados manualmente à lista
  exclude_ids?: string[];   // contatos removidos manualmente da lista
  manual_only?: boolean;    // lista montada do zero: só include_ids
}

interface PreviewContact {
  id: string;
  name: string;
  phone: string;
  cidade: string | null;
  estado?: string | null;
  contato?: string | null;
  segmento?: string | null;
  manual: boolean;
}

interface PreviewResult {
  count: number;
  duplicates: number;
  contacts: PreviewContact[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PREVIEW_PAGE = 100;

const ESTADO_OPTIONS = [
  'RS', 'SC', 'PR', 'SP', 'MG', 'RJ', 'ES', 'MS', 'MT', 'GO', 'DF',
  'BA', 'PE', 'CE', 'MA', 'PI', 'RN', 'PB', 'SE', 'AL', 'AM', 'PA',
  'AC', 'RO', 'RR', 'AP', 'TO',
];

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativos' },
  { value: 'inativo_recente', label: 'Inativo recente' },
  { value: 'inativo_antigo', label: 'Inativo antigo' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  draft:     { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: 'Rascunho' },
  sending:   { bg: 'rgba(37,211,102,0.12)',  color: '#25D366', label: 'Enviando' },
  completed: { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Concluído' },
  cancelled: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'Cancelado' },
  error:     { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Erro' },
};

const RECIPIENT_LABEL: Record<string, { color: string; label: string }> = {
  pending:    { color: '#4a6050', label: 'Aguardando' },
  processing: { color: '#25D366', label: 'Enviando…' },
  sent:       { color: '#22c55e', label: 'Enviado' },
  delivered:  { color: '#22c55e', label: 'Entregue' },
  read:       { color: '#22c55e', label: 'Lido' },
  failed:     { color: '#ef4444', label: 'Falhou' },
  skipped:    { color: '#6b7280', label: 'Ignorado' },
};

// Dispara o worker da fila — idempotente (o lease no servidor impede
// processamento duplicado), então pode ser chamado a cada polling.
function pumpCampaign(id: string) {
  fetch(`/api/campaigns/${id}/process`, { method: 'POST' }).catch(() => {});
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
function estimatedMinutes(total: number) {
  const mins = Math.ceil((total * 3) / 60); // ~3s por mensagem (2s + jitter)
  return mins <= 1 ? '~1 minuto' : `~${mins} minutos`;
}
function instanceLabel(inst: Campaign['az_whatsapp_instances']): string {
  if (!inst) return '';
  return inst.display_name || inst.uazapi_name;
}
// Espelho client-side do resolveVariables do servidor — para a prévia da
// mensagem final no passo Confirmar (renderizada com um contato real)
function renderMessage(template: string, c?: PreviewContact | null): string {
  const nome = c?.name || 'Papelaria Exemplo';
  const primeiro = nome.split(' ')[0] || nome;
  const hour = new Date().getHours();
  const periodo = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  return template
    .replace(/\{\{nome\}\}/gi, nome)
    .replace(/\{\{nome_fantasia\}\}/gi, nome)
    .replace(/\{\{primeiro_nome\}\}/gi, primeiro)
    .replace(/\{\{cidade\}\}/gi, c?.cidade || 'Santa Maria')
    .replace(/\{\{estado\}\}/gi, c?.estado || 'RS')
    .replace(/\{\{contato\}\}/gi, c?.contato || '')
    .replace(/\{\{segmento\}\}/gi, c?.segmento || '')
    .replace(/\{\{periodo_dia\}\}/gi, periodo);
}

function fmtPhone(p: string | null): string {
  const d = (p || '').replace(/\D/g, '');
  if (d.length === 13) return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`;
  if (d.length === 12) return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,8)}-${d.slice(8)}`;
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return p || '';
}

// ─── Shared style atoms ───────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: '#0d1410', border: '1px solid #1c2820',
  borderRadius: 8, color: '#e8f0e8',
  fontSize: 13, outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
};

const btn = (variant: 'primary' | 'ghost' | 'danger' = 'ghost'): React.CSSProperties => ({
  padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
  fontFamily: 'inherit', fontWeight: 500, fontSize: 13,
  border: variant === 'ghost' ? '1px solid #1c2820' : 'none',
  background: variant === 'primary' ? '#25D366'
            : variant === 'danger'  ? '#ef4444'
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
          animation: 'pulse-dot 1s ease-in-out infinite', display: 'inline-block',
        }} />
      )}
      {s.label}
    </span>
  );
}

function ProgressBar({ sent, failed, total, compact = false }: { sent: number; failed: number; total: number; compact?: boolean }) {
  const pct     = total > 0 ? Math.round((sent / total) * 100) : 0;
  const failPct = total > 0 ? Math.round((failed / total) * 100) : 0;

  return (
    <div style={{ marginTop: compact ? 0 : 8 }}>
      <div style={{
        height: compact ? 4 : 5, background: '#1c2820',
        borderRadius: 3, overflow: 'hidden',
        marginTop: compact ? 0 : 8,
        display: 'flex',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: '#25D366', borderRadius: '3px 0 0 3px',
          transition: 'width 0.4s ease',
        }} />
        <div style={{
          height: '100%', width: `${failPct}%`,
          background: '#ef4444',
          transition: 'width 0.4s ease',
        }} />
      </div>
      {!compact && (
        <div style={{ fontSize: 11, color: '#8aaa90', marginTop: 4, display: 'flex', gap: 12 }}>
          <span><span style={{ color: '#25D366' }}>{sent}</span> enviados</span>
          {failed > 0 && <span><span style={{ color: '#ef4444' }}>{failed}</span> falhos</span>}
          <span style={{ marginLeft: 'auto' }}>{pct}% de {total}</span>
        </div>
      )}
    </div>
  );
}

// ─── Instance Card ────────────────────────────────────────────────────────────

function InstanceCard({
  inst, selected, onClick,
}: { inst: Instance; selected: boolean; onClick: () => void }) {
  const connected = inst.status === 'connected';
  return (
    <div
      onClick={connected ? onClick : undefined}
      style={{
        border: selected
          ? '1.5px solid #25D366'
          : `1px solid ${connected ? '#1c2820' : '#1c2820'}`,
        borderRadius: 10,
        padding: '12px 14px',
        background: selected ? 'rgba(37,211,102,0.07)' : '#0d1410',
        cursor: connected ? 'pointer' : 'not-allowed',
        opacity: connected ? 1 : 0.45,
        transition: 'all 0.12s',
        display: 'flex', alignItems: 'center', gap: 12,
        userSelect: 'none',
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
        background: connected ? '#25D366' : '#4a6050',
        boxShadow: connected ? '0 0 6px rgba(37,211,102,0.6)' : 'none',
        animation: connected ? 'pulse-dot 2s ease-in-out infinite' : 'none',
      }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: selected ? '#e8f0e8' : '#c4d4c8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {inst.display_name || inst.uazapi_name}
        </div>
        {inst.phone_number && (
          <div style={{ fontSize: 11, color: '#4a6050', marginTop: 2 }}>{inst.phone_number}</div>
        )}
      </div>

      {/* Selected check */}
      {selected && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}

      {/* Not connected badge */}
      {!connected && (
        <span style={{ fontSize: 10, color: '#6b7280', background: 'rgba(107,114,128,0.12)', padding: '2px 7px', borderRadius: 100 }}>
          Desconectado
        </span>
      )}
    </div>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────

function CampaignCard({
  campaign, onExpand, expanded, onDelete, onChanged, onEdit,
}: {
  campaign: Campaign;
  onExpand: (id: string) => void;
  expanded: boolean;
  onDelete: (id: string) => void;
  onChanged: () => void;
  onEdit: (id: string) => void;
}) {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [acting, setActing] = useState(false);

  async function cancelCampaign() {
    if (!confirm(`Cancelar o disparo de "${campaign.name}"? Os pendentes ficam na fila para retomada.`)) return;
    setActing(true);
    try {
      await fetch(`/api/campaigns/${campaign.id}/cancel`, { method: 'POST' });
      onChanged();
    } finally { setActing(false); }
  }

  async function resumeCampaign() {
    if (!confirm(`Retomar o disparo de "${campaign.name}"? Quem já recebeu não recebe de novo.`)) return;
    setActing(true);
    try {
      const r = await fetch(`/api/campaigns/${campaign.id}/send`, { method: 'POST' });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        alert(d.error || 'Erro ao retomar o disparo');
      }
      onChanged();
    } finally { setActing(false); }
  }

  const loadRecipients = useCallback(async () => {
    if (recipients.length > 0) return;
    setLoadingRec(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`);
      const d = await res.json();
      setRecipients(d.recipients || []);
    } finally { setLoadingRec(false); }
  }, [campaign.id, recipients.length]);

  useEffect(() => {
    if (expanded) loadRecipients();
  }, [expanded, loadRecipients]);

  return (
    <div style={{
      background: '#111a12', border: '1px solid #1c2820',
      borderRadius: 10, marginBottom: 10, overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e8f0e8' }}>{campaign.name}</span>
            <StatusBadge status={campaign.status} />
            {campaign.az_templates?.name && (
              <span style={{ fontSize: 11, color: '#4a6050' }}>
                {campaign.az_templates.name}
              </span>
            )}
            {campaign.az_whatsapp_instances && (
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                background: 'rgba(37,211,102,0.1)', color: '#4de08c',
              }}>
                via {instanceLabel(campaign.az_whatsapp_instances)}
              </span>
            )}
          </div>

          {/* Metrics */}
          {(campaign.total_count || 0) > 0 && (
            <>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                <span><span style={{ color: '#4a6050' }}>Total </span><span style={{ fontWeight: 600 }}>{campaign.total_count ?? 0}</span></span>
                <span><span style={{ color: '#4a6050' }}>Enviados </span><span style={{ color: '#22c55e', fontWeight: 600 }}>{campaign.sent_count ?? 0}</span></span>
                <span><span style={{ color: '#4a6050' }}>Entregues </span><span style={{ color: '#4de08c', fontWeight: 600 }}>{campaign.delivered_count ?? 0}</span></span>
                <span><span style={{ color: '#4a6050' }}>Falhos </span><span style={{ color: '#ef4444', fontWeight: 600 }}>{campaign.failed_count ?? 0}</span></span>
              </div>
              {campaign.status === 'sending' && (
                <ProgressBar
                  sent={campaign.sent_count ?? 0}
                  failed={campaign.failed_count ?? 0}
                  total={campaign.total_count ?? 0}
                  compact
                />
              )}
            </>
          )}

          <div style={{ fontSize: 11, color: '#4a6050', marginTop: 6 }}>
            {fmtDate(campaign.created_at)}
            {campaign.started_at && ` · Iniciado ${fmtTime(campaign.started_at)}`}
            {campaign.completed_at && ` · Concluído ${fmtTime(campaign.completed_at)}`}
          </div>

          {campaign.status === 'error' && campaign.last_error && (
            <div style={{
              fontSize: 11, color: '#f87171', marginTop: 6, lineHeight: 1.5,
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: 6, padding: '6px 10px',
            }}>
              {campaign.last_error}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
          {campaign.status === 'draft' && (
            <button
              onClick={() => onEdit(campaign.id)}
              style={{
                background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)',
                borderRadius: 7, padding: '6px 12px', cursor: 'pointer',
                color: '#25D366', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              Editar
            </button>
          )}
          {campaign.status === 'sending' && (
            <button
              disabled={acting}
              onClick={cancelCampaign}
              style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 7, padding: '6px 12px', cursor: acting ? 'not-allowed' : 'pointer',
                color: '#f87171', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                opacity: acting ? 0.5 : 1,
              }}
            >
              {acting ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
          {(campaign.status === 'error' || campaign.status === 'cancelled') && (
            <button
              disabled={acting}
              onClick={resumeCampaign}
              style={{
                background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)',
                borderRadius: 7, padding: '6px 12px', cursor: acting ? 'not-allowed' : 'pointer',
                color: '#25D366', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                opacity: acting ? 0.5 : 1,
              }}
            >
              {acting ? 'Retomando...' : 'Retomar'}
            </button>
          )}
          {campaign.status !== 'sending' && (
            <button
              disabled={deleting}
              onClick={async () => {
                if (!confirm(`Excluir "${campaign.name}"?`)) return;
                setDeleting(true);
                try {
                  const r = await fetch(`/api/campaigns/${campaign.id}`, { method: 'DELETE' });
                  if (r.ok) {
                    onDelete(campaign.id);
                  } else {
                    const d = await r.json().catch(() => ({}));
                    alert(d.error || 'Erro ao excluir a campanha');
                  }
                } finally { setDeleting(false); }
              }}
              title="Excluir"
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
            style={{ ...btn('ghost'), fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>
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
                {recipients.length} destinatário{recipients.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 300, overflowY: 'auto' }}>
                {recipients.map((r: any) => {
                  const contact = r.az_contacts;
                  const name = contact?.nome_fantasia || contact?.razao_social || r.contact_name || '—';
                  const rl = RECIPIENT_LABEL[r.status] || RECIPIENT_LABEL.pending;
                  return (
                    <div key={r.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '5px 10px', borderRadius: 6,
                      background: '#0d1410', fontSize: 12,
                      opacity: r.status === 'skipped' ? 0.55 : 1,
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: rl.color,
                      }} />
                      <span style={{ flex: 1, fontWeight: 500, color: '#e8f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                      {contact?.cidade && <span style={{ color: '#4a6050', fontSize: 11 }}>{contact.cidade}</span>}
                      <span style={{ color: rl.color, fontSize: 11, flexShrink: 0 }}>
                        {rl.label}
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

// ─── Campaign List ────────────────────────────────────────────────────────────

function CampaignList({ campaigns, loading, onRefresh, onDelete, onEdit }: {
  campaigns: Campaign[];
  loading: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

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
          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <div style={{ fontSize: 13 }}>Nenhuma campanha ainda.</div>
        <div style={{ fontSize: 12 }}>Crie uma na aba "+ Nova Campanha".</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {campaigns.map(c => (
        <CampaignCard
          key={c.id}
          campaign={c}
          onExpand={id => setExpanded(prev => prev === id ? null : id)}
          expanded={expanded === c.id}
          onDelete={onDelete}
          onChanged={onRefresh}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

// ─── Live Dispatch Monitor (Step 4) ──────────────────────────────────────────

function DispatchMonitor({
  campaignId, campaignName, total,
  onViewList,
}: {
  campaignId: string;
  campaignName: string;
  total: number;
  onViewList: () => void;
}) {
  const [sent, setSent] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [failed, setFailed] = useState(0);
  const [replied, setReplied] = useState(0);
  const [status, setStatus] = useState<Campaign['status']>('sending');
  const [lastError, setLastError] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [cancelling, setCancelling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pumpRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    try {
      const res  = await fetch(`/api/campaigns/${campaignId}`);
      const data = await res.json();
      if (data.campaign) {
        setSent(data.campaign.sent_count ?? 0);
        setDelivered(data.campaign.delivered_count ?? 0);
        setFailed(data.campaign.failed_count ?? 0);
        setStatus(data.campaign.status ?? 'sending');
        setLastError(data.campaign.last_error ?? null);
      }
      if (data.recipients) {
        setRecipients(data.recipients);
      }
      if (typeof data.replied_count === 'number') setReplied(data.replied_count);
    } catch {}
  }, [campaignId]);

  useEffect(() => {
    poll();
    pollRef.current = setInterval(poll, 2000);
    // Pump: retoma o worker se a cadeia serverless morrer (idempotente)
    pumpCampaign(campaignId);
    pumpRef.current = setInterval(() => pumpCampaign(campaignId), 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (pumpRef.current) clearInterval(pumpRef.current);
    };
  }, [poll, campaignId]);

  // Stop polling when done
  useEffect(() => {
    if (status !== 'sending') {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      if (pumpRef.current) { clearInterval(pumpRef.current); pumpRef.current = null; }
    }
  }, [status]);

  async function cancelDispatch() {
    if (!confirm('Cancelar o disparo? Os pendentes ficam na fila e você pode retomar depois.')) return;
    setCancelling(true);
    try {
      await fetch(`/api/campaigns/${campaignId}/cancel`, { method: 'POST' });
      await poll();
    } finally { setCancelling(false); }
  }

  const pct      = total > 0 ? Math.round((sent / total) * 100) : 0;
  const pending  = Math.max(0, total - sent - failed);
  const isDone   = status !== 'sending';

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        {!isDone ? (
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            border: '2.5px solid #25D366', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }} />
        ) : status === 'completed' ? (
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
        ) : status === 'cancelled' ? (
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
          </div>
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8f0e8' }}>
            {isDone
              ? status === 'completed' ? 'Disparo concluído'
              : status === 'cancelled' ? 'Disparo cancelado'
              : 'Disparo com erro'
              : 'Disparando mensagens...'}
          </div>
          <div style={{ fontSize: 12, color: '#4a6050' }}>{campaignName}</div>
        </div>
        {!isDone && (
          <button
            onClick={cancelDispatch}
            disabled={cancelling}
            style={{
              padding: '7px 14px', borderRadius: 8, cursor: cancelling ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
              border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
              color: '#f87171', opacity: cancelling ? 0.5 : 1, flexShrink: 0,
            }}
          >
            {cancelling ? 'Cancelando...' : 'Cancelar disparo'}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{
        background: '#111a12', border: '1px solid #1c2820',
        borderRadius: 10, padding: 18, marginBottom: 16,
      }}>
        <ProgressBar sent={sent} failed={failed} total={total} />

        {/* Stats grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
          gap: 10, marginTop: 16,
        }}>
          {[
            { label: 'Total', value: total, color: '#e8f0e8' },
            { label: 'Enviados', value: sent, color: '#22c55e' },
            { label: 'Entregues', value: delivered, color: delivered > 0 ? '#4de08c' : '#4a6050' },
            { label: 'Respostas', value: replied, color: replied > 0 ? '#6AADFF' : '#4a6050' },
            { label: 'Falhos', value: failed, color: failed > 0 ? '#ef4444' : '#4a6050' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#0d1410', borderRadius: 8, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 11, color: '#4a6050', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {!isDone && sent > 0 && delivered === 0 && (
          <div style={{
            fontSize: 11, color: '#fcd34d', marginTop: 12, textAlign: 'center', lineHeight: 1.5,
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
            borderRadius: 6, padding: '7px 10px',
          }}>
            Proteção canário: aguardando a confirmação de entrega do 1º envio antes de liberar o volume total.
          </div>
        )}

        {status === 'error' && lastError && (
          <div style={{
            fontSize: 12, color: '#f87171', marginTop: 12, lineHeight: 1.5,
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 6, padding: '8px 12px',
          }}>
            {lastError}
          </div>
        )}

        {!isDone && pending > 0 && (
          <div style={{ fontSize: 11, color: '#4a6050', marginTop: 12, textAlign: 'center' }}>
            {pending} mensagens pendentes · {estimatedMinutes(pending)} restantes
          </div>
        )}
      </div>

      {/* Recipient list */}
      <div style={{
        background: '#111a12', border: '1px solid #1c2820',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #1c2820', fontSize: 11, color: '#4a6050', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Destinatários
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {recipients.length === 0 ? (
            <div style={{ padding: '20px 14px', fontSize: 12, color: '#4a6050', textAlign: 'center' }}>
              Carregando lista...
            </div>
          ) : (
            recipients.map((r: any) => {
              const contact = r.az_contacts;
              const name = contact?.nome_fantasia || contact?.razao_social || r.contact_name || '—';
              const rl = RECIPIENT_LABEL[r.status] || RECIPIENT_LABEL.pending;
              return (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 14px', borderBottom: '1px solid #0d1410',
                  fontSize: 12, opacity: r.status === 'skipped' ? 0.55 : 1,
                }} title={r.error_message || undefined}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                    background: rl.color,
                    animation: (r.status === 'pending' || r.status === 'processing') ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
                  }} />
                  <span style={{ flex: 1, color: '#e8f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                  {r.replied_at && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, flexShrink: 0, color: '#6AADFF',
                      background: 'rgba(106,173,255,0.1)', border: '1px solid rgba(106,173,255,0.25)',
                      borderRadius: 4, padding: '1px 6px',
                    }}>
                      Respondeu
                    </span>
                  )}
                  {contact?.cidade && <span style={{ color: '#4a6050', fontSize: 11 }}>{contact.cidade}</span>}
                  <span style={{ fontSize: 11, flexShrink: 0, color: rl.color }}>
                    {rl.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16 }}>
        <button onClick={onViewList} style={{ ...btn('ghost'), width: '100%' }}>
          Ver lista de campanhas
        </button>
      </div>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

// `existing` = campanha em rascunho aberta pelo botão Editar: o wizard nasce
// pré-carregado e salva via PATCH em vez de criar uma nova.
function NewCampaignWizard({
  onSuccess,
  toast,
  existing,
}: {
  onSuccess: (campaignId: string) => void;
  toast: ReturnType<typeof useToast>;
  existing?: any | null;
}) {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName]               = useState(existing?.name || '');
  const [useTemplate, setUseTemplate] = useState(existing ? !!existing.template_id : true);
  const [templateId, setTemplateId]   = useState(existing?.template_id || '');
  const [customBody, setCustomBody]   = useState(existing?.custom_body || '');
  const [templates, setTemplates]     = useState<Template[]>([]);
  const [loadingTpl, setLoadingTpl]   = useState(true);
  const [instances, setInstances]     = useState<Instance[]>([]);
  const [instanceId, setInstanceId]   = useState(existing?.instance_id || '');

  // M2: mídia específica da campanha (tem precedência sobre a mídia do template)
  const [customMediaUrl, setCustomMediaUrl]   = useState<string | null>(existing?.custom_media_url || null);
  const [customMediaType, setCustomMediaType] = useState<'image' | 'video' | null>(existing?.custom_media_type || null);
  const [uploadingMedia, setUploadingMedia]   = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  async function uploadCampaignMedia(file: File) {
    setUploadingMedia(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || 'Falha no upload'); return; }
      setCustomMediaUrl(d.url);
      setCustomMediaType(d.media_type);
    } catch {
      toast.error('Erro de conexão no upload');
    } finally {
      setUploadingMedia(false);
    }
  }

  // Step 2 fields
  const [brands, setBrands]             = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [brandSearch, setBrandSearch]   = useState('');
  const [segmentos, setSegmentos]       = useState<{ segmento: string; count: number }[]>([]);
  const [semSegmento, setSemSegmento]   = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number> | null>(null);
  const [vendedores, setVendedores]     = useState<{ vendedor: string; count: number }[]>([]);
  const [filter, setFilter]             = useState<SegmentFilter>(() => {
    // Rascunhos antigos salvaram status single-select — migra para status_in
    // e descarta o campo legado (senão ele continuaria filtrando no servidor).
    const f: SegmentFilter = { ...(existing?.segment_filter || {}) };
    if (f.status && !f.status_in) f.status_in = [f.status];
    delete f.status;
    return f;
  });
  const [preview, setPreview]           = useState<PreviewResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [campaignId, setCampaignId]     = useState<string | null>(existing?.id || null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Sequência + abort: só o preview mais recente pode escrever na tela
  // (antes, cliques rápidos nos filtros intercalavam PATCH→GET e a contagem
  // ficava velha — era preciso "desmarcar de novo" para atualizar).
  const previewSeqRef   = useRef(0);
  const previewAbortRef = useRef<AbortController | null>(null);

  // Busca para adicionar contatos manualmente à lista
  const [addQuery, setAddQuery]     = useState('');
  const [addResults, setAddResults] = useState<any[]>([]);
  const addDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step 4 fields (dispatch monitor)
  const [dispatchTotal, setDispatchTotal] = useState(0);
  const [dispatchName, setDispatchName]   = useState('');
  const [sending, setSending]             = useState(false);

  // Load data on mount
  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoadingTpl(false); })
      .catch(() => setLoadingTpl(false));

    fetch('/api/brands')
      .then(r => r.json())
      .then(d => { setBrands(d.brands || []); setLoadingBrands(false); })
      .catch(() => setLoadingBrands(false));

    // Segmentos e status reais da base (as opções fixas antigas não batiam com os dados)
    fetch('/api/contacts/segmentos')
      .then(r => r.json())
      .then(d => {
        setSegmentos(d.segmentos || []);
        setSemSegmento(d.sem_segmento || 0);
        setStatusCounts(d.status_counts || null);
        setVendedores(d.vendedores || []);
      })
      .catch(() => {});

    fetch('/api/instances?live=1')
      .then(r => r.json())
      .then(d => {
        const list: Instance[] = Array.isArray(d) ? d : [];
        setInstances(list);
        // Auto-select first connected instance (só quando nada selecionado —
        // em modo edição preserva o número salvo na campanha)
        const first = list.find(i => i.status === 'connected');
        if (first) setInstanceId(prev => prev || first.id);
      })
      .catch(() => {});
  }, []);

  const selectedTemplate = templates.find(t => t.id === templateId);
  const messageBody      = useTemplate ? (selectedTemplate?.body || '') : customBody;
  const connectedInstances = instances.filter(i => i.status === 'connected');

  // Auto-trigger preview after filter changes (500ms debounce)
  useEffect(() => {
    if (!campaignId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(loadPreview, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filter, campaignId]); // eslint-disable-line

  // Step 1 → 2 (cria a campanha, ou salva via PATCH quando está editando)
  async function goToStep2() {
    if (!name.trim()) { toast.error('Nome da campanha é obrigatório'); return; }
    if (useTemplate && !templateId) { toast.error('Selecione um template'); return; }
    if (!useTemplate && !customBody.trim()) { toast.error('Escreva a mensagem'); return; }
    if (!instanceId) { toast.error('Selecione um número de envio'); return; }

    const payload = {
      name: name.trim(),
      template_id: useTemplate ? templateId : null,
      custom_body: !useTemplate ? customBody.trim() : null,
      instance_id: instanceId || null,
      custom_media_url: customMediaUrl,
      custom_media_type: customMediaUrl ? customMediaType : null,
    };

    try {
      const res = campaignId
        ? await fetch(`/api/campaigns/${campaignId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, segment_filter: filter }),
          });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || 'Erro ao salvar campanha'); return; }
      if (!campaignId) setCampaignId(d.campaign.id);
      setStep(2);
    } catch {
      toast.error('Erro de conexão');
    }
  }

  async function loadPreview() {
    if (!campaignId) return;
    const seq = ++previewSeqRef.current;
    previewAbortRef.current?.abort();
    const ctrl = new AbortController();
    previewAbortRef.current = ctrl;
    setPreviewLoading(true);
    try {
      // POST único: resolve E persiste o filtro na mesma chamada
      const res = await fetch(`/api/campaigns/${campaignId}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment_filter: filter, offset: 0, limit: PREVIEW_PAGE }),
        signal: ctrl.signal,
      });
      const d = await res.json();
      if (seq !== previewSeqRef.current) return; // já existe um preview mais novo
      if (res.ok) setPreview({ count: d.count, duplicates: d.duplicates || 0, contacts: d.contacts || [] });
      else { setPreview(null); toast.error(d.error || 'Erro ao montar a lista'); }
    } catch (e: any) {
      if (e?.name === 'AbortError') return; // substituído por um preview mais novo
      if (seq === previewSeqRef.current) toast.error('Erro de conexão');
    } finally {
      if (seq === previewSeqRef.current) setPreviewLoading(false);
    }
  }

  async function loadMore() {
    if (!campaignId || !preview) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/preview?offset=${preview.contacts.length}&limit=${PREVIEW_PAGE}`);
      const d = await res.json();
      if (res.ok) {
        setPreview(p => p ? { ...p, count: d.count, contacts: [...p.contacts, ...(d.contacts || [])] } : p);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  // Remover da lista: contato do filtro vai para exclude_ids;
  // contato manual sai de include_ids
  function removeContact(c: PreviewContact) {
    setFilter(f => c.manual
      ? { ...f, include_ids: (f.include_ids || []).filter(id => id !== c.id) }
      : { ...f, exclude_ids: [...(f.exclude_ids || []), c.id] });
  }

  function restoreExcluded() {
    setFilter(f => ({ ...f, exclude_ids: [] }));
  }

  function addContact(c: any) {
    if (!c.phone_primary) return;
    setFilter(f => ({
      ...f,
      include_ids: (f.include_ids || []).includes(c.id)
        ? f.include_ids
        : [...(f.include_ids || []), c.id],
      exclude_ids: (f.exclude_ids || []).filter(id => id !== c.id),
    }));
    setAddQuery('');
    setAddResults([]);
  }

  // Busca de contatos para adicionar (debounce 400ms)
  useEffect(() => {
    if (addDebounceRef.current) clearTimeout(addDebounceRef.current);
    if (!addQuery.trim()) { setAddResults([]); return; }
    addDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/contacts?q=${encodeURIComponent(addQuery.trim())}&limit=8`);
        const d = await res.json();
        setAddResults(d.contacts || []);
      } catch { setAddResults([]); }
    }, 400);
    return () => { if (addDebounceRef.current) clearTimeout(addDebounceRef.current); };
  }, [addQuery]);

  // Step 2 → 3
  async function goToStep3() {
    if (!preview) { await loadPreview(); return; }
    if (preview.count === 0) {
      toast.error(filter.manual_only ? 'A lista está vazia — adicione contatos' : 'Nenhum contato corresponde ao filtro');
      return;
    }
    // Persist final síncrono: garante que o disparo usa exatamente o filtro
    // que está na tela (o save do preview é debounced e pode estar em voo).
    try {
      await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment_filter: filter }),
      });
    } catch {
      toast.error('Erro ao salvar o filtro — tente novamente');
      return;
    }
    setStep(3);
  }

  // Step 3 → fire
  async function fireDisparo() {
    if (!campaignId) return;
    setSending(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: 'POST' });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || 'Erro ao disparar'); setSending(false); return; }
      setDispatchTotal(d.total);
      setDispatchName(name);
      setStep(4); // Go to live monitor
    } catch {
      toast.error('Erro de conexão');
      setSending(false);
    }
  }

  function toggleBrand(id: string) {
    setFilter(f => {
      const ids = f.brand_ids || [];
      return { ...f, brand_ids: ids.includes(id) ? ids.filter(b => b !== id) : [...ids, id] };
    });
  }

  function toggleStatus(value: string) {
    setFilter(f => {
      const cur = f.status_in || [];
      const next = cur.includes(value) ? cur.filter(s => s !== value) : [...cur, value];
      return { ...f, status_in: next.length > 0 ? next : undefined };
    });
  }

  // Lista manual: mantém os demais campos no estado (voltar ao modo filtro
  // restaura tudo) — o servidor ignora filtros quando manual_only está ativo.
  const manualMode = !!filter.manual_only;
  function setManualMode(on: boolean) {
    setFilter(f => ({ ...f, manual_only: on || undefined }));
  }

  function toggleAllBrands() {
    const allSelected = (filter.brand_ids || []).length === brands.length && brands.length > 0;
    setFilter(f => ({ ...f, brand_ids: allSelected ? [] : brands.map(b => b.id) }));
  }

  const filteredBrands = brands.filter(b =>
    !brandSearch || b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // ── Render ──

  // Step 4: dispatch monitor
  if (step === 4 && campaignId) {
    return (
      <DispatchMonitor
        campaignId={campaignId}
        campaignName={dispatchName}
        total={dispatchTotal}
        onViewList={() => onSuccess(campaignId)}
      />
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 660 }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {['Mensagem', 'Lista', 'Confirmar'].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done   = step > n;
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
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
              {i < 2 && <div style={{ width: 28, height: 1, background: '#1c2820', margin: '0 8px' }} />}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Mensagem + Número ── */}
      {step === 1 && (
        <div>
          {/* Campaign name */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Nome da campanha</label>
            <input
              style={inp}
              placeholder="Ex: Lançamento Outubro — Papelaria"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Instance picker — visual cards */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Número de envio
              {connectedInstances.length === 0 && (
                <span style={{ color: '#f59e0b', marginLeft: 6, textTransform: 'none', fontSize: 11 }}>
                  Nenhum número conectado
                </span>
              )}
            </label>
            {instances.length === 0 ? (
              <div style={{ fontSize: 12, color: '#4a6050' }}>Carregando instâncias...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {instances.map(inst => (
                  <InstanceCard
                    key={inst.id}
                    inst={inst}
                    selected={instanceId === inst.id}
                    onClick={() => setInstanceId(inst.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Message type toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mensagem</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ id: true, label: 'Usar template' }, { id: false, label: 'Personalizada' }].map(opt => (
                <button
                  key={String(opt.id)}
                  onClick={() => setUseTemplate(opt.id)}
                  style={{ ...btn(useTemplate === opt.id ? 'primary' : 'ghost'), fontSize: 12, padding: '6px 14px' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {useTemplate ? (
              loadingTpl ? (
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
                  style={{ ...inp, minHeight: 110, resize: 'vertical', lineHeight: 1.5 }}
                  placeholder="Olá {{nome_fantasia}}, temos novidades para você em {{cidade}}..."
                  value={customBody}
                  onChange={e => setCustomBody(e.target.value)}
                />
                <div style={{ fontSize: 11, color: '#4a6050', marginTop: 4, textAlign: 'right' }}>
                  {customBody.length} caracteres
                </div>
              </div>
            )}
          </div>

          {/* M2: imagem/vídeo da campanha */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Imagem ou vídeo (opcional)</label>
            {(() => {
              const tplMedia = useTemplate ? selectedTemplate?.media_url : null;
              const effUrl  = customMediaUrl || tplMedia || null;
              const effType = customMediaUrl ? customMediaType : (selectedTemplate?.media_type || 'image');
              return (
                <div style={{ background: '#0d1410', border: '1px solid #1c2820', borderRadius: 8, padding: 12 }}>
                  {effUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {effType === 'video' ? (
                        <video src={effUrl} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #1c2820' }} muted />
                      ) : (
                        <img src={effUrl} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #1c2820' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#4de08c', fontWeight: 600 }}>
                          {customMediaUrl
                            ? `${effType === 'video' ? 'Vídeo' : 'Imagem'} desta campanha`
                            : `${effType === 'video' ? 'Vídeo' : 'Imagem'} do template`}
                        </div>
                        <div style={{ fontSize: 11, color: '#4a6050', marginTop: 2 }}>
                          A mensagem vai como legenda. Envio de mídia usa intervalo maior entre mensagens (4–6s).
                        </div>
                      </div>
                      {customMediaUrl ? (
                        <button
                          onClick={() => { setCustomMediaUrl(null); setCustomMediaType(null); }}
                          style={{ ...btn('ghost'), fontSize: 11, padding: '5px 10px', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                        >
                          Remover
                        </button>
                      ) : (
                        <button
                          onClick={() => mediaInputRef.current?.click()}
                          disabled={uploadingMedia}
                          style={{ ...btn('ghost'), fontSize: 11, padding: '5px 10px' }}
                        >
                          {uploadingMedia ? 'Enviando…' : 'Substituir nesta campanha'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        onClick={() => mediaInputRef.current?.click()}
                        disabled={uploadingMedia}
                        style={{ ...btn('ghost'), fontSize: 12, padding: '7px 14px' }}
                      >
                        {uploadingMedia ? 'Enviando…' : '+ Anexar imagem/vídeo'}
                      </button>
                      <span style={{ fontSize: 11, color: '#4a6050' }}>JPG/PNG/WebP até 5MB · MP4/MOV até 16MB</span>
                    </div>
                  )}
                  <input
                    ref={mediaInputRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadCampaignMedia(f); e.target.value = ''; }}
                  />
                </div>
              );
            })()}
          </div>

          {/* Message preview */}
          {messageBody && (
            <div style={{
              background: '#0d1410', border: '1px solid #1c2820',
              borderRadius: 8, padding: 14, marginBottom: 18,
            }}>
              <div style={labelStyle}>Preview</div>
              {(customMediaUrl || (useTemplate && selectedTemplate?.media_url)) && (
                <div style={{ marginBottom: 8 }}>
                  {(customMediaUrl ? customMediaType : selectedTemplate?.media_type) === 'video' ? (
                    <video src={customMediaUrl || selectedTemplate?.media_url || ''} style={{ maxWidth: 220, borderRadius: 8, border: '1px solid #1c2820' }} muted controls />
                  ) : (
                    <img src={customMediaUrl || selectedTemplate?.media_url || ''} alt="" style={{ maxWidth: 220, borderRadius: 8, border: '1px solid #1c2820' }} />
                  )}
                </div>
              )}
              <div style={{ fontSize: 13, color: '#e8f0e8', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {messageBody
                  .replace(/\{\{nome_fantasia\}\}/gi, 'Papelaria Exemplo')
                  .replace(/\{\{nome\}\}/gi, 'Papelaria Exemplo')
                  .replace(/\{\{primeiro_nome\}\}/gi, 'Papelaria')
                  .replace(/\{\{cidade\}\}/gi, 'Santa Maria')
                  .replace(/\{\{estado\}\}/gi, 'RS')
                  .replace(/\{\{contato\}\}/gi, 'João')
                  .replace(/\{\{segmento\}\}/gi, 'Papelaria')
                  .replace(/\{\{periodo_dia\}\}/gi, 'Bom dia')}
              </div>
            </div>
          )}

          <button
            onClick={goToStep2}
            disabled={!instanceId || connectedInstances.length === 0}
            style={{ ...btn('primary'), opacity: (!instanceId || connectedInstances.length === 0) ? 0.5 : 1 }}
          >
            Próximo — Lista →
          </button>
        </div>
      )}

      {/* ── Step 2: Destinatários ── */}
      {step === 2 && (
        <div>
          {/* Origem da lista: filtrar a base × montar do zero */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Como montar a lista</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { on: false, label: 'Filtrar a base' },
                { on: true,  label: 'Lista manual' },
              ].map(m => {
                const active = manualMode === m.on;
                return (
                  <button
                    key={String(m.on)}
                    onClick={() => setManualMode(m.on)}
                    style={{
                      padding: '6px 16px', borderRadius: 8, fontSize: 12,
                      fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
                      border: active ? '1px solid #25D366' : '1px solid #1c2820',
                      background: active ? 'rgba(37,211,102,0.12)' : 'transparent',
                      color: active ? '#25D366' : '#8aaa90', transition: 'all 0.1s',
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            {manualMode && (
              <div style={{ fontSize: 11, color: '#4a6050', marginTop: 6 }}>
                A lista começa vazia — busque e adicione os contatos um a um. Os filtros ficam desativados.
              </div>
            )}
          </div>

          {!manualMode && (<>
          {/* Brands */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>
                Marcas representadas
                {(filter.brand_ids || []).length > 0 && (
                  <span style={{ color: '#25D366', marginLeft: 6, textTransform: 'none', fontWeight: 500 }}>
                    {(filter.brand_ids || []).length} selecionadas
                  </span>
                )}
              </label>
              <button
                onClick={toggleAllBrands}
                style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  border: '1px solid #1c2820', background: 'transparent',
                  color: '#4a6050', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {(filter.brand_ids || []).length === brands.length && brands.length > 0 ? 'Desmarcar todas' : 'Selecionar todas'}
              </button>
            </div>

            {/* Brand search */}
            {brands.length > 10 && (
              <input
                style={{ ...inp, marginBottom: 8, padding: '7px 12px' }}
                placeholder="Buscar marca..."
                value={brandSearch}
                onChange={e => setBrandSearch(e.target.value)}
              />
            )}

            {loadingBrands ? (
              <div style={{ fontSize: 12, color: '#4a6050' }}>Carregando marcas...</div>
            ) : (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 6,
                maxHeight: brands.length > 15 ? 160 : 'none',
                overflowY: brands.length > 15 ? 'auto' : 'visible',
                padding: brands.length > 15 ? '4px 2px' : 0,
              }}>
                {filteredBrands.map(b => {
                  const active = (filter.brand_ids || []).includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleBrand(b.id)}
                      style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12,
                        fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                        border: active ? 'none' : '1px solid #1c2820',
                        background: active ? '#25D366' : 'transparent',
                        color: active ? '#fff' : '#8aaa90', transition: 'all 0.1s',
                      }}
                    >
                      {b.name}
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ fontSize: 11, color: '#4a6050', marginTop: 6 }}>
              {(filter.brand_ids?.length || 0) === 0
                ? 'Sem filtro de marca — inclui todos os contatos com telefone'
                : `Somente contatos vinculados às ${filter.brand_ids!.length} marca(s) selecionada(s)`}
            </div>
          </div>

          {/* Linha 1: Cidade + Estado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Cidade</label>
              <input
                style={inp}
                placeholder="Ex: Santa Maria"
                value={filter.cidade || ''}
                onChange={e => setFilter(f => ({ ...f, cidade: e.target.value || undefined }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Estado</label>
              <select
                style={inp}
                value={filter.estado || ''}
                onChange={e => setFilter(f => ({ ...f, estado: e.target.value || undefined }))}
              >
                <option value="">Todos</option>
                {ESTADO_OPTIONS.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Segmento — opções reais da base, com contagem */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Segmento</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { value: '', label: 'Todos', count: null as number | null },
                ...segmentos.map(s => ({ value: s.segmento, label: s.segmento, count: s.count as number | null })),
                ...(semSegmento > 0 ? [{ value: '__sem__', label: 'Sem segmento', count: semSegmento as number | null }] : []),
              ].map(o => {
                const active = (filter.segmento || '') === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => setFilter(f => ({ ...f, segmento: o.value || undefined }))}
                    style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12,
                      fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                      border: active ? 'none' : '1px solid #1c2820',
                      background: active ? '#25D366' : 'transparent',
                      color: active ? '#fff' : '#8aaa90', transition: 'all 0.1s',
                    }}
                  >
                    {o.label}
                    {o.count !== null && (
                      <span style={{ opacity: 0.65, marginLeft: 5, fontSize: 10 }}>{o.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status — multi-select com contagem real da base */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Status do cliente</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(() => {
                const selected = filter.status_in || [];
                const chipStyle = (active: boolean) => ({
                  padding: '4px 12px', borderRadius: 20, fontSize: 12,
                  fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                  border: active ? 'none' : '1px solid #1c2820',
                  background: active ? '#25D366' : 'transparent',
                  color: active ? '#fff' : '#8aaa90', transition: 'all 0.1s',
                } as const);
                return (
                  <>
                    <button
                      key="__todos__"
                      onClick={() => setFilter(f => ({ ...f, status_in: undefined }))}
                      style={chipStyle(selected.length === 0)}
                    >
                      Todos
                    </button>
                    {STATUS_OPTIONS.map(o => {
                      const active = selected.includes(o.value);
                      const count = statusCounts ? (statusCounts[o.value] || 0) : null;
                      return (
                        <button key={o.value} onClick={() => toggleStatus(o.value)} style={chipStyle(active)}>
                          {o.label}
                          {count !== null && (
                            <span style={{ opacity: 0.65, marginLeft: 5, fontSize: 10 }}>{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>
            {(filter.status_in || []).some(s => statusCounts && !statusCounts[s]) && (
              <div style={{ fontSize: 11, color: '#fcd34d', marginTop: 6 }}>
                A base ainda não tem contatos com esse status — a inatividade será
                calculada quando a planilha de última compra for importada.
              </div>
            )}
          </div>

          {/* Vendedor — M3: vendedor_principal importado da carteira Mercos */}
          {vendedores.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Vendedor</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(() => {
                  const chipStyle = (active: boolean) => ({
                    padding: '4px 12px', borderRadius: 20, fontSize: 12,
                    fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
                    border: active ? 'none' : '1px solid #1c2820',
                    background: active ? '#25D366' : 'transparent',
                    color: active ? '#fff' : '#8aaa90', transition: 'all 0.1s',
                  } as const);
                  return (
                    <>
                      <button
                        key="__todos__"
                        onClick={() => setFilter(f => ({ ...f, vendedor: undefined }))}
                        style={chipStyle(!filter.vendedor)}
                      >
                        Todos
                      </button>
                      {vendedores.map(v => (
                        <button
                          key={v.vendedor}
                          onClick={() => setFilter(f => ({ ...f, vendedor: f.vendedor === v.vendedor ? undefined : v.vendedor }))}
                          style={chipStyle(filter.vendedor === v.vendedor)}
                        >
                          {v.vendedor}
                          <span style={{ opacity: 0.65, marginLeft: 5, fontSize: 10 }}>{v.count}</span>
                        </button>
                      ))}
                    </>
                  );
                })()}
              </div>
              <div style={{ fontSize: 11, color: '#4a6050', marginTop: 6 }}>
                Vendedor do pedido mais recente do cliente (carteira Mercos de 09/07).
              </div>
            </div>
          )}

          {/* Teste interno */}
          <div style={{
            marginBottom: 18, padding: '10px 14px', borderRadius: 8,
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fcd34d' }}>Teste — equipe u4digital</span>
              <span style={{ fontSize: 11, color: '#4a6050', marginLeft: 8 }}>Dispara só para o time interno</span>
            </div>
            <button
              onClick={() => {
                const hasTag = (filter.tags || []).includes('u4digital');
                setFilter(f => ({
                  ...f,
                  tags: hasTag ? [] : ['u4digital'],
                  brand_ids: hasTag ? f.brand_ids : [],
                  cidade: hasTag ? f.cidade : undefined,
                  segmento: hasTag ? f.segmento : undefined,
                  status_in: hasTag ? f.status_in : undefined,
                  vendedor: hasTag ? f.vendedor : undefined,
                  manual_only: hasTag ? f.manual_only : undefined,
                  include_ids: hasTag ? f.include_ids : [],
                  exclude_ids: hasTag ? f.exclude_ids : [],
                }));
              }}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12,
                fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
                border: 'none', transition: 'all 0.12s',
                background: (filter.tags || []).includes('u4digital') ? '#fcd34d' : 'rgba(251,191,36,0.15)',
                color: (filter.tags || []).includes('u4digital') ? '#000' : '#fcd34d',
              }}
            >
              {(filter.tags || []).includes('u4digital') ? '✓ Ativo' : 'Ativar'}
            </button>
          </div>
          </>)}

          {/* Adicionar contato manualmente */}
          <div style={{ marginBottom: 14, position: 'relative' }}>
            <label style={labelStyle}>Adicionar contato à lista</label>
            <input
              style={inp}
              placeholder="Buscar por nome, razão social, CNPJ ou contato..."
              value={addQuery}
              onChange={e => setAddQuery(e.target.value)}
            />
            {addResults.length > 0 && (
              <div style={{
                position: 'absolute', left: 0, right: 0, zIndex: 20,
                background: '#0d1410', border: '1px solid #1c2820',
                borderRadius: 8, marginTop: 4, overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                {addResults.map((c: any) => {
                  const inList = (filter.include_ids || []).includes(c.id);
                  const noPhone = !c.phone_primary;
                  return (
                    <div
                      key={c.id}
                      onClick={() => !noPhone && !inList && addContact(c)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', fontSize: 12,
                        cursor: (noPhone || inList) ? 'not-allowed' : 'pointer',
                        opacity: noPhone ? 0.45 : 1,
                        borderBottom: '1px solid #111a12',
                      }}
                    >
                      <span style={{ flex: 1, color: '#e8f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.nome_fantasia || c.razao_social}
                      </span>
                      <span style={{ color: '#8aaa90', fontSize: 11 }}>
                        {noPhone ? 'sem telefone' : fmtPhone(c.phone_primary)}
                      </span>
                      <span style={{ color: inList ? '#4a6050' : '#25D366', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {inList ? 'na lista' : '+ Adicionar'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lista de disparo — exatamente o que será enviado */}
          <div style={{
            background: '#111a12', border: '1px solid #1c2820',
            borderRadius: 10, marginBottom: 20, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1c2820' }}>
              {previewLoading && !preview ? (
                <div style={{ fontSize: 12, color: '#4a6050', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 14, border: '2px solid #1c2820', borderTopColor: '#25D366', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Montando a lista de disparo...
                </div>
              ) : preview ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: preview.count > 0 ? '#25D366' : '#ef4444' }}>
                      {preview.count}
                    </span>
                    <span style={{ fontSize: 13, color: '#8aaa90' }}>
                      {preview.count === 1 ? 'contato na lista de disparo' : 'contatos na lista de disparo'}
                    </span>
                    {previewLoading && (
                      <div style={{ width: 12, height: 12, border: '2px solid #1c2820', borderTopColor: '#25D366', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    )}
                    {preview.count > 0 && (
                      <span style={{ fontSize: 11, color: '#4a6050', marginLeft: 'auto' }}>
                        {estimatedMinutes(preview.count)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
                    {preview.duplicates > 0 && (
                      <span style={{ fontSize: 11, color: '#4a6050' }}>
                        {preview.duplicates} com número repetido (recebem 1 vez)
                      </span>
                    )}
                    {(filter.include_ids?.length || 0) > 0 && (
                      <span style={{ fontSize: 11, color: '#fcd34d' }}>
                        {filter.include_ids!.length} adicionado{filter.include_ids!.length > 1 ? 's' : ''} manualmente
                      </span>
                    )}
                    {(filter.exclude_ids?.length || 0) > 0 && (
                      <span style={{ fontSize: 11, color: '#f87171' }}>
                        {filter.exclude_ids!.length} removido{filter.exclude_ids!.length > 1 ? 's' : ''}
                        {' · '}
                        <span onClick={restoreExcluded} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                          restaurar
                        </span>
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#4a6050' }}>
                  {manualMode
                    ? 'Busque e adicione contatos acima para montar a lista'
                    : 'Ajuste os filtros acima para montar a lista de destinatários'}
                </div>
              )}
            </div>

            {preview && preview.contacts.length > 0 && (
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {preview.contacts.map(c => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 14px', borderBottom: '1px solid #0d1410', fontSize: 12,
                  }}>
                    <span style={{ flex: 1, color: '#e8f0e8', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                      {c.manual && !manualMode && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: '#fcd34d',
                          background: 'rgba(251,191,36,0.1)', borderRadius: 100,
                          padding: '1px 6px', marginLeft: 7, verticalAlign: 'middle',
                        }}>
                          MANUAL
                        </span>
                      )}
                    </span>
                    <span style={{ color: '#8aaa90', fontSize: 11, flexShrink: 0 }}>{fmtPhone(c.phone)}</span>
                    {c.cidade && <span style={{ color: '#4a6050', fontSize: 11, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.cidade}</span>}
                    <button
                      onClick={() => removeContact(c)}
                      title="Remover da lista de disparo"
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: '#4a6050', padding: '2px 4px', display: 'flex', flexShrink: 0,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#4a6050')}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
                {preview.contacts.length < preview.count && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    style={{
                      width: '100%', padding: '9px 0', border: 'none',
                      background: '#0d1410', color: '#8aaa90', fontSize: 12,
                      cursor: loadingMore ? 'wait' : 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {loadingMore
                      ? 'Carregando...'
                      : `Carregar mais (${preview.contacts.length} de ${preview.count})`}
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep(1)} style={btn('ghost')}>← Voltar</button>
            <button
              onClick={loadPreview}
              disabled={previewLoading}
              style={{ ...btn('ghost'), opacity: previewLoading ? 0.5 : 1 }}
            >
              {previewLoading ? 'Calculando...' : 'Atualizar lista'}
            </button>
            <button
              onClick={goToStep3}
              disabled={!preview || preview.count === 0}
              style={{ ...btn('primary'), opacity: (!preview || preview.count === 0) ? 0.45 : 1 }}
            >
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirmar e Disparar ── */}
      {step === 3 && (
        <div>
          {/* Summary card */}
          <div style={{
            background: '#0d1410', border: '1px solid #1c2820',
            borderRadius: 10, padding: 20, marginBottom: 18,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e8f0e8', marginBottom: 14 }}>
              Resumo do disparo
            </div>

            {/* Instance summary */}
            {(() => {
              const inst = instances.find(i => i.id === instanceId);
              return inst ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.18)',
                  borderRadius: 8, marginBottom: 14,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#25D366', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e8f0e8' }}>
                      {inst.display_name || inst.uazapi_name}
                    </span>
                    {inst.phone_number && (
                      <span style={{ fontSize: 11, color: '#25D366', marginLeft: 8 }}>{inst.phone_number}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: '#25D366' }}>Conectado</span>
                </div>
              ) : null;
            })()}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Campanha', value: name },
                {
                  label: 'Mensagem',
                  value: useTemplate ? (selectedTemplate?.name || '—') : 'Personalizada',
                },
                {
                  label: 'Mídia',
                  value: customMediaUrl
                    ? (customMediaType === 'video' ? 'Vídeo da campanha' : 'Imagem da campanha')
                    : (useTemplate && selectedTemplate?.media_url)
                    ? (selectedTemplate.media_type === 'video' ? 'Vídeo do template' : 'Imagem do template')
                    : 'Sem mídia (só texto)',
                  muted: !customMediaUrl && !(useTemplate && selectedTemplate?.media_url),
                },
                { label: 'Destinatários', value: `${preview?.count ?? 0} contatos`, green: true },
                { label: 'Estimativa', value: estimatedMinutes(preview?.count ?? 0), muted: true },
              ].map(({ label, value, green, muted }) => (
                <div key={label} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#4a6050', width: 100, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: green ? '#25D366' : muted ? '#8aaa90' : '#e8f0e8' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prévia da mensagem final — renderizada com o 1º contato real */}
          <div style={{
            background: '#0d1410', border: '1px solid #1c2820',
            borderRadius: 10, padding: 16, marginBottom: 14,
          }}>
            <div style={labelStyle}>Prévia da mensagem</div>
            <div style={{
              background: '#0b3d2e', border: '1px solid rgba(37,211,102,0.2)',
              borderRadius: '10px 10px 10px 2px', padding: '10px 14px',
              fontSize: 13, color: '#e8f0e8', whiteSpace: 'pre-wrap',
              lineHeight: 1.6, maxWidth: 480,
            }}>
              {(() => {
                const mUrl  = customMediaUrl || (useTemplate ? selectedTemplate?.media_url : null);
                const mType = customMediaUrl ? customMediaType : selectedTemplate?.media_type;
                return mUrl ? (
                  <div style={{ marginBottom: 8 }}>
                    {mType === 'video'
                      ? <video src={mUrl} style={{ maxWidth: '100%', borderRadius: 8 }} muted controls />
                      : <img src={mUrl} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} />}
                  </div>
                ) : null;
              })()}
              {renderMessage(messageBody, preview?.contacts[0])}
            </div>
            {preview?.contacts[0] && (
              <div style={{ fontSize: 11, color: '#4a6050', marginTop: 8 }}>
                Exemplo real: assim a mensagem chega para {preview.contacts[0].name}
                {' '}({fmtPhone(preview.contacts[0].phone)}). As variáveis são preenchidas
                contato a contato.
              </div>
            )}
          </div>

          {/* Destinatários — confirmação final */}
          <div style={{
            background: '#0d1410', border: '1px solid #1c2820',
            borderRadius: 10, marginBottom: 18, overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid #1c2820',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ ...labelStyle, marginBottom: 0 }}>
                Destinatários ({preview?.count ?? 0})
              </span>
              <button
                onClick={() => setStep(2)}
                style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  border: '1px solid #1c2820', background: 'transparent',
                  color: '#8aaa90', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Ajustar lista
              </button>
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {(preview?.contacts || []).map(c => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 16px', borderBottom: '1px solid #111a12', fontSize: 12,
                }}>
                  <span style={{ flex: 1, color: '#e8f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                    {c.manual && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: '#fcd34d',
                        background: 'rgba(251,191,36,0.1)', borderRadius: 100,
                        padding: '1px 6px', marginLeft: 7, verticalAlign: 'middle',
                      }}>
                        MANUAL
                      </span>
                    )}
                  </span>
                  <span style={{ color: '#8aaa90', fontSize: 11, flexShrink: 0 }}>{fmtPhone(c.phone)}</span>
                </div>
              ))}
              {(preview?.count ?? 0) > (preview?.contacts.length ?? 0) && (
                <div style={{ padding: '8px 16px', fontSize: 11, color: '#4a6050' }}>
                  + {(preview!.count - preview!.contacts.length)} outros contatos (lista completa no passo anterior)
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div style={{
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: '#f59e0b', lineHeight: 1.5,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            As mensagens serão enviadas com intervalo de 2 a 4 segundos entre cada uma. Números repetidos recebem uma única vez. Você pode acompanhar o progresso em tempo real e cancelar a qualquer momento.
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setStep(2)} style={btn('ghost')} disabled={sending}>← Voltar</button>
            <button
              onClick={fireDisparo}
              disabled={sending}
              style={{
                ...btn('danger'),
                padding: '11px 28px', fontSize: 14, fontWeight: 700,
                opacity: sending ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: 8,
                flex: 1, justifyContent: 'center',
              }}
            >
              {sending ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Iniciando disparo...
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
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

// ─── Dashboard (Fase 2 do backlog) ────────────────────────────────────────────
// Visão agregada em tempo real: polling 5s com scan=1 (varredura de respostas
// no servidor via /message/find — o "tempo real" possível sem webhook).

interface DashStats { sent: number; delivered: number; failed: number; replies: number; }
interface DashCampaign {
  id: string; name: string; status: string;
  total_count: number | null; sent_count: number | null; delivered_count: number | null;
  failed_count: number | null; replied_count: number; started_at: string | null;
  completed_at?: string | null; last_error?: string | null;
  az_whatsapp_instances: { display_name: string | null; uazapi_name: string } | null;
}
interface DashReply {
  id: string; phone: string; body: string | null; created_at: string;
  contact_name: string | null; campaign_name: string | null;
}

function DashboardPanel() {
  const [today, setToday]     = useState<DashStats | null>(null);
  const [week, setWeek]       = useState<DashStats | null>(null);
  const [active, setActive]   = useState<DashCampaign[]>([]);
  const [recent, setRecent]   = useState<DashCampaign[]>([]);
  const [replies, setReplies] = useState<DashReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);

  const load = useCallback(async () => {
    if (inFlightRef.current) return; // scan no servidor pode passar de 5s — não empilha
    inFlightRef.current = true;
    try {
      const res = await fetch('/api/campaigns/dashboard?scan=1');
      if (!res.ok) return;
      const d = await res.json();
      setToday(d.today || null);
      setWeek(d.week || null);
      setActive(d.active || []);
      setRecent(d.recent || []);
      setReplies(d.replies_feed || []);
      setLastUpdate(new Date());
      // Pump: mantém campanhas ativas andando mesmo se a cadeia do worker morrer
      (d.active || []).forEach((c: DashCampaign) => pumpCampaign(c.id));
    } catch {
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [load]);

  const statCard = (label: string, value: number, color: string, sub?: string) => (
    <div key={label} style={{ background: '#111a12', border: '1px solid #1c2820', borderRadius: 10, padding: '16px 18px' }}>
      <div style={{ fontSize: 26, fontWeight: 700, color }}>{value.toLocaleString('pt-BR')}</div>
      <div style={{ fontSize: 12, color: '#8aaa90', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: '#4a6050', marginTop: 2 }}>{sub}</div>}
    </div>
  );

  const campRow = (c: DashCampaign, live: boolean) => {
    const total = c.total_count || 0;
    const sent = c.sent_count || 0;
    const inst = c.az_whatsapp_instances;
    return (
      <div key={c.id} style={{ padding: '10px 14px', borderBottom: '1px solid #111a12' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          {live && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#25D366', animation: 'pulse-dot 1s ease-in-out infinite', flexShrink: 0 }} />}
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#e8f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
          <StatusBadge status={c.status} />
        </div>
        <ProgressBar sent={sent} failed={c.failed_count || 0} total={total} compact />
        <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: '#4a6050', flexWrap: 'wrap' }}>
          <span style={{ color: '#22c55e' }}>{sent}/{total} enviadas</span>
          <span style={{ color: (c.delivered_count || 0) > 0 ? '#4de08c' : '#4a6050' }}>{c.delivered_count || 0} entregues</span>
          <span style={{ color: c.replied_count > 0 ? '#6AADFF' : '#4a6050' }}>{c.replied_count} respostas</span>
          {(c.failed_count || 0) > 0 && <span style={{ color: '#ef4444' }}>{c.failed_count} falhas</span>}
          {inst && <span>via {inst.display_name || inst.uazapi_name}</span>}
          {c.started_at && <span>{fmtDate(c.started_at)} {fmtTime(c.started_at)}</span>}
        </div>
        {c.last_error && c.status === 'error' && (
          <div style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{c.last_error}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#4a6050', fontSize: 13 }}>Carregando dashboard...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1080 }}>
      {/* Cards Hoje */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e8f0e8' }}>Hoje</span>
        {lastUpdate && (
          <span style={{ fontSize: 10, color: '#2d3d30' }}>
            atualizado {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · a cada 5s
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {statCard('Enviadas', today?.sent ?? 0, '#22c55e')}
        {statCard('Entregues', today?.delivered ?? 0, (today?.delivered ?? 0) > 0 ? '#4de08c' : '#4a6050')}
        {statCard('Respostas', today?.replies ?? 0, (today?.replies ?? 0) > 0 ? '#6AADFF' : '#4a6050')}
        {statCard('Falhas', today?.failed ?? 0, (today?.failed ?? 0) > 0 ? '#ef4444' : '#4a6050')}
      </div>

      {/* Cards 7 dias */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f0e8', marginBottom: 10 }}>Últimos 7 dias</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {statCard('Enviadas', week?.sent ?? 0, '#8aaa90')}
        {statCard('Entregues', week?.delivered ?? 0, '#8aaa90')}
        {statCard('Respostas', week?.replies ?? 0, (week?.replies ?? 0) > 0 ? '#6AADFF' : '#8aaa90')}
        {statCard('Falhas', week?.failed ?? 0, (week?.failed ?? 0) > 0 ? '#ef4444' : '#8aaa90')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
        <div>
          {/* Campanhas ativas */}
          <div style={{ background: '#0d1410', border: '1px solid #1c2820', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #1c2820', fontSize: 11, color: '#4a6050', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Disparos em andamento {active.length > 0 && <span style={{ color: '#25D366' }}>({active.length})</span>}
            </div>
            {active.length === 0 ? (
              <div style={{ padding: '18px 14px', fontSize: 12, color: '#4a6050', textAlign: 'center' }}>Nenhum disparo em andamento agora</div>
            ) : active.map(c => campRow(c, true))}
          </div>

          {/* Recentes */}
          <div style={{ background: '#0d1410', border: '1px solid #1c2820', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #1c2820', fontSize: 11, color: '#4a6050', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Campanhas dos últimos 7 dias
            </div>
            {recent.length === 0 ? (
              <div style={{ padding: '18px 14px', fontSize: 12, color: '#4a6050', textAlign: 'center' }}>Nenhuma campanha na última semana</div>
            ) : recent.map(c => campRow(c, false))}
          </div>
        </div>

        {/* Feed de respostas */}
        <div style={{ background: '#0d1410', border: '1px solid #1c2820', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1c2820', fontSize: 11, color: '#4a6050', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Últimas respostas
          </div>
          {replies.length === 0 ? (
            <div style={{ padding: '18px 14px', fontSize: 12, color: '#4a6050', textAlign: 'center', lineHeight: 1.6 }}>
              Nenhuma resposta registrada ainda.<br />
              <span style={{ fontSize: 11, color: '#2d3d30' }}>As respostas dos clientes aparecem aqui minutos após chegarem (varredura ativa — o servidor WhatsApp não envia notificações).</span>
            </div>
          ) : (
            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
              {replies.map(r => (
                <div key={r.id} style={{ padding: '10px 14px', borderBottom: '1px solid #111a12' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#6AADFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.contact_name || fmtPhone(r.phone)}
                    </span>
                    <span style={{ fontSize: 10, color: '#4a6050', flexShrink: 0 }}>
                      {fmtDate(r.created_at)} {fmtTime(r.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#c9d5cc', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>
                    {r.body || '[mensagem]'}
                  </div>
                  {r.campaign_name && (
                    <div style={{ fontSize: 10, color: '#4a6050', marginTop: 3 }}>← {r.campaign_name}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DisparosView() {
  const [tab, setTab] = useState<'dashboard' | 'list' | 'new'>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<any | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toast = useToast();

  // Botão Editar de um rascunho: carrega a campanha completa e abre o wizard
  async function openEdit(id: string) {
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      const d = await res.json();
      if (!res.ok || !d.campaign) { toast.error(d.error || 'Erro ao abrir campanha'); return; }
      setEditData(d.campaign);
      setTab('new');
    } catch {
      toast.error('Erro de conexão');
    }
  }

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns?limit=50');
      const d = await res.json();
      const list: Campaign[] = d.campaigns || [];
      setCampaigns(list);
      setLoading(false);
      // Pump: garante que campanhas "Enviando" continuem avançando mesmo
      // que a cadeia do worker tenha morrido (lease evita duplicação)
      list.filter(c => c.status === 'sending').forEach(c => pumpCampaign(c.id));
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);

  // Poll every 3s if any campaign is sending
  useEffect(() => {
    const hasSending = campaigns.some(c => c.status === 'sending');
    if (hasSending) {
      if (!pollRef.current) pollRef.current = setInterval(loadCampaigns, 3000);
    } else {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    }
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
  }, [campaigns, loadCampaigns]);

  function onWizardSuccess(campaignId: string) {
    setEditData(null);
    setTab('list');
    setLoading(true);
    loadCampaigns();
  }

  const sendingCount = campaigns.filter(c => c.status === 'sending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        height: 56, borderBottom: '1px solid #1c2820', background: '#080c09',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 4, flexShrink: 0,
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, marginRight: 12 }}>Disparos</span>

        {(['dashboard', 'list', 'new'] as const).map(t => (
          <button
            key={t}
            onClick={() => {
              // Clicar em "+ Nova Campanha" sempre abre o wizard limpo;
              // edição entra pelo botão Editar do card
              if (t === 'new') setEditData(null);
              setTab(t);
            }}
            style={{
              padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500, fontSize: 13, border: 'none',
              background: tab === t ? 'rgba(37,211,102,0.1)' : 'transparent',
              color: tab === t ? '#25D366' : '#4a6050', transition: 'all 0.12s',
            }}
          >
            {t === 'dashboard' ? 'Dashboard' : t === 'list' ? 'Campanhas' : (tab === 'new' && editData) ? 'Editando: ' + (editData.name || '').slice(0, 24) : '+ Nova Campanha'}
          </button>
        ))}

        {tab === 'list' && !loading && (
          <span style={{ fontSize: 12, color: '#4a6050', marginLeft: 4 }}>
            {campaigns.length} {campaigns.length === 1 ? 'campanha' : 'campanhas'}
          </span>
        )}

        {sendingCount > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#25D366' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', animation: 'pulse-dot 1s ease-in-out infinite', display: 'inline-block' }} />
            {sendingCount === 1 ? 'Disparando...' : `${sendingCount} disparos ativos`}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'dashboard' ? (
          <DashboardPanel />
        ) : tab === 'list' ? (
          <CampaignList
            campaigns={campaigns}
            loading={loading}
            onRefresh={loadCampaigns}
            onDelete={id => setCampaigns(prev => prev.filter(c => c.id !== id))}
            onEdit={openEdit}
          />
        ) : (
          <NewCampaignWizard
            key={editData?.id || 'nova'}
            existing={editData}
            onSuccess={onWizardSuccess}
            toast={toast}
          />
        )}
      </div>

      <Toast toasts={toast.toasts} onDismiss={toast.dismiss} />

      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes skeleton-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
