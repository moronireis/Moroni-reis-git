import { useState, useEffect, useRef } from 'react';

interface Contact {
  id: string; name: string; phone: string | null; email: string | null;
  tags: string[]; corp_id: string | null; city: string | null;
  last_message?: string | null;
  last_message_direction?: 'inbound' | 'outbound';
  last_message_at?: string;
}

interface Message {
  id: string; contact_id: string; direction: 'inbound' | 'outbound';
  content_type: string; body: string | null; status: string;
  is_from_automation: boolean; created_at: string;
}

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  auto: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA' },
  vida: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  residencial: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
  empresarial: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  equipamento: { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function nameColor(name: string): string {
  const colors = ['#60A5FA', '#4ade80', '#fbbf24', '#a78bfa', '#22d3ee', '#f87171', '#fb923c'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800000) return 'ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function InboxView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Load contacts + poll every 10s to catch new contacts from WhatsApp
  useEffect(() => {
    const load = () => {
      const q = search ? `&search=${encodeURIComponent(search)}` : '';
      fetch(`/api/contacts?limit=50${q}`)
        .then(r => r.json())
        .then(d => { setContacts(d.contacts || []); setLoadingContacts(false); })
        .catch(() => setLoadingContacts(false));
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [search]);

  // Load messages for active contact
  useEffect(() => {
    if (!activeContactId) return;
    setLoadingMsgs(true);
    fetch(`/api/messages?contact_id=${activeContactId}`)
      .then(r => r.json())
      .then(d => { setMessages(d.messages || []); setLoadingMsgs(false); })
      .catch(() => setLoadingMsgs(false));
  }, [activeContactId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 3s — compares last message ID, not count
  useEffect(() => {
    if (!activeContactId) return;
    const interval = setInterval(() => {
      fetch(`/api/messages?contact_id=${activeContactId}`)
        .then(r => r.json())
        .then(d => {
          const incoming = d.messages || [];
          const lastId = messages[messages.length - 1]?.id;
          const incomingLastId = incoming[incoming.length - 1]?.id;
          if (incomingLastId !== lastId) setMessages(incoming);
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [activeContactId, messages]);

  const activeContact = contacts.find(c => c.id === activeContactId);

  async function sendMessage() {
    if (!newMsg.trim() || !activeContact?.phone) return;
    setSending(true);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact_id: activeContactId, phone: activeContact.phone, text: newMsg }),
      });
      setNewMsg('');
      // Refresh messages
      const r = await fetch(`/api/messages?contact_id=${activeContactId}`);
      const d = await r.json();
      setMessages(d.messages || []);
    } catch {}
    setSending(false);
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Contact List */}
      <div style={{ width: 320, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>Conversas</h3>
          <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>Online 24h</span>
        </div>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar contato, telefone..."
            style={{ width: '100%', padding: '9px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingContacts ? (
            <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>Carregando contatos...</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>Nenhum contato encontrado</div>
          ) : contacts.map(c => (
            <div key={c.id} onClick={() => setActiveContactId(c.id)}
              style={{ display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer',
                borderLeft: `3px solid ${activeContactId === c.id ? 'var(--accent)' : 'transparent'}`,
                background: activeContactId === c.id ? 'rgba(59,130,246,0.06)' : 'transparent', transition: 'all 0.1s' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1e1e30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: nameColor(c.name), flexShrink: 0 }}>
                {getInitials(c.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{c.name}</div>
                  {c.last_message_at && <div style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 6 }}>{formatTime(c.last_message_at)}</div>}
                </div>
                {c.last_message ? (
                  <div style={{ fontSize: 11, color: c.last_message_direction === 'inbound' ? 'var(--text-secondary)' : 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.last_message_direction === 'outbound' ? '→ ' : ''}{c.last_message}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{c.phone || c.email || '—'}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeContact ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          <div style={{ height: 60, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1e1e30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: nameColor(activeContact.name) }}>
              {getInitials(activeContact.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{activeContact.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{activeContact.phone || ''}</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loadingMsgs ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 40 }}>Carregando mensagens...</div>
            ) : messages.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 40 }}>Nenhuma mensagem ainda. Envie a primeira!</div>
            ) : messages.map(m => {
              const isSent = m.direction === 'outbound';
              const isAuto = m.is_from_automation;
              return (
                <div key={m.id} style={{
                  maxWidth: '65%', padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                  alignSelf: isSent ? 'flex-end' : 'flex-start',
                  background: isAuto ? 'rgba(34,197,94,0.06)' : isSent ? 'var(--accent-dim)' : 'var(--bg-card)',
                  border: `1px ${isAuto ? 'dashed' : 'solid'} ${isAuto ? 'rgba(34,197,94,0.25)' : isSent ? 'rgba(59,130,246,0.2)' : 'var(--border)'}`,
                  borderBottomRightRadius: isSent ? 4 : 12, borderBottomLeftRadius: isSent ? 12 : 4,
                }}>
                  {isAuto && <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Automação</div>}
                  {m.body}
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{formatTime(m.created_at)}</div>
                </div>
              );
            })}
            <div ref={msgEndRef} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Digite uma mensagem..." disabled={sending}
              style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={sendMessage} disabled={sending || !newMsg.trim()}
              style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sending ? 0.5 : 1 }}>
              <svg style={{ width: 16, height: 16, stroke: '#fff', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          Selecione um contato para conversar
        </div>
      )}

      {/* CRM Side Panel */}
      {activeContact && (
        <div style={{ width: 300, borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0, overflowY: 'auto', padding: '14px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Dados do Contato</div>
          {[
            ['Nome', activeContact.name],
            ['Telefone', activeContact.phone],
            ['E-mail', activeContact.email],
            ['Cidade', activeContact.city],
            ['Corp ID', activeContact.corp_id],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(26,26,42,0.3)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{k}</span>
              <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Mensagens</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{messages.length} mensagem{messages.length !== 1 ? 's' : ''} no histórico</div>
        </div>
      )}
    </div>
  );
}
