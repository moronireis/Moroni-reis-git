import { useState, useEffect, useCallback } from 'react';
import type { ConnectionStatus } from '../../lib/types';
import { NumberCard } from './NumberCard';

interface SyncStats {
  contacts: number;
  messages: number;
  photos: number;
  conversations: number;
}

interface SyncState {
  running: boolean;
  label: string;
  progress: string;
  done: boolean;
  error: string | null;
}

const idle: SyncState = { running: false, label: '', progress: '', done: false, error: null };

const s = {
  statBox: (accent?: string) => ({
    flex: 1,
    minWidth: 120,
    padding: '1rem 1.25rem',
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${accent ? `${accent}33` : 'rgba(201,169,110,0.15)'}`,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.3rem',
  }),
  statValue: (accent?: string) => ({
    fontSize: '1.6rem',
    fontWeight: 300,
    fontFamily: 'Cormorant Garamond, serif',
    color: accent || '#C9A96E',
    lineHeight: 1,
  }),
  statLabel: {
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'rgba(244,239,230,0.45)',
  },
  btn: (disabled: boolean, color?: string) => ({
    padding: '0.5rem 1rem',
    background: disabled ? 'rgba(255,255,255,0.04)' : (color || 'rgba(201,169,110,0.12)'),
    border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : (color ? `${color}66` : 'rgba(201,169,110,0.35)')}`,
    color: disabled ? 'rgba(244,239,230,0.35)' : (color || '#C9A96E'),
    fontSize: '0.73rem',
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s',
  }),
};

export function ConnectionPage() {
  const [instances, setInstances] = useState<ConnectionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [contactsSync, setContactsSync] = useState<SyncState>(idle);
  const [photosSync, setPhotosSync] = useState<SyncState>(idle);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/connection/status');
      if (res.ok) {
        const data = await res.json() as { instances?: ConnectionStatus[] };
        setInstances(data.instances || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/sync/contacts');
      if (res.ok) setStats(await res.json());
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchStats();
  }, [fetchStats]);

  const runContactsSync = async () => {
    setContactsSync({ running: true, label: 'Sincronizando contatos...', progress: '', done: false, error: null });
    try {
      const res = await fetch('/api/sync/contacts', { method: 'POST' });
      const data = await res.json() as { ok?: boolean; synced?: number; total?: number; groups_skipped?: number; error?: string };
      if (!res.ok || data.error) throw new Error(data.error || 'Falha na sincronização');
      setContactsSync({
        running: false,
        label: '',
        progress: `${data.synced} contatos sincronizados (${data.groups_skipped} grupos ignorados)`,
        done: true,
        error: null,
      });
      fetchStats();
    } catch (err) {
      setContactsSync({ running: false, label: '', progress: '', done: false, error: String(err) });
    }
  };

  const runPhotosSync = async () => {
    setPhotosSync({ running: true, label: 'Buscando fotos...', progress: '', done: false, error: null });

    let offset = 0;
    let totalUpdated = 0;
    let totalProcessed = 0;

    try {
      while (true) {
        const res = await fetch('/api/sync/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 30, offset }),
        });
        const data = await res.json() as {
          done?: boolean; updated?: number; skipped?: number; failed?: number;
          processed?: number; next_offset?: number | null; error?: string;
        };

        if (data.error) throw new Error(data.error);

        totalUpdated += data.updated || 0;
        totalProcessed += data.processed || 0;

        setPhotosSync(prev => ({
          ...prev,
          label: `Processando... ${totalProcessed} contatos`,
          progress: `${totalUpdated} fotos encontradas`,
        }));

        if (data.done || data.next_offset === null || data.next_offset === undefined) break;
        offset = data.next_offset;

        // Brief pause between batches
        await new Promise(r => setTimeout(r, 300));
      }

      setPhotosSync({
        running: false,
        label: '',
        progress: totalUpdated > 0
          ? `${totalUpdated} fotos sincronizadas`
          : 'Nenhuma foto disponível via API — serão capturadas ao receber mensagens',
        done: true,
        error: null,
      });
      fetchStats();
    } catch (err) {
      setPhotosSync({ running: false, label: '', progress: '', done: false, error: String(err) });
    }
  };

  const anyRunning = contactsSync.running || photosSync.running;

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.6rem', fontWeight: 300, color: '#C9A96E',
        }}>
          Conexão WhatsApp
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(244,239,230,0.6)', marginTop: '0.3rem', letterSpacing: '0.05em' }}>
          Gerencie a conexão dos números WhatsApp do Castelo dos Lagos
        </p>
      </div>

      {/* Instance cards */}
      {loading ? (
        <div style={{ color: 'rgba(244,239,230,0.6)', fontSize: '0.85rem' }}>
          Verificando status...
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {instances.map(inst => (
            <NumberCard key={inst.id} instance={inst} onStatusChange={fetchStatus} />
          ))}
        </div>
      )}

      {/* Sync panel */}
      <div style={{
        marginTop: '2rem',
        border: '1px solid rgba(201,169,110,0.2)',
        background: '#0f1912',
      }}>
        {/* Panel header */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(201,169,110,0.15)',
          fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#C9A96E', fontWeight: 500,
        }}>
          Sincronização de Dados
        </div>

        {/* Stats row */}
        <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={s.statBox()}>
            <span style={s.statValue()}>
              {stats ? stats.contacts.toLocaleString('pt-BR') : '—'}
            </span>
            <span style={s.statLabel}>Contatos</span>
          </div>
          <div style={s.statBox('#4A80A4')}>
            <span style={s.statValue('#4A80A4')}>
              {stats ? stats.conversations.toLocaleString('pt-BR') : '—'}
            </span>
            <span style={s.statLabel}>Conversas</span>
          </div>
          <div style={s.statBox('#52796F')}>
            <span style={s.statValue('#52796F')}>
              {stats ? stats.messages.toLocaleString('pt-BR') : '—'}
            </span>
            <span style={s.statLabel}>Mensagens</span>
          </div>
          <div style={s.statBox('#7B68B0')}>
            <span style={s.statValue('#7B68B0')}>
              {stats ? stats.photos.toLocaleString('pt-BR') : '—'}
            </span>
            <span style={s.statLabel}>Fotos</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '0 1.25rem 1.25rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>

          {/* Contacts sync */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={runContactsSync}
                disabled={anyRunning}
                style={s.btn(anyRunning)}
              >
                {contactsSync.running ? contactsSync.label : 'Sincronizar Contatos'}
              </button>
              {contactsSync.running && (
                <span style={{ fontSize: '0.75rem', color: 'rgba(244,239,230,0.5)' }}>
                  Aguarde...
                </span>
              )}
              {contactsSync.done && !contactsSync.running && (
                <span style={{ fontSize: '0.75rem', color: '#52796F' }}>
                  ✓ {contactsSync.progress}
                </span>
              )}
              {contactsSync.error && (
                <span style={{ fontSize: '0.75rem', color: '#8B3A3A' }}>
                  Erro: {contactsSync.error}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(244,239,230,0.35)', margin: 0 }}>
              Importa e atualiza todos os contatos do WhatsApp. Grupos são ignorados.
            </p>
          </div>

          {/* Photos sync */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={runPhotosSync}
                disabled={anyRunning}
                style={s.btn(anyRunning, '#7B68B0')}
              >
                {photosSync.running ? photosSync.label : 'Sincronizar Fotos'}
              </button>
              {photosSync.running && photosSync.progress && (
                <span style={{ fontSize: '0.75rem', color: 'rgba(244,239,230,0.5)' }}>
                  {photosSync.progress}
                </span>
              )}
              {photosSync.done && !photosSync.running && (
                <span style={{ fontSize: '0.75rem', color: photosSync.progress.includes('Nenhuma') ? '#B07A40' : '#52796F', maxWidth: 400 }}>
                  {photosSync.progress.includes('Nenhuma') ? '⚠ ' : '✓ '}{photosSync.progress}
                </span>
              )}
              {photosSync.error && (
                <span style={{ fontSize: '0.75rem', color: '#8B3A3A' }}>
                  Erro: {photosSync.error}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(244,239,230,0.35)', margin: 0 }}>
              Tenta buscar foto de perfil para contatos que ainda não têm. Fotos também chegam automaticamente ao receber mensagens.
            </p>
          </div>
        </div>
      </div>

      {/* Webhook info */}
      <div style={{
        marginTop: '1.25rem', padding: '1rem',
        background: 'rgba(82,121,111,0.06)',
        border: '1px solid rgba(82,121,111,0.2)',
        fontSize: '0.75rem', color: 'rgba(244,239,230,0.6)', lineHeight: 1.8,
      }}>
        <strong style={{ color: '#52796F', display: 'block', marginBottom: '0.4rem', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Webhook ativo
        </strong>
        Mensagens recebidas e enviadas são capturadas automaticamente em tempo real.<br />
        Eventos configurados: <code style={{ color: '#C9A96E', fontSize: '0.7rem' }}>messages</code>, <code style={{ color: '#C9A96E', fontSize: '0.7rem' }}>messages_groups</code>
      </div>

      {/* How to connect */}
      <div style={{
        marginTop: '1.25rem', padding: '1rem',
        background: 'rgba(201,169,110,0.06)',
        border: '1px solid rgba(201,169,110,0.25)',
        fontSize: '0.78rem', color: 'rgba(244,239,230,0.6)', lineHeight: 1.8,
      }}>
        <strong style={{ color: '#C9A96E', display: 'block', marginBottom: '0.5rem' }}>
          Como conectar
        </strong>
        1. Clique em "Conectar" no número desejado<br />
        2. Aguarde o QR code aparecer<br />
        3. Abra o WhatsApp no celular &rarr; Menu &rarr; Aparelhos conectados &rarr; Conectar aparelho<br />
        4. Escaneie o QR code<br />
        5. Aguarde confirmação &mdash; o status mudará para "Conectado"
      </div>
    </div>
  );
}
