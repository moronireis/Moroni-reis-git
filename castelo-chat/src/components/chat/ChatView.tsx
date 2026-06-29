import { useState, useEffect, useCallback } from 'react';
import type { Contact, Message } from '../../lib/types';
import { ContactList } from './ContactList';
import { MessageThread } from './MessageThread';
import { ContactDetail } from './ContactDetail';

const ALL_PAGE_SIZE = 200;

export function ChatView() {
  const [conversations, setConversations] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [allOffset, setAllOffset] = useState(0);
  const [hasMoreAll, setHasMoreAll] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts?mode=conversations');
      if (res.ok) setConversations(await res.json());
    } catch {
      // silent — polling will retry
    }
  }, []);

  const fetchAllContacts = useCallback(async (offset = 0, append = false) => {
    setLoadingAll(true);
    try {
      const res = await fetch(`/api/contacts?mode=all&limit=${ALL_PAGE_SIZE}&offset=${offset}`);
      if (res.ok) {
        const data: Contact[] = await res.json();
        setAllContacts(prev => append ? [...prev, ...data] : data);
        setAllOffset(offset + data.length);
        setHasMoreAll(data.length === ALL_PAGE_SIZE);
      }
    } catch {
      // silent — polling will retry
    } finally {
      setLoadingAll(false);
    }
  }, []);

  const fetchMessages = useCallback(async (contactId: string) => {
    try {
      const res = await fetch(`/api/messages?contact_id=${contactId}`);
      if (res.ok) setMessages(await res.json());
    } catch {
      // silent — polling will retry
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchAllContacts(0, false);
    const id = setInterval(fetchConversations, 10000);
    return () => clearInterval(id);
  }, [fetchConversations, fetchAllContacts]);

  useEffect(() => {
    if (!selectedContact) return;
    fetchMessages(selectedContact.id);
    const id = setInterval(() => fetchMessages(selectedContact.id), 3000);
    return () => clearInterval(id);
  }, [selectedContact, fetchMessages]);

  const handleSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages([]);
    fetchMessages(contact.id);
  };

  const handleContactUpdate = (updated: Contact) => {
    setSelectedContact(updated);
    setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
    setAllContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleLoadMoreAll = () => {
    if (!loadingAll && hasMoreAll) fetchAllContacts(allOffset, true);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <ContactList
        contacts={conversations}
        allContacts={allContacts}
        loadingAll={loadingAll}
        hasMoreAll={hasMoreAll}
        onLoadMoreAll={handleLoadMoreAll}
        selectedId={selectedContact?.id || null}
        onSelect={handleSelect}
        onRefresh={() => { fetchConversations(); fetchAllContacts(0, false); }}
      />

      {/* Middle: thread */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {selectedContact ? (
          <>
            {/* Thread header */}
            <div style={{
              padding: '0.65rem 1rem', borderBottom: '1px solid var(--gold-dim)',
              background: '#162019', display: 'flex', alignItems: 'center', gap: '0.75rem',
              flexShrink: 0,
            }}>
              {(() => {
                const label = selectedContact.name || selectedContact.push_name || selectedContact.phone;
                const initial = label.trim().slice(0, 1).toUpperCase();
                const colors = ['#2D6A4F','#1B4332','#40916C','#52796F','#354F52','#2F3E46','#3A5A40','#588157'];
                let hash = 0;
                for (let i = 0; i < selectedContact.phone.length; i++) hash = (hash * 31 + selectedContact.phone.charCodeAt(i)) >>> 0;
                const bg = colors[hash % colors.length];
                return (
                  <>
                    <div style={{ width: 36, height: 36, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {selectedContact.photo_url
                        ? <img src={selectedContact.photo_url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        : <span style={{ color: 'rgba(244,239,230,0.9)', fontSize: '0.85rem', fontWeight: 600 }}>{initial}</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--cream-dim)' }}>
                        {selectedContact.phone} · Número {selectedContact.instance_id === 'castelo1' ? '1 — (11) 9.5590-6035' : '2 — (11) 9.5590-1227'}
                      </div>
                    </div>
                    {selectedContact.lead_stage && (
                      <div style={{
                        fontSize: '0.65rem', letterSpacing: '0.06em',
                        padding: '0.2rem 0.5rem',
                        border: '1px solid rgba(201,169,110,0.35)',
                        color: 'var(--gold)', flexShrink: 0,
                        textTransform: 'uppercase',
                      }}>
                        {selectedContact.lead_stage.replace('_', ' ')}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <MessageThread
              messages={messages}
              contactId={selectedContact.id}
              onSent={() => { fetchMessages(selectedContact.id); fetchConversations(); }}
            />
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: 'var(--cream-dim)' }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            <p style={{ fontSize: '0.85rem' }}>Selecione uma conversa</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(244,239,230,0.35)' }}>
              {conversations.length > 0 ? `${conversations.length} conversa${conversations.length > 1 ? 's' : ''}` : 'Aguardando mensagens'}
            </p>
          </div>
        )}
      </div>

      {/* Right: CRM detail panel */}
      {selectedContact && (
        <ContactDetail
          contact={selectedContact}
          onUpdate={handleContactUpdate}
        />
      )}
    </div>
  );
}
