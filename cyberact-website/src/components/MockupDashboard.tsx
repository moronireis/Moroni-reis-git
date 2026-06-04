import { useState, useEffect } from 'react';

/** Suporte Avançado Mockup - Operations Dashboard with all 7 service items */
export function SuporteMockup() {
  const [activeItem, setActiveItem] = useState(0);
  const [pulse, setPulse] = useState(false);

  const items = [
    { icon: '◉', label: 'Monitoramento de ativos', status: 'ATIVO', statusColor: '#4ade80', detail: '47 dispositivos online' },
    { icon: '◈', label: 'Prevenção de problemas', status: 'SCAN OK', statusColor: '#4ade80', detail: '0 alertas pendentes' },
    { icon: '☁', label: 'Backups implementados', status: 'RUNNING', statusColor: '#60a5fa', detail: 'Snapshot #847 — 73%' },
    { icon: '▣', label: 'Servidores de dados', status: 'ONLINE', statusColor: '#4ade80', detail: 'CPU 23% • RAM 45%' },
    { icon: '⊞', label: 'Máquinas reservas', status: '2 PRONTAS', statusColor: '#fbbf24', detail: 'Standby no local' },
    { icon: '⇄', label: 'Negociação fornecedores', status: 'EM DIA', statusColor: '#4ade80', detail: '3 contratos ativos' },
    { icon: '↗', label: 'Melhorias contínuas', status: 'PLANEJADO', statusColor: '#a78bfa', detail: 'Upgrade rede Q2/2026' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem(prev => (prev + 1) % items.length);
      setPulse(p => !p);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#111111',
      border: '1px solid #2a2a2a',
      padding: 'clamp(0.75rem, 3vw, 1.5rem)',
      fontFamily: "'Inter', sans-serif",
      fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: pulse ? '#4ade80' : '#22c55e', transition: 'all 0.5s', boxShadow: pulse ? '0 0 8px rgba(74,222,128,0.5)' : 'none' }} />
          <span style={{ color: '#a0a0a0', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.6rem' }}>CyberAct Operations</span>
        </div>
        <span style={{ color: '#4a4a4a', fontSize: '0.55rem' }}>LIVE</span>
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 0.75rem',
              background: i === activeItem ? 'rgba(230,57,70,0.05)' : '#0a0a0a',
              border: `1px solid ${i === activeItem ? 'rgba(230,57,70,0.25)' : '#1a1a1a'}`,
              transition: 'all 0.4s ease',
            }}
          >
            <span style={{ fontSize: '0.7rem', width: '1rem', textAlign: 'center', color: i === activeItem ? '#e63946' : '#4a4a4a' }}>{item.icon}</span>
            <span style={{ flex: 1, color: i === activeItem ? '#ffffff' : '#a0a0a0', fontWeight: i === activeItem ? 500 : 400, fontSize: '0.7rem', transition: 'color 0.3s' }}>{item.label}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 600, color: item.statusColor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.status}</div>
              <div style={{ fontSize: '0.5rem', color: '#4a4a4a', marginTop: '1px' }}>{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Backup progress bar */}
      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(96,165,250,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.55rem' }}>Backup cloud em andamento</span>
          <span style={{ color: '#a0a0a0', fontSize: '0.65rem' }}>73%</span>
        </div>
        <div style={{ height: 3, background: '#1a1a1a', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '73%', background: '#60a5fa', animation: 'pulse 2s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  );
}

/** Segurança Mockup - Security Dashboard */
export function SegurancaMockup() {
  const [blocked, setBlocked] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocked(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#111111',
      border: '1px solid #2a2a2a',
      padding: 'clamp(0.75rem, 3vw, 1.5rem)',
      fontFamily: "'Inter', monospace",
      fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #2a2a2a' }}>
        <span style={{ color: '#a0a0a0', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>CyberAct Shield</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.4)' }} />
          <span style={{ color: '#4ade80', fontSize: '0.6rem' }}>ATIVO</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem', background: '#0a0a0a', border: '1px solid #1a1a1a', textAlign: 'center' }}>
          <div style={{ color: '#e63946', fontSize: '1.25rem', fontWeight: 300 }}>{blocked.toLocaleString()}</div>
          <div style={{ color: '#4a4a4a', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Ameaças bloqueadas</div>
        </div>
        <div style={{ padding: '0.75rem', background: '#0a0a0a', border: '1px solid #1a1a1a', textAlign: 'center' }}>
          <div style={{ color: '#4ade80', fontSize: '1.25rem', fontWeight: 300 }}>100%</div>
          <div style={{ color: '#4a4a4a', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Uptime</div>
        </div>
      </div>

      {/* Firewall log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {[
          { time: '14:32:01', action: 'BLOQUEADO', target: 'site-malicioso.ru', color: '#e63946' },
          { time: '14:31:58', action: 'VPN OK', target: 'filial-02.local', color: '#4ade80' },
          { time: '14:31:45', action: 'BLOQUEADO', target: 'download-suspeito.xyz', color: '#e63946' },
          { time: '14:31:30', action: 'BACKUP', target: 'snapshot-diario #847', color: '#60a5fa' },
          { time: '14:31:12', action: 'BLOQUEADO', target: 'phishing-email.cn', color: '#e63946' },
        ].map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.3rem 0', fontSize: '0.65rem' }}>
            <span style={{ color: '#4a4a4a', fontFamily: 'monospace' }}>{log.time}</span>
            <span style={{ color: log.color, fontWeight: 500, width: '5rem', textTransform: 'uppercase', fontSize: '0.6rem' }}>{log.action}</span>
            <span style={{ color: '#a0a0a0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Monitoramento Mockup - AI Camera Grid + Event Log */
export function MonitoramentoMockup() {
  const [activeAlert, setActiveAlert] = useState(false);
  const [logTime, setLogTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlert(a => !a);
      setLogTime(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const cameras = [
    { id: 'CAM-01', location: 'Entrada Principal', status: 'rec' },
    { id: 'CAM-02', location: 'Estacionamento', status: activeAlert ? 'alert' : 'rec' },
    { id: 'CAM-03', location: 'Recepção', status: 'rec' },
    { id: 'CAM-04', location: 'Corredor B2', status: 'rec' },
  ];

  const events = [
    { time: `14:3${logTime % 10}`, entity: 'Pessoa detectada', cam: 'Câm 02', type: 'alert' as const },
    { time: '14:18', entity: 'Veículo — sem alerta', cam: 'Câm 01', type: 'ok' as const },
    { time: '14:05', entity: 'Animal ignorado', cam: 'Câm 03', type: 'skip' as const },
  ];

  const badgeStyle = (type: 'alert' | 'ok' | 'skip') => ({
    alert: { background: 'rgba(230,57,70,0.15)', color: '#e63946' },
    ok:    { background: 'rgba(74,222,128,0.1)',  color: '#4ade80' },
    skip:  { background: 'rgba(160,160,160,0.1)', color: '#555555' },
  })[type];

  return (
    <div style={{
      background: '#111111',
      border: '1px solid #2a2a2a',
      padding: 'clamp(0.75rem, 3vw, 1.5rem)',
      fontFamily: "'Inter', monospace",
      fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #2a2a2a' }}>
        <span style={{ color: '#a0a0a0', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.65rem' }}>CyberAct CFTV — IA Ativa</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#e63946', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <span style={{ color: '#e63946', fontSize: '0.6rem' }}>REC</span>
        </div>
      </div>

      {/* Camera grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        {cameras.map((cam) => (
          <div key={cam.id} style={{
            background: '#0a0a0a',
            border: `1px solid ${cam.status === 'alert' ? '#e63946' : '#1a1a1a'}`,
            padding: '0.75rem',
            transition: 'all 0.5s',
            boxShadow: cam.status === 'alert' ? '0 0 15px rgba(230,57,70,0.15)' : 'none',
          }}>
            <div style={{ height: '2.5rem', background: '#0f0f0f', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'rgba(230,57,70,0.3)', animation: 'scanline 3s linear infinite' }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cam.status === 'alert' ? '#e63946' : '#2a2a2a'} strokeWidth="1">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#ffffff', fontSize: '0.6rem', fontWeight: 500 }}>{cam.id}</div>
                <div style={{ color: '#4a4a4a', fontSize: '0.5rem' }}>{cam.location}</div>
              </div>
              {cam.status === 'alert' && (
                <span style={{ color: '#e63946', fontSize: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>ALERTA</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Event Log */}
      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ color: '#4a4a4a', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Log IA — Tempo Real</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {events.map((ev, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem' }}>
              <span style={{ color: '#4a4a4a', width: '2.5rem', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
              <span style={{ flex: 1, color: '#a0a0a0' }}>{ev.entity} — {ev.cam}</span>
              <span style={{ ...badgeStyle(ev.type), padding: '1px 5px', fontSize: '0.5rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {ev.type === 'alert' ? 'Confirmado' : ev.type === 'ok' ? 'Sem alerta' : 'Ignorado'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4a4a4a', fontSize: '0.6rem', borderTop: '1px solid #2a2a2a', paddingTop: '0.5rem' }}>
        <span style={{ color: '#4ade80' }}>47 câmeras online</span>
        <span>0 alertas ativos</span>
      </div>
    </div>
  );
}
