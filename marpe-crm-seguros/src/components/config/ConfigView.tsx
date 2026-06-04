import { useState, useEffect } from 'react';

interface User { id: string; full_name: string; email: string; phone: string | null; role: string; is_active: boolean; }
interface WaStatus { connected: boolean; status: string; phone: string | null; name: string | null; error?: string; }
interface SyncLog { id: string; sync_type: string; status: string; records_created: number; records_updated: number; records_skipped: number; error_message: string | null; started_at: string; completed_at: string | null; }

export default function ConfigView() {
  const [users, setUsers] = useState<User[]>([]);
  const [waStatus, setWaStatus] = useState<WaStatus | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [corpStatus, setCorpStatus] = useState<{ connected: boolean; clientes?: number; error?: string } | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingWa, setLoadingWa] = useState(true);
  const [loadingCorp, setLoadingCorp] = useState(true);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'corp' | 'users'>('whatsapp');
  const [checkingWa, setCheckingWa] = useState(false);
  const [syncingCorp, setSyncingCorp] = useState(false);
  const [syncResult, setSyncResult] = useState<string>('');

  function loadUsers() {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoadingUsers(false); })
      .catch(() => setLoadingUsers(false));
  }

  function checkWa() {
    setCheckingWa(true);
    fetch('/api/admin/whatsapp-status')
      .then(r => r.json())
      .then(d => { setWaStatus(d); setLoadingWa(false); setCheckingWa(false); })
      .catch(() => { setLoadingWa(false); setCheckingWa(false); });
  }

  function loadCorp() {
    setLoadingCorp(true);
    Promise.all([
      fetch('/api/corp/status').then(r => r.json()).catch(() => ({ connected: false, error: 'Erro de rede' })),
      fetch('/api/internal/corp-sync-logs').then(r => r.json()).catch(() => ({ logs: [] })),
    ]).then(([status, logsData]) => {
      setCorpStatus(status);
      setSyncLogs(logsData.logs || []);
      setLoadingCorp(false);
    });
  }

  async function triggerSync(type = 'all') {
    setSyncingCorp(true);
    setSyncResult('');
    try {
      const res = await fetch('/api/corp/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const d = await res.json();
      if (d.ok) {
        const total = (d.results || []).reduce((s: number, r: any) => s + r.created + r.updated, 0);
        setSyncResult(`Sync concluído: ${total} registros processados`);
        loadCorp();
      } else {
        setSyncResult(`Erro: ${d.error}`);
      }
    } catch {
      setSyncResult('Erro de conexão');
    }
    setSyncingCorp(false);
  }

  useEffect(() => {
    loadUsers();
    checkWa();
    loadCorp();
  }, []);

  async function toggleUser(user: User) {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, is_active: !user.is_active }),
    });
    loadUsers();
  }

  const tab = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
    color: active ? 'var(--accent-light)' : 'var(--text-muted)',
    background: 'none', border: 'none',
    borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
    fontFamily: 'inherit',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>Configurações</span>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0, paddingLeft: 24 }}>
        <button style={tab(activeTab === 'whatsapp')} onClick={() => setActiveTab('whatsapp')}>WhatsApp</button>
        <button style={tab(activeTab === 'corp')} onClick={() => setActiveTab('corp')}>Corp (Agia)</button>
        <button style={tab(activeTab === 'users')} onClick={() => setActiveTab('users')}>Usuários</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === 'whatsapp' && (
          <div style={{ maxWidth: 520 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Status da conexão WhatsApp</div>

            {loadingWa ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Verificando conexão...</div>
            ) : waStatus ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: waStatus.connected ? 'var(--green)' : '#f87171', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: waStatus.connected ? 'var(--green)' : '#f87171' }}>
                    {waStatus.connected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                {[
                  ['Status', waStatus.status],
                  ['Número', waStatus.phone],
                  ['Nome', waStatus.name],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                {waStatus.error && (
                  <div style={{ fontSize: 12, color: '#f87171', marginTop: 8 }}>{waStatus.error}</div>
                )}
              </div>
            ) : null}

            <button
              onClick={checkWa}
              disabled={checkingWa}
              style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            >
              {checkingWa ? 'Verificando...' : '↺ Verificar conexão'}
            </button>

            <div style={{ marginTop: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Webhook URL</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Configure esta URL no UazapiGO para receber mensagens:</div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px 12px', color: 'var(--accent-light)', wordBreak: 'break-all' }}>
                {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/whatsapp
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Eventos: <strong>messages</strong></div>
            </div>
          </div>
        )}

        {activeTab === 'corp' && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Integração Corp (Agia)</div>

            {/* Status card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: corpStatus?.connected ? 'var(--green)' : '#4b5563' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{loadingCorp ? 'Verificando...' : corpStatus?.connected ? 'Conectado' : 'Sem credenciais'}</span>
              </div>
              {corpStatus?.connected && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{corpStatus.clientes?.toLocaleString('pt-BR')} clientes na Corp</div>
              )}
              {!corpStatus?.connected && !loadingCorp && (
                <div style={{ fontSize: 12, color: '#f87171', marginTop: 4 }}>
                  Configure <code style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4 }}>CORP_API_URL</code>, <code style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4 }}>CORP_API_EMAIL</code> e <code style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4 }}>CORP_API_PASSWORD</code> nas variáveis de ambiente do Vercel.
                </div>
              )}
            </div>

            {/* Sync trigger */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Sync completo', type: 'all' },
                { label: 'Só clientes', type: 'clientes' },
                { label: 'Só negócios', type: 'negocios' },
              ].map(({ label, type }) => (
                <button key={type} onClick={() => triggerSync(type)} disabled={syncingCorp}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, opacity: syncingCorp ? 0.5 : 1 }}>
                  {syncingCorp ? '⏳ Sincronizando...' : `↺ ${label}`}
                </button>
              ))}
            </div>
            {syncResult && (
              <div style={{ fontSize: 12, color: syncResult.startsWith('Erro') ? '#f87171' : 'var(--green)', marginBottom: 12 }}>{syncResult}</div>
            )}

            {/* Auto-sync info */}
            <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 600, marginBottom: 4 }}>Sync automático</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Todo dia às 03:00 UTC via Vercel Cron. Janela: últimos 60 dias.</div>
            </div>

            {/* Sync history */}
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Histórico de sync</div>
            {syncLogs.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nenhum sync realizado ainda.</div>
            ) : syncLogs.slice(0, 10).map(log => (
              <div key={log.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{log.sync_type}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    +{log.records_created} criados · {log.records_updated} atualizados · {log.records_skipped} pulados
                  </div>
                  {log.error_message && <div style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>{log.error_message}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: log.status === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: log.status === 'success' ? 'var(--green)' : '#fbbf24', display: 'inline-block' }}>{log.status}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    {new Date(log.started_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Usuários da plataforma</div>
            {loadingUsers ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Carregando...</div>
            ) : users.map(u => (
              <div key={u.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e1e30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--accent-light)', flexShrink: 0 }}>
                  {(u.full_name || u.email).charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{u.full_name || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: u.role === 'admin' ? 'rgba(59,130,246,0.1)' : 'rgba(107,114,128,0.1)', color: u.role === 'admin' ? 'var(--accent-light)' : 'var(--text-muted)' }}>
                  {u.role}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.is_active ? 'var(--green)' : '#4b5563' }} />
                  <button
                    onClick={() => toggleUser(u)}
                    style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {u.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
