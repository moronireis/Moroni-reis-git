import { useState, useEffect, useRef, useCallback } from 'react';
import { Toast, useToast } from '../ui/Toast';

interface Instance {
  id: string;
  slot_number: number;
  display_name: string | null;
  uazapi_name: string;
  phone_number: string | null;
  status: string;
  qr_code: string | null;
  is_active: boolean;
}

interface LiveInfo {
  profile_name: string | null;
  profile_pic_url: string | null;
  phone_number: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  connected:    'Conectado',
  disconnected: 'Desconectado',
  waiting_qr:  'Aguardando QR',
  connecting:   'Conectando...',
};

const STATUS_COLOR: Record<string, string> = {
  connected:    '#25D366',
  disconnected: '#ef4444',
  waiting_qr:   '#f59e0b',
  connecting:   '#f59e0b',
};

export default function ConfigView() {
  const { toasts, dismiss, success, error: showError } = useToast();

  const [instances, setInstances]       = useState<Instance[]>([]);
  const [loading, setLoading]           = useState(true);
  const [qrMap, setQrMap]               = useState<Record<string, string | null>>({});
  const [loadingId, setLoadingId]       = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [liveInfo, setLiveInfo]         = useState<Record<string, LiveInfo>>({});
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editName, setEditName]         = useState('');
  const [savingId, setSavingId]         = useState<string | null>(null);
  const [blastDelay, setBlastDelay]     = useState(2000);
  const [maxDaily, setMaxDaily]         = useState(500);
  const [savingSettings, setSavingSettings] = useState(false);
  const pollRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const loadInstances = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/instances');
      if (r.ok) setInstances(await r.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadInstances(); return () => { Object.values(pollRef.current).forEach(clearInterval); }; }, [loadInstances]);

  const fetchQR = async (inst: Instance) => {
    if (loadingId) return;
    setLoadingId(inst.id);
    try {
      const r = await fetch(`/api/instances/qr?id=${inst.id}`);
      const d = await r.json();

      if (d.status === 'connected') {
        setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, status: 'connected' } : i));
        setQrMap(m => ({ ...m, [inst.id]: null }));
        success(`${inst.display_name || inst.uazapi_name} conectado!`);
        return;
      }

      if (d.qr) {
        setQrMap(m => ({ ...m, [inst.id]: d.qr }));
        setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, status: 'waiting_qr' } : i));
        startPolling(inst);
      } else {
        showError('Não foi possível gerar o QR code. Verifique se a instância está ativa no UazapiGO.');
      }
    } catch (e: any) {
      showError(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const syncStatus = async (inst: Instance) => {
    try {
      const r = await fetch(`/api/instances/status?id=${inst.id}`);
      if (!r.ok) return;
      const d = await r.json();
      setInstances(prev => prev.map(i => i.id === inst.id
        ? { ...i, status: d.status, phone_number: d.phone_number ?? i.phone_number }
        : i
      ));
      if (d.profile_name || d.profile_pic_url || d.phone_number) {
        setLiveInfo(m => ({ ...m, [inst.id]: { profile_name: d.profile_name, profile_pic_url: d.profile_pic_url, phone_number: d.phone_number } }));
      }
    } catch {}
  };

  const disconnect = async (inst: Instance) => {
    if (!confirm(`Desconectar "${inst.display_name || inst.uazapi_name}"?`)) return;
    setDisconnectingId(inst.id);
    try {
      const r = await fetch('/api/instances/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inst.id }),
      });
      if (r.ok) {
        setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, status: 'disconnected', phone_number: null } : i));
        setQrMap(m => ({ ...m, [inst.id]: null }));
        setLiveInfo(m => { const n = { ...m }; delete n[inst.id]; return n; });
        success(`${inst.display_name || inst.uazapi_name} desconectado.`);
      } else {
        showError('Erro ao desconectar.');
      }
    } finally { setDisconnectingId(null); }
  };

  const startPolling = (inst: Instance) => {
    if (pollRef.current[inst.id]) clearInterval(pollRef.current[inst.id]);
    let attempts = 0;
    pollRef.current[inst.id] = setInterval(async () => {
      attempts++;
      if (attempts > 40) { clearInterval(pollRef.current[inst.id]); return; } // 2 min timeout
      try {
        const r = await fetch(`/api/instances/qr?id=${inst.id}`);
        const d = await r.json();
        if (d.status === 'connected') {
          clearInterval(pollRef.current[inst.id]);
          setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, status: 'connected' } : i));
          setQrMap(m => ({ ...m, [inst.id]: null }));
          success(`${inst.display_name || inst.uazapi_name} conectado com sucesso!`);
          // Sync profile info
          syncStatus(inst);
        }
      } catch {}
    }, 3000);
  };

  const saveName = async (inst: Instance) => {
    setSavingId(inst.id);
    try {
      const r = await fetch('/api/instances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inst.id, display_name: editName.trim() || null }),
      });
      if (r.ok) {
        setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, display_name: editName.trim() || null } : i));
        setEditingId(null);
        success('Nome atualizado.');
      } else {
        showError('Erro ao salvar nome.');
      }
    } finally { setSavingId(null); }
  };

  const connected = instances.filter(i => i.status === 'connected').length;
  const total = instances.length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: '#080c09' }}>
      <Toast toasts={toasts} onDismiss={dismiss} />

      {/* Page header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1e2820', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f2' }}>Configurações</div>
            <div style={{ fontSize: 12, color: '#4b5a52', marginTop: 2 }}>
              {connected}/{total} números conectados
            </div>
          </div>
          <button onClick={loadInstances} style={{
            background: '#131a16', border: '1px solid #1e2820', borderRadius: 8,
            padding: '7px 14px', fontSize: 12, color: '#6b7a72', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Atualizar
          </button>
        </div>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* WhatsApp instances section */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7a72', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            Números WhatsApp
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4b5a52', fontSize: 13 }}>Carregando instâncias...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {instances.map(inst => {
                const statusColor = STATUS_COLOR[inst.status] || '#4b5a52';
                const statusLabel = STATUS_LABEL[inst.status] || inst.status;
                const qr = qrMap[inst.id];
                const isLoading = loadingId === inst.id;
                const isEditing = editingId === inst.id;
                const isSaving = savingId === inst.id;

                return (
                  <div key={inst.id} style={{
                    background: '#0d1410',
                    border: `1px solid ${inst.status === 'connected' ? 'rgba(37,211,102,0.2)' : '#1e2820'}`,
                    borderRadius: 12, overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}>
                    {/* Card header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a2218', display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Slot badge */}
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: inst.status === 'connected' ? 'rgba(37,211,102,0.12)' : '#131a16',
                        border: `1px solid ${inst.status === 'connected' ? 'rgba(37,211,102,0.25)' : '#1e2820'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700,
                        color: inst.status === 'connected' ? '#4de08c' : '#4b5a52',
                      }}>
                        {inst.slot_number}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') saveName(inst); if (e.key === 'Escape') setEditingId(null); }}
                              placeholder={inst.uazapi_name}
                              autoFocus
                              style={{
                                flex: 1, background: '#080c09', border: '1px solid rgba(37,211,102,0.3)',
                                borderRadius: 6, padding: '4px 8px', color: '#e2e8e4', fontSize: 13, outline: 'none',
                              }}
                            />
                            <button onClick={() => saveName(inst)} disabled={isSaving} style={{
                              background: '#25D366', border: 'none', borderRadius: 6, padding: '4px 10px',
                              color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            }}>
                              {isSaving ? '...' : 'OK'}
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => { setEditingId(inst.id); setEditName(inst.display_name || ''); }}
                            title="Clique para editar o nome"
                            style={{ cursor: 'pointer' }}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8e4', display: 'flex', alignItems: 'center', gap: 5 }}>
                              {inst.display_name || inst.uazapi_name}
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3a4a3e" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </div>
                            {inst.phone_number && (
                              <div style={{ fontSize: 11, color: '#4b5a52', marginTop: 1 }}>{inst.phone_number}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status dot */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, boxShadow: inst.status === 'connected' ? '0 0 6px rgba(37,211,102,0.5)' : 'none' }} />
                        <span style={{ fontSize: 11, color: statusColor, fontWeight: 500 }}>{statusLabel}</span>
                      </div>
                    </div>

                    {/* QR code area */}
                    {qr && inst.status === 'waiting_qr' && (
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderBottom: '1px solid #1a2218' }}>
                        <div style={{ fontSize: 11, color: '#6b7a72', textAlign: 'center' }}>
                          Escaneie com o WhatsApp no celular
                        </div>
                        <div style={{ background: '#fff', borderRadius: 10, padding: 10 }}>
                          <img src={qr} alt="QR Code" style={{ width: 160, height: 160, display: 'block' }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#4b5a52', textAlign: 'center' }}>
                          Aguardando leitura... <span style={{ color: '#25D366' }}>●</span>
                        </div>
                      </div>
                    )}

                    {/* Connected profile info */}
                    {inst.status === 'connected' && liveInfo[inst.id] && (
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1a2218', display: 'flex', alignItems: 'center', gap: 10 }}>
                        {liveInfo[inst.id].profile_pic_url && (
                          <img
                            src={liveInfo[inst.id].profile_pic_url!}
                            alt="perfil"
                            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(37,211,102,0.3)', flexShrink: 0 }}
                          />
                        )}
                        <div style={{ minWidth: 0 }}>
                          {liveInfo[inst.id].profile_name && (
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#4de08c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {liveInfo[inst.id].profile_name}
                            </div>
                          )}
                          {liveInfo[inst.id].phone_number && (
                            <div style={{ fontSize: 11, color: '#4b5a52' }}>{liveInfo[inst.id].phone_number}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                      {inst.status !== 'connected' ? (
                        <button
                          onClick={() => fetchQR(inst)}
                          disabled={!!isLoading}
                          style={{
                            flex: 1, background: isLoading ? '#131a16' : 'rgba(37,211,102,0.12)',
                            border: '1px solid rgba(37,211,102,0.2)', borderRadius: 8,
                            padding: '8px 0', fontSize: 12, fontWeight: 600,
                            color: isLoading ? '#4b5a52' : '#25D366',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {isLoading ? 'Carregando...' : qr ? 'Atualizar QR' : 'Conectar'}
                        </button>
                      ) : (
                        <>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#25D366', fontWeight: 600 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Pronto para disparar
                          </div>
                          {/* Disconnect button */}
                          <button
                            onClick={() => disconnect(inst)}
                            disabled={disconnectingId === inst.id}
                            title="Desconectar"
                            style={{
                              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                              color: disconnectingId === inst.id ? '#4b5a52' : '#ef4444',
                            }}
                          >
                            {/* Power icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                          </button>
                        </>
                      )}
                      {/* Sync/refresh button */}
                      <button
                        onClick={() => inst.status === 'connected' ? syncStatus(inst) : fetchQR(inst)}
                        title="Verificar status"
                        style={{ background: '#131a16', border: '1px solid #1e2820', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#4b5a52' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {connected > 0 && (
            <div style={{ marginTop: 14, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.12)', borderRadius: 10, padding: '10px 16px', fontSize: 12, color: '#4de08c' }}>
              ✓ {connected} número{connected !== 1 ? 's' : ''} pronto{connected !== 1 ? 's' : ''} para disparos. Os disparos serão distribuídos automaticamente entre os números conectados.
            </div>
          )}
        </div>

        {/* Blast settings */}
        <div style={{ background: '#0d1410', border: '1px solid #1e2820', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a2218' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8e4' }}>Configurações de Disparo</div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: '#c9d5cc' }}>Intervalo entre mensagens</div>
                <div style={{ fontSize: 11, color: '#4b5a52', marginTop: 2 }}>Milissegundos entre cada envio (mínimo 1000ms)</div>
              </div>
              <input
                type="number" min={1000} max={10000} step={500}
                value={blastDelay}
                onChange={e => setBlastDelay(Number(e.target.value))}
                style={{ width: 120, background: '#080c09', border: '1px solid #1e2820', borderRadius: 8, padding: '8px 12px', color: '#e2e8e4', fontSize: 13, outline: 'none', textAlign: 'right' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: '#c9d5cc' }}>Máximo de mensagens por dia</div>
                <div style={{ fontSize: 11, color: '#4b5a52', marginTop: 2 }}>Limite diário de disparos por segurança</div>
              </div>
              <input
                type="number" min={10} max={2000} step={50}
                value={maxDaily}
                onChange={e => setMaxDaily(Number(e.target.value))}
                style={{ width: 120, background: '#080c09', border: '1px solid #1e2820', borderRadius: 8, padding: '8px 12px', color: '#e2e8e4', fontSize: 13, outline: 'none', textAlign: 'right' }}
              />
            </div>
            <button
              onClick={async () => { setSavingSettings(true); await new Promise(r => setTimeout(r, 400)); setSavingSettings(false); success('Configurações salvas.'); }}
              disabled={savingSettings}
              style={{ background: '#25D366', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: savingSettings ? 'not-allowed' : 'pointer', opacity: savingSettings ? 0.6 : 1 }}
            >
              {savingSettings ? 'Salvando...' : 'Salvar configurações'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
