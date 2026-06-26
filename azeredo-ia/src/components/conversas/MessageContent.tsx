import AudioPlayer from './AudioPlayer';

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

interface Props {
  msg: Message;
}

export default function MessageContent({ msg }: Props) {
  const out  = msg.direction === 'outbound';
  const src  = msg.media_url ?? null;
  const mime = msg.media_mime ?? null;
  const body = msg.body ?? '';

  switch (msg.content_type) {
    case 'image':
      return (
        <div>
          {src ? (
            <a href={src} target="_blank" rel="noreferrer">
              <img
                src={src}
                alt="imagem"
                style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, display: 'block', cursor: 'pointer' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </a>
          ) : (
            <div style={{ fontSize: 12, color: '#6b7a72', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Imagem indisponível
            </div>
          )}
          {body && body !== 'image' && (
            <div style={{ fontSize: 13, color: out ? '#e2e8e4' : '#c9d5cc', marginTop: 6, lineHeight: 1.5 }}>{body}</div>
          )}
        </div>
      );

    case 'audio':
      return <AudioPlayer src={src} mime={mime} outbound={out} />;

    case 'sticker':
      return src ? (
        <img src={src} alt="sticker" style={{ maxWidth: 120, maxHeight: 120, display: 'block' }} />
      ) : (
        <span style={{ fontSize: 12, color: '#6b7a72' }}>Sticker</span>
      );

    case 'video':
      return (
        <div>
          {src ? (
            <video
              controls
              style={{ maxWidth: 240, maxHeight: 180, borderRadius: 8, display: 'block', background: '#000' }}
              onError={() => {}}
            >
              <source src={src} type={mime ?? 'video/mp4'} />
              <a href={src} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontSize: 12 }}>Abrir vídeo</a>
            </video>
          ) : (
            <div style={{ fontSize: 12, color: '#6b7a72', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              Vídeo indisponível
            </div>
          )}
          {body && body !== 'video' && (
            <div style={{ fontSize: 13, color: out ? '#e2e8e4' : '#c9d5cc', marginTop: 6 }}>{body}</div>
          )}
        </div>
      );

    case 'document':
      return (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: out ? 'rgba(37,211,102,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${out ? 'rgba(37,211,102,0.15)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 10, padding: '10px 14px', maxWidth: 240,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={out ? '#4de08c' : '#6b7a72'} strokeWidth="1.5" strokeLinecap="round">
            {mime === 'application/pdf'
              ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></>
              : <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>
            }
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: out ? '#e2e8e4' : '#c9d5cc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {body || 'Documento'}
            </div>
            <div style={{ fontSize: 10, color: '#4b5a52', marginTop: 2 }}>{mime ?? 'arquivo'}</div>
          </div>
          {src && (
            <a href={src} target="_blank" rel="noreferrer" style={{ color: '#25D366', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          )}
        </div>
      );

    default: // text
      return (
        <div style={{ fontSize: 13, color: out ? '#e2e8e4' : '#c9d5cc', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {body || ''}
        </div>
      );
  }
}
