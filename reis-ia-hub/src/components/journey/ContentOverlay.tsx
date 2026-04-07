import React, { useState, useEffect, useCallback } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import SlideRenderer from './SlideRenderer';
import QuizRenderer from './QuizRenderer';

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
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped';
  completed_at: string | null;
  started_at: string | null;
  submission_url: string | null;
  submission_note: string | null;
  mentor_feedback: string | null;
}

interface ContentOverlayProps {
  node: JourneyNode | null;
  isOpen: boolean;
  isAdmin: boolean;
  journeyId: string;
  isMobile: boolean;
  onClose: () => void;
  onNodeUpdate: (updatedNode: JourneyNode) => void;
}

// ── Config ────────────────────────────────────────────────────────────────────

const CONTENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  task:         { label: 'Tarefa',         color: '#4A90FF' },
  material:     { label: 'Material',       color: '#22C55E' },
  presentation: { label: 'Apresentação',   color: '#8B5CF6' },
  checkpoint:   { label: 'Checkpoint',     color: '#F59E0B' },
  quiz:         { label: 'Quiz',           color: '#EC4899' },
};

// ── Keyframe CSS (injected once) ──────────────────────────────────────────────

const ANIMATION_STYLES = `
@keyframes backdropFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes overlayFadeIn {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
@keyframes overlayFadeOut {
  from { opacity: 1; transform: scale(1)    translateY(0);   }
  to   { opacity: 0; transform: scale(0.96) translateY(8px); }
}
`;

function useAnimationStyles() {
  useEffect(() => {
    const id = 'content-overlay-animations';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = ANIMATION_STYLES;
      document.head.appendChild(style);
    }
  }, []);
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function CloseIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContentOverlay({
  node,
  isOpen,
  isAdmin,
  journeyId,
  isMobile,
  onClose,
  onNodeUpdate,
}: ContentOverlayProps): React.ReactElement | null {
  useAnimationStyles();

  const [submissionUrl, setSubmissionUrl]     = useState('');
  const [submissionNote, setSubmissionNote]   = useState('');
  const [feedbackText, setFeedbackText]       = useState('');
  const [loading, setLoading]                 = useState(false);
  const [closing, setClosing]                 = useState(false);

  // Sync submission fields when node changes
  useEffect(() => {
    if (node) {
      setSubmissionUrl(node.submission_url ?? '');
      setSubmissionNote(node.submission_note ?? '');
      setFeedbackText(node.mentor_feedback ?? '');
    }
  }, [node?.id]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  if (!isOpen || !node) return null;

  const typeConfig = CONTENT_TYPE_CONFIG[node.content_type] ?? { label: node.content_type, color: '#4A90FF' };
  const typeColor  = typeConfig.color;
  const isCompleted = node.status === 'completed';
  const isLocked    = node.status === 'locked';

  // ── API Handlers ──────────────────────────────────────────────────────────

  async function handleComplete() {
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        action:          'update_node',
        node_id:         node!.id,
        status:          'completed',
        submission_url:  submissionUrl  || undefined,
        submission_note: submissionNote || undefined,
      };
      const res = await fetch(`/api/journeys/student/${journeyId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        onNodeUpdate(data.node ?? { ...node!, status: 'completed' });
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback() {
    setLoading(true);
    try {
      const res = await fetch(`/api/journeys/student/${journeyId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          action:          'update_node',
          node_id:         node!.id,
          mentor_feedback: feedbackText,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onNodeUpdate(data.node ?? { ...node!, mentor_feedback: feedbackText });
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Shared Styles ─────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width:        '100%',
    padding:      '10px 14px',
    borderRadius: '8px',
    background:   '#161616',
    border:       '1px solid rgba(255,255,255,0.08)',
    color:        '#fff',
    fontSize:     '14px',
    outline:      'none',
    boxSizing:    'border-box',
  };

  const primaryButtonStyle: React.CSSProperties = {
    width:        '100%',
    padding:      '12px 24px',
    borderRadius: '10px',
    background:   typeColor,
    color:        '#fff',
    fontSize:     '14px',
    fontWeight:   600,
    border:       'none',
    cursor:       loading ? 'wait' : 'pointer',
    opacity:      loading ? 0.6 : 1,
    transition:   'opacity 200ms',
  };

  // ── Action Buttons ────────────────────────────────────────────────────────

  function renderActions(): React.ReactElement | null {
    if (isCompleted) {
      return (
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '8px',
            padding:        '12px 16px',
            borderRadius:   '10px',
            background:     'rgba(34,197,94,0.08)',
            border:         '1px solid rgba(34,197,94,0.20)',
            color:          '#22C55E',
            fontSize:       '14px',
            fontWeight:     600,
          }}
        >
          <CheckIcon />
          <span>Concluído</span>
        </div>
      );
    }

    if (isLocked) return null;

    const { content_type } = node!;
    const canSubmit = submissionNote.trim().length >= 10;

    const labelStyle: React.CSSProperties = {
      display:       'block',
      fontSize:      '12px',
      color:         'rgba(255,255,255,0.40)',
      marginBottom:  '6px',
      fontWeight:    500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    };

    const notePrompt: Record<string, string> = {
      material:     'Escreva o que aprendeu de mais importante neste material...',
      presentation: 'Escreva o principal aprendizado desta apresentação...',
      task:         'Descreva o que você fez e o resultado...',
      quiz:         'Escreva o que aprendeu com este quiz...',
      checkpoint:   'Notas sobre este checkpoint...',
    };

    // Checkpoint: student leaves feedback and continues
    if (content_type === 'checkpoint' && !isAdmin) {
      const canSubmitCheckpoint = submissionNote.trim().length >= 10;
      return (
        <div style={{ background: '#111111', borderRadius: '10px', padding: '16px', marginTop: '20px' }}>
          <div style={{
            padding: '12px 14px', borderRadius: '8px', marginBottom: '16px',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)',
          }}>
            <p style={{ fontSize: '13px', color: '#F59E0B', margin: 0 }}>
              Deixe seu feedback sobre esta etapa. O mentor vai receber e acompanhar seu progresso.
            </p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Seu feedback *</label>
            <textarea rows={4} placeholder="Como foi até aqui? Dúvidas, dificuldades, conquistas..."
              value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }} />
            {!canSubmitCheckpoint && submissionNote.length > 0 && (
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>Mínimo 10 caracteres</p>
            )}
          </div>
          <button onClick={handleComplete}
            style={{
              ...primaryButtonStyle, background: canSubmitCheckpoint ? '#F59E0B' : 'rgba(255,255,255,0.08)',
              color: canSubmitCheckpoint ? '#fff' : 'rgba(255,255,255,0.25)',
              cursor: canSubmitCheckpoint && !loading ? 'pointer' : 'not-allowed',
            }} disabled={!canSubmitCheckpoint || loading}>
            {loading ? 'Enviando...' : 'Enviar Feedback e Continuar'}
          </button>
        </div>
      );
    }

    if (content_type === 'checkpoint' && isAdmin) {
      return (
        <div style={{ background: '#111111', borderRadius: '10px', padding: '16px', marginTop: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Notas do mentor</label>
            <textarea rows={3} placeholder="Feedback sobre o checkpoint..." value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button onClick={handleComplete}
            style={{ ...primaryButtonStyle, background: '#F59E0B' }} disabled={loading}>
            {loading ? 'Salvando...' : 'Aprovar Checkpoint'}
          </button>
        </div>
      );
    }

    // All other types: require written reflection before completing
    return (
      <div style={{ background: '#111111', borderRadius: '10px', padding: '16px', marginTop: '20px' }}>
        {content_type === 'task' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Link de entrega (opcional)</label>
            <input type="url" placeholder="https://..." value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)} style={inputStyle} />
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>
            O que você aprendeu nesta etapa? *
          </label>
          <textarea rows={3} placeholder={notePrompt[content_type] || 'Descreva o que aprendeu...'}
            value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }} />
          {!canSubmit && submissionNote.length > 0 && (
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              Mínimo 10 caracteres
            </p>
          )}
        </div>

        <button onClick={handleComplete}
          style={{
            ...primaryButtonStyle,
            background: canSubmit ? typeColor : 'rgba(255,255,255,0.08)',
            color: canSubmit ? '#fff' : 'rgba(255,255,255,0.25)',
            cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
          }}
          disabled={!canSubmit || loading}>
          {loading ? 'Salvando...' : 'Marcar como Concluído'}
        </button>
      </div>
    );
  }

  // ── Read-only submission display (if completed) ───────────────────────────

  function renderCompletedSubmission(): React.ReactElement | null {
    const hasUrl  = isCompleted && node!.submission_url;
    const hasNote = isCompleted && node!.submission_note;
    if (!hasUrl && !hasNote) return null;

    return (
      <div
        style={{
          background:   '#111111',
          borderRadius: '10px',
          padding:      '16px',
          marginTop:    '20px',
          border:       '1px solid rgba(34,197,94,0.12)',
        }}
      >
        {hasUrl && (
          <div style={{ marginBottom: hasNote ? '12px' : 0 }}>
            <div
              style={{
                fontSize:     '11px',
                color:        'rgba(255,255,255,0.35)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Entrega
            </div>
            <a
              href={node!.submission_url!}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: typeColor, fontSize: '13px', wordBreak: 'break-all' }}
            >
              {node!.submission_url}
            </a>
          </div>
        )}
        {hasNote && (
          <div>
            <div
              style={{
                fontSize:     '11px',
                color:        'rgba(255,255,255,0.35)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Observacoes
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: 0 }}>
              {node!.submission_note}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      onClick={handleClose}
      style={{
        position:        'fixed',
        inset:           0,
        background:      'rgba(0,0,0,0.80)',
        backdropFilter:  'blur(8px)',
        zIndex:          100,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         isMobile ? '0' : '40px 16px',
        animation:       'backdropFadeIn 0.2s ease',
      }}
    >
      {/* Card — stop propagation so clicks inside don't close overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position:     'relative',
          width:        isMobile ? '100vw' : '720px',
          maxHeight:    isMobile ? '100vh' : 'calc(100vh - 80px)',
          background:   '#0A0A0A',
          borderRadius: isMobile ? '0' : '16px',
          border:       '1px solid rgba(255,255,255,0.08)',
          overflowY:    'auto',
          boxShadow:    '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(74,144,255,0.08)',
          animation:    closing ? 'overlayFadeOut 0.2s ease-out' : 'overlayFadeIn 0.25s ease-out',
          display:      'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Fechar"
          style={{
            position:       'absolute',
            top:            '16px',
            right:          '16px',
            width:          '32px',
            height:         '32px',
            borderRadius:   '50%',
            background:     'rgba(255,255,255,0.05)',
            border:         '1px solid rgba(255,255,255,0.08)',
            color:          'rgba(255,255,255,0.50)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            zIndex:         1,
            padding:        0,
            transition:     'background 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
          }}
        >
          <CloseIcon />
        </button>

        {/* ── Header ── */}
        <div
          style={{
            background:   `linear-gradient(135deg, ${typeColor}15 0%, transparent 60%)`,
            padding:      '32px 32px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Type badge */}
          <span
            style={{
              fontSize:      '10px',
              fontWeight:    600,
              padding:       '3px 10px',
              borderRadius:  '9999px',
              background:    `${typeColor}18`,
              color:         typeColor,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display:       'inline-block',
            }}
          >
            {typeConfig.label}
          </span>

          {/* Title */}
          <h2
            style={{
              fontSize:   '22px',
              fontWeight: 700,
              color:      '#fff',
              marginTop:  '12px',
              lineHeight: 1.3,
              margin:     '12px 0 0 0',
            }}
          >
            {node.title}
          </h2>

          {/* Description */}
          {node.description && (
            <p
              style={{
                fontSize:   '14px',
                color:      'rgba(255,255,255,0.50)',
                marginTop:  '8px',
                lineHeight: 1.6,
                margin:     '8px 0 0 0',
              }}
            >
              {node.description}
            </p>
          )}

          {/* Meta row */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              flexWrap:   'wrap',
              gap:        '12px',
              marginTop:  '16px',
            }}
          >
            {/* XP badge */}
            <span
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '4px',
                fontSize:     '12px',
                fontWeight:   600,
                color:        '#F59E0B',
                background:   'rgba(245,158,11,0.10)',
                border:       '1px solid rgba(245,158,11,0.20)',
                borderRadius: '6px',
                padding:      '3px 8px',
              }}
            >
              <StarIcon />
              {node.xp_reward} XP
            </span>

            {/* Time estimate */}
            {node.estimated_minutes && (
              <span
                style={{
                  display:    'inline-flex',
                  alignItems: 'center',
                  gap:        '4px',
                  fontSize:   '12px',
                  color:      'rgba(255,255,255,0.40)',
                }}
              >
                <ClockIcon />
                {node.estimated_minutes} min
              </span>
            )}

            {/* Required indicator */}
            {node.is_required && (
              <span
                style={{
                  fontSize:     '11px',
                  fontWeight:   500,
                  color:        'rgba(255,100,100,0.80)',
                  background:   'rgba(255,100,100,0.08)',
                  border:       '1px solid rgba(255,100,100,0.15)',
                  borderRadius: '6px',
                  padding:      '3px 8px',
                }}
              >
                Obrigatório
              </span>
            )}

            {/* Completed check */}
            {isCompleted && (
              <span
                style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          '4px',
                  fontSize:     '12px',
                  fontWeight:   600,
                  color:        '#22C55E',
                  background:   'rgba(34,197,94,0.08)',
                  border:       '1px solid rgba(34,197,94,0.20)',
                  borderRadius: '6px',
                  padding:      '3px 8px',
                }}
              >
                <CheckIcon />
                Concluído
              </span>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '32px', flex: 1 }}>
          {/* External link button */}
          {node.content_url && node.content_type !== 'presentation' && (
            <a
              href={node.content_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '8px',
                padding:        '10px 20px',
                borderRadius:   '8px',
                background:     `${typeColor}15`,
                border:         `1px solid ${typeColor}30`,
                color:          typeColor,
                fontSize:       '13px',
                fontWeight:     500,
                textDecoration: 'none',
                marginBottom:   '20px',
              }}
            >
              Abrir recurso
              <ArrowIcon />
            </a>
          )}

          {/* Presentation embed */}
          {node.content_type === 'presentation' && node.content_url && (
            <div
              style={{
                borderRadius: '12px',
                overflow:     'hidden',
                marginBottom: '20px',
                border:       '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <iframe
                src={node.content_url}
                style={{
                  width:       '100%',
                  aspectRatio: '16/9',
                  border:      'none',
                  display:     'block',
                }}
                allowFullScreen
              />
            </div>
          )}

          {/* Checkpoint callout */}
          {node.content_type === 'checkpoint' && (
            <div
              style={{
                background:   'rgba(245,158,11,0.06)',
                border:       '1px solid rgba(245,158,11,0.15)',
                borderRadius: '8px',
                padding:      '14px 16px',
                marginBottom: '20px',
              }}
            >
              <p style={{ color: '#F59E0B', fontSize: '13px', margin: 0 }}>
                Este checkpoint sera validado pelo mentor.
              </p>
            </div>
          )}

          {/* Content body — slides for presentations, quiz for quizzes, markdown for others */}
          {node.content_body && (
            node.content_type === 'quiz'
              ? <QuizRenderer content={node.content_body} accentColor={typeColor} />
              : node.content_type === 'presentation' || node.content_body.trimStart().startsWith('<!-- slides -->')
                ? <SlideRenderer content={node.content_body.replace('<!-- slides -->', '')} accentColor={typeColor} />
                : <MarkdownRenderer content={node.content_body} accentColor={typeColor} />
          )}

          {/* Mentor feedback (read) */}
          {node.mentor_feedback && (
            <div
              style={{
                background:   'rgba(74,144,255,0.04)',
                borderLeft:   '3px solid #4A90FF',
                borderRadius: '0 8px 8px 0',
                padding:      '16px',
                marginTop:    '20px',
              }}
            >
              <div
                style={{
                  fontSize:      '11px',
                  color:         '#4A90FF',
                  fontWeight:    600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom:  '8px',
                }}
              >
                Feedback do Mentor
              </div>
              <p
                style={{
                  fontSize:   '14px',
                  color:      'rgba(255,255,255,0.70)',
                  lineHeight: 1.6,
                  margin:     0,
                }}
              >
                {node.mentor_feedback}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer / Actions ── */}
        <div style={{ padding: '0 32px 32px' }}>
          {renderCompletedSubmission()}
          {renderActions()}

          {/* Admin feedback form */}
          {isAdmin && !isLocked && (
            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              <label
                style={{
                  display:       'block',
                  fontSize:      '11px',
                  color:         '#4A90FF',
                  fontWeight:    600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom:  '8px',
                }}
              >
                Feedback do Mentor
              </label>
              <textarea
                rows={3}
                placeholder="Escreva seu feedback para o aluno..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }}
              />
              <button
                onClick={handleFeedback}
                disabled={loading || !feedbackText.trim()}
                style={{
                  padding:      '10px 20px',
                  borderRadius: '8px',
                  background:   'rgba(74,144,255,0.12)',
                  border:       '1px solid rgba(74,144,255,0.25)',
                  color:        '#4A90FF',
                  fontSize:     '13px',
                  fontWeight:   600,
                  cursor:       loading || !feedbackText.trim() ? 'default' : 'pointer',
                  opacity:      loading || !feedbackText.trim() ? 0.5 : 1,
                  transition:   'opacity 200ms',
                }}
              >
                {loading ? 'Salvando...' : 'Salvar Feedback'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
