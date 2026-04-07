import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentOverlay from './ContentOverlay';
import { GRAPH_ANIMATIONS } from './graphAnimations';

// ── Types ─────────────────────────────────────────────────────────────────────

interface JourneyNode {
  id: string;
  phase_id: string;
  title: string;
  description: string | null;
  content_type: 'task' | 'material' | 'presentation' | 'checkpoint' | 'quiz';
  content_url: string | null;
  content_body: string | null;
  estimated_minutes: number | null;
  sort_order: number;
  is_required: boolean;
  xp_reward: number;
  icon: string | null;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped';
  completed_at: string | null;
  started_at: string | null;
  submission_url: string | null;
  submission_note: string | null;
  mentor_feedback: string | null;
}

interface JourneyPhase {
  id: string;
  journey_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  icon: string | null;
  color: string | null;
  unlocked_at: string | null;
  completed_at: string | null;
  nodes: JourneyNode[];
}

interface StudentJourney {
  id: string;
  student_id: string;
  template_id: string | null;
  title: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  started_at: string;
  completed_at: string | null;
  total_xp: number;
  phases: JourneyPhase[];
}

interface JourneyExperienceProps {
  journey: StudentJourney;
  isAdmin: boolean;
}

// ── Extra keyframes for this component ────────────────────────────────────────

const LOCAL_ANIMATIONS = `
@keyframes progressRingIn {
  from { stroke-dashoffset: 226; }
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProgressNarrative(pct: number): string {
  if (pct === 0)   return 'Início da jornada';
  if (pct <= 10)   return 'Primeiros passos';
  if (pct <= 25)   return 'Ganhando momentum';
  if (pct <= 50)   return 'Metade do caminho';
  if (pct <= 75)   return 'Reta final';
  if (pct < 100)   return 'Quase lá';
  return 'Jornada concluída';
}

function calcJourneyProgress(phases: JourneyPhase[]): number {
  const allNodes = phases.flatMap((p) => p.nodes);
  if (allNodes.length === 0) return 0;
  const done = allNodes.filter((n) => n.status === 'completed' || n.status === 'skipped').length;
  return Math.round((done / allNodes.length) * 100);
}

function calcPhaseProgress(phase: JourneyPhase): number {
  if (phase.nodes.length === 0) return 0;
  const done = phase.nodes.filter((n) => n.status === 'completed' || n.status === 'skipped').length;
  return Math.round((done / phase.nodes.length) * 100);
}

function getContentTypeColor(type: string): string {
  const map: Record<string, string> = {
    task:         '#4A90FF',
    material:     '#22C55E',
    presentation: '#8B5CF6',
    checkpoint:   '#F59E0B',
    quiz:         '#EC4899',
  };
  return map[type] ?? '#4A90FF';
}

function getContentTypeLabel(type: string): string {
  const map: Record<string, string> = {
    task:         'Tarefa',
    material:     'Material',
    presentation: 'Apresentação',
    checkpoint:   'Checkpoint',
    quiz:         'Quiz',
  };
  return map[type] ?? type;
}

function getPhaseStatusColor(status: JourneyPhase['status']): string {
  if (status === 'completed')   return '#22C55E';
  if (status === 'in_progress') return '#4A90FF';
  if (status === 'available')   return 'rgba(255,255,255,0.55)';
  return 'rgba(255,255,255,0.15)';
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calcPace(phases: JourneyPhase[], startedAt: string): string {
  const allNodes = phases.flatMap((p) => p.nodes);
  const done = allNodes.filter((n) => n.status === 'completed' || n.status === 'skipped').length;
  if (done === 0) return '0/dia';
  const days = Math.max(1, Math.round((Date.now() - new Date(startedAt).getTime()) / 86400000));
  return `${(done / days).toFixed(1)}/dia`;
}

// ── Inject styles once ────────────────────────────────────────────────────────

function useStyles() {
  useEffect(() => {
    const id = 'journey-experience-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = GRAPH_ANIMATIONS + LOCAL_ANIMATIONS;
      document.head.appendChild(el);
    }
  }, []);
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function TaskIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MaterialIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5 7h6M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function PresentationIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 11v3M5 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CheckpointIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 2l2 1v9l-2 1M5 3l5 2v9l-5-2M10 5l3-2v9l-3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuizIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 6.5C6.5 5.7 7.1 5 8 5c.9 0 1.5.7 1.5 1.5 0 1-1.5 1.5-1.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.7" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon(): React.ReactElement {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon(): React.ReactElement {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Background Atmosphere ─────────────────────────────────────────────────────

function BackgroundAtmosphere(): React.ReactElement {
  const stars = Array.from({ length: 25 }, (_, i) => ({
    left: `${(i * 137) % 100}%`,
    top:  `${(i * 97)  % 100}%`,
    opacity: 0.03 + ((i * 31) % 4) * 0.01,
  }));

  return (
    <>
      {/* Radial glow */}
      <div
        style={{
          position:    'fixed',
          inset:       0,
          background:  'radial-gradient(ellipse at 40% 30%, rgba(74,144,255,0.015) 0%, #020206 65%)',
          pointerEvents: 'none',
          zIndex:      0,
        }}
      />

      {/* Star dust */}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position:    'fixed',
            left:        s.left,
            top:         s.top,
            width:       '1px',
            height:      '1px',
            background:  '#fff',
            opacity:     s.opacity,
            pointerEvents: 'none',
            zIndex:      0,
          }}
        />
      ))}

      {/* Scanline micro-texture */}
      <div
        style={{
          position:   'fixed',
          inset:      0,
          background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(255,255,255,0.004) 2px, rgba(255,255,255,0.004) 3px)',
          pointerEvents: 'none',
          zIndex:     0,
        }}
      />

      {/* HUD corner brackets */}
      <svg
        style={{ position: 'fixed', top: 62, left: 8, pointerEvents: 'none', zIndex: 1 }}
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <path d="M1 7V1H7" stroke="rgba(74,144,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg
        style={{ position: 'fixed', top: 62, right: 8, pointerEvents: 'none', zIndex: 1 }}
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <path d="M15 7V1H9" stroke="rgba(74,144,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg
        style={{ position: 'fixed', bottom: 40, left: 8, pointerEvents: 'none', zIndex: 1 }}
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <path d="M1 9v6h6" stroke="rgba(74,144,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg
        style={{ position: 'fixed', bottom: 40, right: 8, pointerEvents: 'none', zIndex: 1 }}
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <path d="M15 9v6h-6" stroke="rgba(74,144,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </>
  );
}

// ── Status Dot ────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: JourneyPhase['status'] }): React.ReactElement {
  const isActive = status === 'in_progress';
  const color = getPhaseStatusColor(status);

  if (status === 'completed') {
    return (
      <div
        style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#22C55E', flexShrink: 0,
        }}
      />
    );
  }

  if (isActive) {
    return (
      <div style={{ position: 'relative', width: '6px', height: '6px', flexShrink: 0 }}>
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: '#4A90FF',
            animation: 'dotPulse 2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: '-4px', borderRadius: '50%',
            border: '1px solid rgba(74,144,255,0.3)',
            animation: 'ringPulse 2s ease-out infinite',
          }}
        />
      </div>
    );
  }

  if (status === 'available') {
    return (
      <div
        style={{
          width: '6px', height: '6px', borderRadius: '50%',
          border: `1px solid ${color}`, background: 'transparent', flexShrink: 0,
        }}
      />
    );
  }

  // locked
  return (
    <div
      style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)', flexShrink: 0,
      }}
    />
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({ percent }: { percent: number }): React.ReactElement {
  const r = 30;
  const circumference = 2 * Math.PI * r; // ~188.5
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: '72px', height: '72px' }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="36" cy="36" r={r}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3"
            fill="none"
          />
          {/* Fill */}
          <circle
            cx="36" cy="36" r={r}
            stroke="#4A90FF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out',
            }}
          />
        </svg>
        {/* Center label */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            display:       'flex',
            alignItems:    'center',
            justifyContent: 'center',
            fontSize:      '16px',
            fontWeight:    700,
            color:         '#4A90FF',
            textShadow:    '0 0 12px rgba(74,144,255,0.4)',
          }}
        >
          {percent}%
        </div>
      </div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Progresso Geral
      </div>
    </div>
  );
}

// ── Node Card Icon ────────────────────────────────────────────────────────────

function NodeTypeIcon({ type }: { type: JourneyNode['content_type'] }): React.ReactElement {
  if (type === 'task')         return <TaskIcon />;
  if (type === 'material')     return <MaterialIcon />;
  if (type === 'presentation') return <PresentationIcon />;
  if (type === 'checkpoint')   return <CheckpointIcon />;
  if (type === 'quiz')         return <QuizIcon />;
  return <TaskIcon />;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function JourneyExperience({
  journey: initialJourney,
  isAdmin,
}: JourneyExperienceProps): React.ReactElement {
  useStyles();

  // ── State ────────────────────────────────────────────────────────────────

  const [journey, setJourney]           = useState<StudentJourney>(initialJourney);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);
  const [overlayOpen, setOverlayOpen]   = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  // hover handled via DOM directly — no state to avoid re-renders

  // ── Auto-select first non-locked phase on mount ───────────────────────────

  useEffect(() => {
    const phases = journey.phases;
    const active    = phases.find((p) => p.status === 'in_progress');
    const available = phases.find((p) => p.status === 'available');
    const completed = phases.find((p) => p.status === 'completed');
    const first = active ?? available ?? completed ?? (isAdmin ? phases[0] : null);
    if (first) setSelectedPhaseId(first.id);
  }, []);

  // ── Responsive ───────────────────────────────────────────────────────────

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────

  const allNodes     = journey.phases.flatMap((p) => p.nodes);
  const totalNodes   = allNodes.length;
  const doneNodes    = allNodes.filter((n) => n.status === 'completed' || n.status === 'skipped').length;
  const totalXp      = journey.phases.flatMap((p) => p.nodes).filter((n) => n.status === 'completed').reduce((s, n) => s + n.xp_reward, 0);
  const progressPct  = calcJourneyProgress(journey.phases);
  const selectedPhase = journey.phases.find((p) => p.id === selectedPhaseId) ?? null;

  // ── API Handlers ─────────────────────────────────────────────────────────

  const refetchJourney = useCallback(async () => {
    try {
      const res = await fetch(`/api/journeys/student/${journey.id}`);
      if (res.ok) {
        const data = await res.json();
        setJourney(data.journey ?? data);
      }
    } catch {}
  }, [journey.id]);

  function handleNodeClick(node: JourneyNode, e: React.MouseEvent) {
    e.stopPropagation();
    if (node.status === 'locked' && !isAdmin) return;
    setSelectedNode(node);
    setOverlayOpen(true);
  }

  function handleNodeUpdate(updatedNode: JourneyNode) {
    setJourney((prev) => ({
      ...prev,
      phases: prev.phases.map((phase) => ({
        ...phase,
        nodes: phase.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)),
      })),
    }));
    refetchJourney();
  }

  function handleCloseOverlay() {
    setOverlayOpen(false);
    setTimeout(() => setSelectedNode(null), 250);
  }

  async function handleUnlockPhase(phaseId: string) {
    try {
      await fetch(`/api/journeys/student/${journey.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'unlock_phase', phase_id: phaseId }),
      });
      refetchJourney();
    } catch {}
  }

  // ── Divider ──────────────────────────────────────────────────────────────

  function Divider({ margin = '16px 0' }: { margin?: string }) {
    return (
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin }} />
    );
  }

  // ── LEFT PANEL ───────────────────────────────────────────────────────────

  function LeftPanel(): React.ReactElement {
    const totalPhases   = journey.phases.length;
    const completedPhases = journey.phases.filter((p) => p.status === 'completed').length;

    return (
      <div
        className="journey-scrollbar"
        style={{
          width:       '210px',
          flexShrink:  0,
          background:  '#08080E',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflowY:   'auto',
          padding:     '20px 0',
          display:     'flex',
          flexDirection: 'column',
          position:    'relative',
          zIndex:      2,
        }}
      >
        {/* Section label */}
        <div
          style={{
            padding:       '0 18px',
            marginBottom:  '14px',
            fontSize:      '9px',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.28)',
          }}
        >
          Fases
        </div>

        {/* Phase list */}
        <div style={{ flex: 1 }}>
          {journey.phases.map((phase) => {
            const isSelected = phase.id === selectedPhaseId;
            const isLocked   = phase.status === 'locked';
            const phasePct   = calcPhaseProgress(phase);
            const doneCount  = phase.nodes.filter((n) => n.status === 'completed' || n.status === 'skipped').length;
            const titleColor = isSelected
              ? '#ffffff'
              : phase.status === 'completed'
              ? 'rgba(255,255,255,0.6)'
              : isLocked
              ? 'rgba(255,255,255,0.28)'
              : 'rgba(255,255,255,0.75)';

            return (
              <div
                key={phase.id}
                onClick={() => (!isLocked || isAdmin) && setSelectedPhaseId(phase.id)}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.015)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = isSelected ? 'rgba(74,144,255,0.04)' : 'transparent';
                }}
                style={{
                  padding:     '10px 18px',
                  cursor:      isLocked && !isAdmin ? 'default' : 'pointer',
                  borderLeft:  `2px solid ${isSelected ? '#4A90FF' : 'transparent'}`,
                  background:  isSelected ? 'rgba(74,144,255,0.04)' : 'transparent',
                  transition:  'all 150ms',
                }}
              >
                {/* Row 1: dot + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusDot status={phase.status} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: titleColor, lineHeight: 1.3 }}>
                    {phase.title}
                  </span>
                </div>

                {/* Row 2: progress */}
                <div style={{ marginTop: '5px', paddingLeft: '14px' }}>
                  {isLocked ? (
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <LockIcon /> Bloqueada
                    </span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>
                        {doneCount}/{phase.nodes.length}
                      </span>
                      <div style={{ width: '50px', height: '2px', borderRadius: '1px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width:  `${phasePct}%`,
                            background: phase.status === 'completed' ? '#22C55E' : '#4A90FF',
                            borderRadius: '1px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom progress section */}
        <div>
          <Divider margin="16px 0 14px" />
          <div style={{ padding: '0 18px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>
              Progresso
            </div>
            <div
              style={{
                fontSize:   '24px',
                fontWeight: 700,
                color:      '#4A90FF',
                textShadow: '0 0 16px rgba(74,144,255,0.35)',
                lineHeight:  1,
                marginBottom: '8px',
              }}
            >
              {progressPct}%
            </div>
            <div style={{ width: '100%', height: '2px', borderRadius: '1px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '8px' }}>
              <div
                style={{
                  height:     '100%',
                  width:      `${progressPct}%`,
                  background: '#4A90FF',
                  borderRadius: '1px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>
              {doneNodes} de {totalNodes} itens
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CENTER PANEL ─────────────────────────────────────────────────────────

  function CenterPanel(): React.ReactElement {
    if (!selectedPhase) {
      return (
        <div
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.2)', fontSize: '13px',
          }}
        >
          Selecione uma fase
        </div>
      );
    }

    const phaseIndex   = journey.phases.findIndex((p) => p.id === selectedPhase.id);
    const statusColor  = getPhaseStatusColor(selectedPhase.status);
    const phasePct     = calcPhaseProgress(selectedPhase);
    const doneCount    = selectedPhase.nodes.filter((n) => n.status === 'completed' || n.status === 'skipped').length;
    const totalMinutes = selectedPhase.nodes.reduce((s, n) => s + (n.estimated_minutes ?? 0), 0);
    const doneXp       = selectedPhase.nodes.filter((n) => n.status === 'completed').reduce((s, n) => s + n.xp_reward, 0);
    const totalXpPhase = selectedPhase.nodes.reduce((s, n) => s + n.xp_reward, 0);

    return (
      <div
        className="journey-scrollbar"
        style={{
          flex:      1,
          overflowY: 'auto',
          padding:   '24px 28px',
          background: 'transparent',
          position:  'relative',
          zIndex:    2,
        }}
      >
        {/* Phase Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            {/* Badge */}
            <div
              style={{
                width:      '40px',
                height:     '40px',
                borderRadius: '50%',
                border:     `2px solid ${statusColor}`,
                boxShadow:  `0 0 16px ${statusColor}25`,
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: `${statusColor}08`,
                fontSize:   '14px',
                fontWeight: 700,
                color:      statusColor,
              }}
            >
              {selectedPhase.status === 'completed' ? <CheckIcon size={16} /> : String(phaseIndex + 1)}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0, flex: 1 }}>
              {selectedPhase.title}
            </h2>

            {/* Status pill */}
            <div style={{ flexShrink: 0 }}>
              {selectedPhase.status === 'completed' && (
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }}>
                  Concluida
                </span>
              )}
              {selectedPhase.status === 'in_progress' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: 'rgba(74,144,255,0.08)', color: '#4A90FF', border: '1px solid rgba(74,144,255,0.15)' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4A90FF', animation: 'dotPulse 1.8s ease-in-out infinite', display: 'inline-block' }} />
                  Em progresso
                </span>
              )}
              {selectedPhase.status === 'available' && (
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Disponivel
                </span>
              )}
              {selectedPhase.status === 'locked' && (
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  Bloqueada
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {selectedPhase.description && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: '0 0 12px 0', paddingLeft: '54px' }}>
              {selectedPhase.description}
            </p>
          )}

          {/* Progress bar */}
          <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden', marginBottom: '10px' }}>
            <div
              style={{
                height:     '100%',
                width:      `${phasePct}%`,
                background: selectedPhase.status === 'completed' ? '#22C55E' : '#4A90FF',
                borderRadius: '1px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>
            <span>{doneCount}/{selectedPhase.nodes.length} concluídos</span>
            <span>·</span>
            <span>{doneXp}/{totalXpPhase} XP</span>
            {totalMinutes > 0 && (
              <>
                <span>·</span>
                <span>~{totalMinutes} min</span>
              </>
            )}
          </div>
        </div>

        <Divider margin="20px 0" />

        {/* Node Cards */}
        <div>
          {selectedPhase.nodes.length === 0 && (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', padding: '20px 0' }}>
              Nenhum item nesta fase.
            </div>
          )}

          {selectedPhase.nodes.map((node, nodeIndex) => {
            const isLocked     = node.status === 'locked';
            const isCompleted  = node.status === 'completed';
            const isActive     = node.status === 'in_progress' || node.status === 'available';
            const isClickable  = !isLocked || isAdmin;
            const typeColor    = getContentTypeColor(node.content_type);
            const typeLabel    = getContentTypeLabel(node.content_type);
            let borderLeft = '3px solid transparent';
            let cardBg     = 'rgba(14,14,22,0.85)';
            let cardShadow = 'none';

            if (isCompleted) {
              borderLeft = '3px solid #22C55E';
              cardBg     = 'rgba(34,197,94,0.02)';
            } else if (isActive) {
              borderLeft = `3px solid #4A90FF`;
              cardShadow = '0 0 0 1px rgba(74,144,255,0.06)';
            }

            let detailText = '';
            if (isCompleted)              detailText = 'Concluido';
            else if (isLocked)            detailText = 'Bloqueado';
            else if (node.mentor_feedback) detailText = 'Feedback disponível';
            else if (node.estimated_minutes) detailText = `~${node.estimated_minutes} min`;
            else                          detailText = '';

            return (
              <div
                key={node.id}
                onClick={(e) => handleNodeClick(node, e)}
                onMouseEnter={(e) => {
                  if (isLocked && !isAdmin) return;
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-1px)';
                  el.style.borderColor = 'rgba(255,255,255,0.09)';
                  el.style.background = 'rgba(20,20,30,0.90)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'none';
                  el.style.borderColor = 'rgba(255,255,255,0.05)';
                  el.style.background = cardBg;
                }}
                style={{
                  background:    cardBg,
                  backdropFilter: 'blur(4px)',
                  border:        '1px solid rgba(255,255,255,0.05)',
                  borderLeft:    borderLeft,
                  borderRadius:  '12px',
                  padding:       '16px 18px',
                  marginBottom:  '6px',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '14px',
                  cursor:        isClickable ? 'pointer' : 'default',
                  opacity:       isLocked && !isAdmin ? 0.22 : isLocked && isAdmin ? 0.55 : 1,
                  transition:    'transform 180ms ease, border-color 180ms ease, background 180ms ease',
                  position:      'relative',
                  overflow:      'hidden',
                  boxShadow:     cardShadow,
                }}
              >
                {/* Glass shimmer line */}
                <div
                  style={{
                    position:   'absolute',
                    top:        0,
                    left:       0,
                    right:      0,
                    height:     '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Room number badge */}
                <div
                  style={{
                    position:      'absolute',
                    top:           '6px',
                    right:         '10px',
                    fontSize:      '8px',
                    fontWeight:    700,
                    letterSpacing: '0.10em',
                    color:         'rgba(255,255,255,0.15)',
                  }}
                >
                  {phaseIndex + 1}.{nodeIndex + 1}
                </div>

                {/* Icon container */}
                <div
                  style={{
                    width:      '30px',
                    height:     '30px',
                    borderRadius: '8px',
                    background: `${typeColor}12`,
                    border:     `1px solid ${typeColor}20`,
                    display:    'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color:      typeColor,
                    flexShrink: 0,
                  }}
                >
                  <NodeTypeIcon type={node.content_type} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Type label row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span
                      style={{
                        fontSize:      '9px',
                        fontWeight:    600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color:         `${typeColor}b3`,
                      }}
                    >
                      {typeLabel}
                    </span>
                    {node.is_required && (
                      <span style={{ fontSize: '9px', color: 'rgba(255,100,100,0.65)', background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.12)', borderRadius: '4px', padding: '1px 5px' }}>
                        Obrigatorio
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize:  '14px',
                      fontWeight: 500,
                      color:     isLocked ? 'rgba(255,255,255,0.28)' : isCompleted ? 'rgba(34,197,94,0.8)' : '#fff',
                      whiteSpace: 'nowrap',
                      overflow:  'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {node.title}
                  </div>

                  {/* Detail */}
                  {detailText && (
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                      {detailText}
                    </div>
                  )}
                </div>

                {/* Right: XP + chevron */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span
                    style={{
                      fontSize:   '11px',
                      fontWeight: 600,
                      color:      '#F59E0B',
                      textShadow: '0 0 8px rgba(245,158,11,0.3)',
                    }}
                  >
                    +{node.xp_reward}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>
                    <ChevronIcon />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unlock button for admins on locked phases */}
        {isAdmin && selectedPhase.status === 'locked' && (
          <button
            onClick={() => handleUnlockPhase(selectedPhase.id)}
            style={{
              marginTop:    '16px',
              padding:      '10px 20px',
              borderRadius: '8px',
              background:   'rgba(74,144,255,0.10)',
              border:       '1px solid rgba(74,144,255,0.20)',
              color:        '#4A90FF',
              fontSize:     '13px',
              fontWeight:   600,
              cursor:       'pointer',
            }}
          >
            Desbloquear Fase (Admin)
          </button>
        )}
      </div>
    );
  }

  // ── RIGHT PANEL ──────────────────────────────────────────────────────────

  function RightPanel(): React.ReactElement {
    const totalPhases     = journey.phases.length;
    const completedPhases = journey.phases.filter((p) => p.status === 'completed').length;
    const streak = 3; // placeholder — would come from API
    const pace   = calcPace(journey.phases, journey.started_at);

    const startDate    = formatDate(journey.started_at);
    const daysElapsed  = Math.round((Date.now() - new Date(journey.started_at).getTime()) / 86400000);
    const daysEstimate = totalNodes > 0 ? Math.round((totalNodes / Math.max(1, doneNodes)) * daysElapsed) : 30;
    const estEnd       = new Date(new Date(journey.started_at).getTime() + daysEstimate * 86400000);
    const estEndStr    = estEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    const activityLog = [
      { time: '12:04', text: 'Material concluído', xp: '+15 XP' },
      { time: '11:47', text: 'Tarefa enviada',     xp: '+25 XP' },
      { time: '10:30', text: 'Fase 1 concluída',   xp: '+50 XP' },
      { time: 'Ontem', text: 'Quiz completado',    xp: '+20 XP' },
      { time: 'Ontem', text: 'Material concluído', xp: '+15 XP' },
    ];

    return (
      <div
        className="journey-scrollbar"
        style={{
          width:       '250px',
          flexShrink:  0,
          background:  '#08080E',
          borderLeft:  '1px solid rgba(255,255,255,0.05)',
          overflowY:   'auto',
          padding:     '20px 18px',
          position:    'relative',
          zIndex:      2,
        }}
      >
        {/* Progress Ring */}
        <ProgressRing percent={progressPct} />

        <Divider margin="18px 0" />

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '4px' }}>
          {[
            { label: 'XP Total',   value: totalXp,             color: '#F59E0B', shadow: '0 0 8px rgba(245,158,11,0.25)' },
            { label: 'Nodes',      value: `${doneNodes}/${totalNodes}`, color: '#fff',     shadow: 'none' },
            { label: 'Streak',     value: `${streak} dias`,    color: '#22C55E', shadow: '0 0 8px rgba(34,197,94,0.2)' },
            { label: 'Ritmo',      value: pace,                color: '#fff',     shadow: 'none' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background:   'rgba(255,255,255,0.015)',
                borderRadius: '8px',
                padding:      '12px',
                border:       '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  fontSize:   '15px',
                  fontWeight: 700,
                  color:      stat.color,
                  textShadow: stat.shadow,
                  lineHeight: 1,
                  marginBottom: '5px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.25)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <Divider margin="18px 0" />

        {/* Activity Log */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '10px' }}>
            Atividade
          </div>
          {activityLog.map((entry, i) => (
            <div
              key={i}
              style={{
                display:       'flex',
                alignItems:    'flex-start',
                gap:           '8px',
                marginBottom:  '7px',
                fontSize:      '10px',
              }}
            >
              <span style={{ color: 'rgba(74,144,255,0.6)', flexShrink: 0, minWidth: '36px' }}>
                {entry.time}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', flex: 1 }}>
                {entry.text}
              </span>
              <span style={{ color: 'rgba(245,158,11,0.5)', flexShrink: 0 }}>
                {entry.xp}
              </span>
            </div>
          ))}
        </div>

        <Divider margin="18px 0" />

        {/* Journey info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>
            Inicio: <span style={{ color: 'rgba(255,255,255,0.45)' }}>{startDate}</span>
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>
            Previsão: <span style={{ color: 'rgba(255,255,255,0.45)' }}>~{estEndStr}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── MOBILE PHASE PILLS ───────────────────────────────────────────────────

  function MobilePhasePills(): React.ReactElement {
    return (
      <div
        className="journey-scrollbar"
        style={{
          display:         'flex',
          overflowX:       'auto',
          gap:             '8px',
          padding:         '10px 16px',
          background:      '#08080E',
          borderBottom:    '1px solid rgba(255,255,255,0.05)',
          flexShrink:      0,
          height:          '48px',
          alignItems:      'center',
        }}
      >
        {journey.phases.map((phase) => {
          const isSelected = phase.id === selectedPhaseId;
          const isLocked   = phase.status === 'locked';
          return (
            <div
              key={phase.id}
              onClick={() => (!isLocked || isAdmin) && setSelectedPhaseId(phase.id)}
              style={{
                padding:     '4px 12px',
                borderRadius: '20px',
                fontSize:    '11px',
                fontWeight:  isSelected ? 600 : 400,
                cursor:      isLocked ? 'default' : 'pointer',
                whiteSpace:  'nowrap',
                flexShrink:  0,
                background:  isSelected ? 'rgba(74,144,255,0.12)' : 'rgba(255,255,255,0.04)',
                color:       isSelected ? '#4A90FF' : isLocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                border:      `1px solid ${isSelected ? 'rgba(74,144,255,0.25)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {phase.title}
            </div>
          );
        })}
      </div>
    );
  }

  // ── MOBILE COMPACT STATS ─────────────────────────────────────────────────

  function MobileCompactStats(): React.ReactElement {
    return (
      <div
        style={{
          display:     'flex',
          gap:         '16px',
          padding:     '10px 16px',
          background:  '#08080E',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink:  0,
          alignItems:  'center',
        }}
      >
        <span style={{ fontSize: '11px', color: '#4A90FF', fontWeight: 700, textShadow: '0 0 10px rgba(74,144,255,0.3)' }}>
          {progressPct}%
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
          {doneNodes}/{totalNodes} nodes
        </span>
        <span style={{ fontSize: '11px', color: '#F59E0B' }}>
          {totalXp} XP
        </span>
      </div>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position:  'relative',
        height:    'calc(100vh - 56px)',
        display:   'flex',
        flexDirection: 'column',
        background: '#020206',
        overflow:  'hidden',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Background atmosphere — desktop only for performance */}
      {!isMobile && <BackgroundAtmosphere />}

      {/* Secondary top bar */}
      <div
        style={{
          background:   'rgba(8,8,14,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding:      '0 24px',
          height:       '48px',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
          flexShrink:   0,
          position:     'relative',
          zIndex:       3,
        }}
      >
        {/* Left: title */}
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? '55%' : '40%' }}>
          {journey.title}
        </div>

        {/* Center: narrative (desktop only) */}
        {!isMobile && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
            {getProgressNarrative(progressPct)}
          </div>
        )}

        {/* Right: XP */}
        <div
          style={{
            fontSize:   '13px',
            fontWeight: 700,
            color:      '#4A90FF',
            textShadow: '0 0 12px rgba(74,144,255,0.4)',
          }}
        >
          {totalXp} XP
        </div>
      </div>

      {/* Body: flex row (desktop) or column (mobile) */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <MobilePhasePills />
          <MobileCompactStats />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 2 }}>
            <CenterPanel />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', zIndex: 2 }}>
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>
      )}

      {/* Bottom bar (desktop only) */}
      {!isMobile && (
        <div
          style={{
            height:         '34px',
            flexShrink:     0,
            background:     '#08080E',
            borderTop:      '1px solid rgba(255,255,255,0.05)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '24px',
            position:       'relative',
            zIndex:         3,
          }}
        >
          {[
            `Fase ${journey.phases.findIndex((p) => p.status === 'in_progress') + 1 || journey.phases.filter((p) => p.status !== 'locked').length}/${journey.phases.length}`,
            journey.status === 'active' ? 'Ativo' : journey.status,
            `${doneNodes} concluídos`,
            `${totalXp} XP`,
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.12)' }}>·</span>
              )}
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {i === 1 && journey.status === 'active' && (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                )}
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Content overlay */}
      <ContentOverlay
        node={selectedNode}
        isOpen={overlayOpen}
        isAdmin={isAdmin}
        journeyId={journey.id}
        isMobile={isMobile}
        onClose={handleCloseOverlay}
        onNodeUpdate={handleNodeUpdate}
      />
    </div>
  );
}
