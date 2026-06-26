import { useState, useEffect, useRef, useCallback } from 'react';
import MessageContent from './MessageContent';

interface Instance {
  id: string;
  slot_number: number;
  display_name: string | null;
  uazapi_name: string;
  status: string;
}

interface Conversation {
  id: string;
  remote_jid: string;
  remote_name: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_direction: string;
  unread_count: number;
  status: string;
  instance_id: string;
  instance: { slot_number: number; display_name: string | null; uazapi_name: string } | null;
}

interface Message {
  id: string;
  body: string | null;
  content_type: string;
  media_url: string | null;
  media_mime: string | null;
  direction: 'inbound' | 'outbound';
  sent_at: string;
  metadata?: any;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function initials(name: string | null): string {
  if (!name) return '?';
  const p = name.trim().split(' ');
  if (p.length === 1) return p[0][0]?.toUpperCase() ?? '?';
  return ((p[0][0] ?? '') + (p[p.length - 1][0] ?? '')).toUpperCase();
}

function instanceLabel(conv: Conversation): string {
  if (!conv.instance) return '';
  return conv.instance.display_name || conv.instance.uazapi_name;
}

function contentIcon(type: string): string {
  switch (type) {
    case 'image':    return '📷 ';
    case 'audio':    return '🎵 ';
    case 'video':    return '🎥 ';
    case 'document': return '📄 ';
    case 'sticker':  return '🖼 ';
    default:         return '';
  }
}

export default function ConversasView() {
  const [instances, setInstances]     = useState<Instance[]>([]);
  const [convs, setConvs]             = useState<Conversation[]>([]);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [selected, setSelected]       = useState<Conversation | null>(null);
  const [loading, setLoading]         = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending]         = useState(false);
  const [text, setText]               = useState('');
  const [filterInst, setFilterInst]   = useState('');
  const [search, setSearch]           = useState('');
  const [tab, setTab]                 = useState<'open' | 'resolved'>('open');
  const [openedIds, setOpenedIds]     = useState<Set<string>>(new Set()); // track read convs

  const bottomRef      = useRef<HTMLDivElement>(null);
  const msgPollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const listPollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  // ── Data loaders ──────────────────────────────────────────────────────
  const loadInstances = useCallback(async () => {
    const r = await fetch('/api/instances');
    if (r.ok) setInstances(await r.json());
  }, []);

  const loadConvs = useCallback(async () => {
    const p = new URLSearchParams({ status: tab, limit: '80' });
    if (filterInst) p.set('instance_id', filterInst);
    if (search) p.set('q', search);
    const r = await fetch(`/api/conversations?${p}`);
    if (r.ok) {
      const d = await r.json();
      setConvs(Array.isArray(d) ? d : []);
    }
    setLoading(false);
  }, [tab, filterInst, search]);

  const loadMessages = useCallback(async (convId: string) => {
    const r = await fetch(`/api/conversations/messages?conversation_id=${convId}`);
    if (r.ok) setMessages(await r.json());
  }, []);

  // ── Effects ───────────────────────────────────────────────────────────
  useEffect(() => { loadInstances(); }, [loadInstances]);

  useEffect(() => {
    setLoading(true);
    loadConvs();
    // Poll list every 10s
    if (listPollRef.current) clearInterval(listPollRef.current);
    listPollRef.current = setInterval(loadConvs, 10000);
    return () => { if (listPollRef.current) clearInterval(listPollRef.current); };
  }, [loadConvs]);

  useEffect(() => {
    if (!selected) { setMessages([]); return; }
    setLoadingMsgs(true);
    loadMessages(selected.id).then(() => setLoadingMsgs(false));
    // Mark as read
    setOpenedIds(s => new Set([...s, selected.id]));
    // Poll messages every 3s
    if (msgPollRef.current) clearInterval(msgPollRef.current);
    msgPollRef.current = setInterval(() => loadMessages(selected.id), 3000);
    return () => { if (msgPollRef.current) clearInterval(msgPollRef.current); };
  }, [selected, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ── Send message ──────────────────────────────────────────────────────
  const send = async () => {
    if (!text.trim() || !selected || sending) return;
    setSending(true);
    const t = text.trim();
    setText('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    try {
      const r = await fetch('/api/conversations/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: selected.id, text: t }),
      });
      if (r.ok) {
        const msg = await r.json();
        setMessages(m => [...m, { ...msg, content_type: msg.content_type ?? 'text' }]);
      }
    } finally { setSending(false); }
  };

  const activeInstances = instances.filter(i => i.status === 'connected');

  const selectConv = (c: Conversation) => {
    setSelected(c);
    // Zero unread locally
    setConvs(prev => prev.map(x => x.id === c.id ? { ...x, unread_count: 0 } : x));
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Left: conversation list ── */}
      <div style={{ width: 320, borderRight: '1px solid #1e2820', display: 'flex', flexDirection: 'column', flexShrink: 0, background: '#060a07' }}>

        {/* Header */}
        <div style={{ padding: '16px 14px 0', borderBottom: '1px solid #1e2820' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f2' }}>Conversas</div>
              <div style={{ fontSize: 11, color: '#4b5a52', marginTop: 1 }}>
                {activeInstances.length} número{activeInstances.length !== 1 ? 's' : ''} online
              </div>
            </div>
            <button onClick={loadConvs} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a4a3e', padding: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 10, background: '#0d1410', borderRadius: 8, padding: 3 }}>
            {(['open','resolved'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: tab === t ? '#25D366' : 'transparent',
                color: tab === t ? '#fff' : '#4b5a52', transition: 'all 0.15s',
              }}>
                {t === 'open' ? 'Em aberto' : 'Resolvidos'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#3a4a3e', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              style={{ width: '100%', background: '#0d1410', border: '1px solid #1e2820', borderRadius: 8, padding: '6px 10px 6px 28px', color: '#e2e8e4', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Instance filter */}
          {instances.length > 1 && (
            <div style={{ display: 'flex', gap: 4, paddingBottom: 10, overflowX: 'auto' }}>
              <button onClick={() => setFilterInst('')} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: !filterInst ? '#25D366' : '#131a16', color: !filterInst ? '#fff' : '#6b7a72' }}>Todos</button>
              {instances.map(i => (
                <button key={i.id} onClick={() => setFilterInst(filterInst === i.id ? '' : i.id)} style={{
                  padding: '2px 8px', borderRadius: 20, fontSize: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: filterInst === i.id ? '#25D366' : '#131a16',
                  color: filterInst === i.id ? '#fff' : i.status === 'connected' ? '#4de08c' : '#6b7a72',
                }}>
                  {i.display_name || i.uazapi_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4b5a52', fontSize: 12 }}>Carregando...</div>
          ) : convs.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#4b5a52', fontSize: 12 }}>
              <div>Nenhuma conversa {tab === 'open' ? 'em aberto' : 'resolvida'}</div>
              <div style={{ marginTop: 6, fontSize: 11 }}>Mensagens recebidas aparecem aqui</div>
            </div>
          ) : (
            convs.map(c => {
              const isActive = selected?.id === c.id;
              const hasUnread = c.unread_count > 0 && !openedIds.has(c.id);
              return (
                <div key={c.id} onClick={() => selectConv(c)} style={{
                  padding: '11px 14px', cursor: 'pointer', borderBottom: '1px solid #0d1410',
                  background: isActive ? 'rgba(37,211,102,0.06)' : 'transparent',
                  borderLeft: isActive ? '2px solid #25D366' : '2px solid transparent',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: isActive ? 'rgba(37,211,102,0.15)' : '#131a16',
                      border: `1px solid ${isActive ? 'rgba(37,211,102,0.3)' : '#1e2820'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: isActive ? '#4de08c' : '#6b7a72', position: 'relative',
                    }}>
                      {initials(c.remote_name)}
                      {hasUnread && (
                        <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderRadius: '50%', background: '#25D366', border: '2px solid #060a07' }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: hasUnread ? 700 : 600, color: '#e2e8e4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.remote_name || c.remote_jid.replace('@s.whatsapp.net', '')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          {c.unread_count > 0 && !openedIds.has(c.id) && (
                            <span style={{ background: '#25D366', color: '#fff', borderRadius: 10, padding: '1px 5px', fontSize: 9, fontWeight: 700 }}>{c.unread_count}</span>
                          )}
                          <span style={{ fontSize: 10, color: '#3a4a3e' }}>{timeAgo(c.last_message_at)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2, gap: 4 }}>
                        <div style={{ fontSize: 11, color: '#4b5a52', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.last_direction === 'outbound' && <span style={{ color: '#25D366' }}>Você: </span>}
                          {c.last_message || '...'}
                        </div>
                        {instanceLabel(c) && (
                          <span style={{ fontSize: 9, color: '#2a3a2e', flexShrink: 0 }}>{instanceLabel(c)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right: chat panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#080c09' }}>
        {selected ? (
          <>
            {/* Chat header */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1e2820', display: 'flex', alignItems: 'center', gap: 10, background: '#060a07', flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4de08c', flexShrink: 0 }}>
                {initials(selected.remote_name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f2' }}>
                  {selected.remote_name || selected.remote_jid.replace('@s.whatsapp.net', '')}
                </div>
                <div style={{ fontSize: 10, color: '#4b5a52' }}>
                  {selected.remote_jid.replace('@s.whatsapp.net', '')}
                  {instanceLabel(selected) && ` · via ${instanceLabel(selected)}`}
                </div>
              </div>
              <a
                href={`https://wa.me/${selected.remote_jid.replace('@s.whatsapp.net','').replace('@g.us','')}`}
                target="_blank" rel="noreferrer"
                style={{ background: '#131a16', border: '1px solid #1e2820', borderRadius: 7, padding: '5px 12px', fontSize: 11, color: '#4de08c', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}
              >
                WA ↗
              </a>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {loadingMsgs && messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#4b5a52', fontSize: 12, padding: 40 }}>Carregando mensagens...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#4b5a52', fontSize: 12, padding: 40 }}>Nenhuma mensagem ainda</div>
              ) : (
                messages.map((msg, i) => {
                  const out = msg.direction === 'outbound';
                  const prevMsg = messages[i - 1];
                  const showDate = !prevMsg || new Date(msg.sent_at).toDateString() !== new Date(prevMsg.sent_at).toDateString();
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div style={{ textAlign: 'center', margin: '8px 0', fontSize: 10, color: '#3a4a3e' }}>
                          {new Date(msg.sent_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '72%', padding: '8px 12px', borderRadius: out ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          background: out ? 'rgba(37,211,102,0.13)' : '#131a16',
                          border: `1px solid ${out ? 'rgba(37,211,102,0.2)' : '#1e2820'}`,
                        }}>
                          <MessageContent msg={msg} />
                          <div style={{ fontSize: 10, color: out ? 'rgba(37,211,102,0.6)' : '#3a4a3e', marginTop: 4, textAlign: 'right' }}>
                            {new Date(msg.sent_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            {out && <span style={{ marginLeft: 4, color: '#25D366' }}>✓</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid #1e2820', background: '#060a07', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Mensagem... (Enter envia, Shift+Enter quebra linha)"
                rows={1}
                style={{
                  flex: 1, background: '#0d1410', border: '1px solid #1e2820', borderRadius: 10,
                  padding: '9px 12px', color: '#e2e8e4', fontSize: 13, outline: 'none',
                  resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxHeight: 100,
                }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
                }}
              />
              <button onClick={send} disabled={sending || !text.trim()} style={{
                width: 38, height: 38, borderRadius: 10, border: 'none', cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
                background: text.trim() && !sending ? '#25D366' : '#131a16',
                color: text.trim() && !sending ? '#fff' : '#3a4a3e',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
              }}>
                {sending ? (
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0d1410', border: '1px solid #1e2820', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2a3a2e" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4b5a52', marginBottom: 4 }}>Selecione uma conversa</div>
              <div style={{ fontSize: 12, color: '#2a3a2e' }}>Mensagens de texto, áudio, imagem e documentos</div>
            </div>
            {activeInstances.length === 0 && (
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 10, padding: '10px 18px', fontSize: 12, color: '#fcd34d', textAlign: 'center' }}>
                Nenhum número conectado —{' '}
                <a href="/config" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>conecte em Configurações</a>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
