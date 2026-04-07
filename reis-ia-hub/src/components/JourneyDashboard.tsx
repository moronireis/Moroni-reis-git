import React, { useState } from 'react';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface JourneyNode {
  id: string;
  status: string;
  is_required: boolean;
}

interface JourneyPhase {
  id: string;
  title: string;
  sort_order: number;
  status: string;
  nodes: JourneyNode[];
}

interface Journey {
  id: string;
  title: string;
  status: string;
  total_xp: number;
  started_at: string;
  student?: { id: string; full_name: string; email: string };
  phases: JourneyPhase[];
}

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
}

interface JourneyDashboardProps {
  journeys: Journey[];
  isAdmin: boolean;
  students?: StudentProfile[];
  currentUserId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeProgress(phases: JourneyPhase[]): number {
  let total = 0;
  let done = 0;
  for (const phase of phases) {
    for (const node of phase.nodes) {
      if (node.is_required) {
        total += 1;
        if (node.status === 'completed') done += 1;
      }
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function getCurrentPhaseName(phases: JourneyPhase[]): string {
  const active = phases.find(p => p.status === 'in_progress' || p.status === 'available');
  return active ? active.title : '—';
}

function statusBadgeStyle(status: string): React.CSSProperties {
  if (status === 'completed') {
    return { background: 'rgba(34,197,94,0.12)', color: '#22C55E' };
  }
  if (status === 'paused' || status === 'pausada') {
    return { background: 'rgba(245,158,11,0.12)', color: '#F59E0B' };
  }
  // active / ativa / default
  return { background: 'rgba(34,197,94,0.12)', color: '#22C55E' };
}

function statusBadgeLabel(status: string): string {
  if (status === 'completed' || status === 'concluida') return 'Concluida';
  if (status === 'paused' || status === 'pausada') return 'Pausada';
  return 'Ativa';
}

function phaseCircleStyle(phaseStatus: string): React.CSSProperties {
  const base: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    flexShrink: 0,
    border: '1px solid',
    transition: 'all 200ms',
  };
  if (phaseStatus === 'completed') {
    return { ...base, background: 'rgba(34,197,94,0.12)', borderColor: '#22C55E', color: '#22C55E' };
  }
  if (phaseStatus === 'in_progress') {
    return { ...base, background: 'rgba(74,144,255,0.15)', borderColor: '#4A90FF', color: '#4A90FF' };
  }
  if (phaseStatus === 'available') {
    return { ...base, background: 'rgba(74,144,255,0.08)', borderColor: 'rgba(74,144,255,0.25)', color: '#4A90FF' };
  }
  // locked
  return { ...base, background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.20)' };
}

function connectorColor(fromStatus: string, toStatus: string): string {
  if (fromStatus === 'completed' && toStatus === 'completed') return '#22C55E';
  if (fromStatus === 'completed') return '#4A90FF';
  return 'rgba(255,255,255,0.08)';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline
        points="2,6.5 4.8,9.2 10,3"
        stroke="#22C55E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A90FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function PhaseStrip({ phases }: { phases: JourneyPhase[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '4px' }}>
      {phases.map((phase, idx) => (
        <React.Fragment key={phase.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={phaseCircleStyle(phase.status)}>
              {phase.status === 'completed' ? <CheckIcon /> : idx + 1}
            </div>
            <span style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.40)',
              maxWidth: '50px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}>
              {phase.title}
            </span>
          </div>

          {idx < phases.length - 1 && (
            <div style={{
              height: '1px',
              width: '20px',
              flexShrink: 0,
              background: connectorColor(phase.status, phases[idx + 1].status),
              marginTop: '13px',
              alignSelf: 'flex-start',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{
        fontSize: '10px',
        fontWeight: 500,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.30)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '16px',
        fontWeight: 600,
        color: '#fff',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '120px',
      }}>
        {value}
      </span>
    </div>
  );
}

function JourneyCard({ journey, isAdmin }: { journey: Journey; isAdmin: boolean }) {
  const [hover, setHover] = useState(false);
  const progress = computeProgress(journey.phases);
  const currentPhase = getCurrentPhaseName(journey.phases);

  const cardStyle: React.CSSProperties = {
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '20px',
  };

  const headerStyle: React.CSSProperties = {
    height: 'auto',
    minHeight: '100px',
    background: 'linear-gradient(135deg, #0A0A0A 0%, rgba(74,144,255,0.12) 50%, #0A0A0A 100%)',
    padding: '24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    fontSize: '10px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '9999px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    ...statusBadgeStyle(journey.status),
  };

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    background: '#4A90FF',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center' as const,
    textDecoration: 'none',
    transition: 'opacity 200ms',
    opacity: hover ? 0.85 : 1,
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={cardStyle}>
      {/* Card Header */}
      <div style={headerStyle}>
        <span style={badgeStyle}>{statusBadgeLabel(journey.status)}</span>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          {journey.title}
        </div>
        {isAdmin && journey.student && (
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.50)', marginTop: '4px' }}>
            {journey.student.full_name}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '24px' }}>
        {/* Phase Strip */}
        {journey.phases.length > 0 && (
          <PhaseStrip phases={journey.phases} />
        )}

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap' as const,
          marginTop: '16px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <StatBlock label="Progresso" value={`${progress}%`} />
          <StatBlock label="XP Total" value={String(journey.total_xp)} />
          <StatBlock label="Fase Atual" value={currentPhase} />
        </div>

        {/* Action Button */}
        <a
          href={`/journey/${journey.id}`}
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Abrir Jornada
        </a>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(74,144,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <MapIcon />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>
          Nenhuma jornada ativa
        </p>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.40)', margin: 0, maxWidth: '280px' }}>
          Sua jornada sera criada apos sua primeira sessao com o mentor.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JourneyDashboard({ journeys: initialJourneys, isAdmin }: JourneyDashboardProps) {
  return (
    <div style={{ padding: '16px 0', maxWidth: '800px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: '0 0 6px 0' }}>
          Journey
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.50)', margin: 0 }}>
          Sua jornada personalizada de aprendizado em IA.
        </p>
      </div>

      {/* Content */}
      {initialJourneys.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {initialJourneys.map(journey => (
            <JourneyCard key={journey.id} journey={journey} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
