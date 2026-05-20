import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = 'unlinked' | 'attention' | 'urgent' | 'done';
type OwnerType = 'client' | 'moroni';
type CalendarView = 'day' | 'week' | 'month';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner_type: OwnerType;
  assigned_to?: string;
  assigned_name?: string;
  created_by: string;
  scheduled_date?: string;
  scheduled_time?: string;
  duration_minutes?: number;
  position: number;
  project_id?: string;
  project_name?: string;
  created_at: string;
  updated_at?: string;
}

interface TaskManagerProps {
  initialTasks: Task[];
  isAdmin: boolean;
  userId: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, { color: string; bg: string; label: string }> = {
  unlinked:  { color: '#6B7280', bg: 'rgba(107,114,128,0.12)', label: 'Sem vinculação' },
  attention: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Atenção' },
  urgent:    { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  label: 'Urgente' },
  done:      { color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  label: 'Feito' },
};

const OWNER_CONFIG: Record<OwnerType, { color: string; bg: string; label: string }> = {
  client: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', label: 'Cliente' },
  moroni: { color: '#4A90FF', bg: 'rgba(74,144,255,0.12)',  label: 'Moroni' },
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 - 21:00

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDate(s: string): Date {
  const dateOnly = s.includes('T') ? s.split('T')[0] : s;
  return new Date(dateOnly + 'T00:00:00');
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getWeekDays(date: Date): Date[] {
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));
  return cells;
}

function formatTime(t: string): string {
  return t.substring(0, 5);
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

// ── SVG Icons ────────────────────────────────────────────────────────────────

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ── Status Dot ───────────────────────────────────────────────────────────────

function StatusDot({ status, size = 8 }: { status: TaskStatus; size?: number }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: cfg.color, flexShrink: 0,
      boxShadow: `0 0 ${size}px ${cfg.color}44`,
    }} />
  );
}

// ── Task Card (used in calendar cells) ───────────────────────────────────────

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onClick: () => void;
  onDragStart: () => void;
}

function TaskCard({ task, compact, onClick, onDragStart }: TaskCardProps) {
  const statusCfg = STATUS_CONFIG[task.status];
  const ownerCfg = OWNER_CONFIG[task.owner_type];

  if (compact) {
    return (
      <div
        draggable
        onDragStart={(e) => { e.stopPropagation(); onDragStart(); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        style={{
          padding: '2px 6px',
          borderRadius: '4px',
          background: statusCfg.bg,
          borderLeft: `3px solid ${statusCfg.color}`,
          fontSize: '10px',
          color: statusCfg.color,
          cursor: 'grab',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'opacity 100ms',
        }}
        title={task.title}
      >
        {task.scheduled_time ? `${formatTime(task.scheduled_time)} ` : ''}{task.title}
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); onDragStart(); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        padding: '10px 12px',
        borderRadius: '8px',
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `3px solid ${statusCfg.color}`,
        cursor: 'grab',
        transition: 'border-color 150ms, box-shadow 150ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.12)';
        (e.currentTarget).style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.06)';
        (e.currentTarget).style.boxShadow = 'none';
      }}
    >
      {/* Top: owner badge + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{
          fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
          background: ownerCfg.bg, color: ownerCfg.color,
        }}>
          {ownerCfg.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <StatusDot status={task.status} size={6} />
          <span style={{ fontSize: '10px', color: statusCfg.color }}>{statusCfg.label}</span>
        </div>
      </div>

      {/* Title */}
      <p style={{
        fontSize: '13px', color: '#fff', fontWeight: 400,
        lineHeight: 1.4, margin: 0,
        overflow: 'hidden', textOverflow: 'ellipsis',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
      }}>
        {task.title}
      </p>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
        {task.scheduled_time && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            <ClockIcon /> {formatTime(task.scheduled_time)}
            {task.duration_minutes ? ` (${task.duration_minutes}min)` : ''}
          </span>
        )}
        {task.project_name && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            {task.project_name}
          </span>
        )}
        {task.assigned_name && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            {task.assigned_name}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Task Modal ───────────────────────────────────────────────────────────────

interface TaskModalProps {
  mode: 'create' | 'edit';
  formData: Partial<Task>;
  isAdmin: boolean;
  onChange: (field: keyof Task, value: unknown) => void;
  onSave: () => void;
  onDelete?: () => void;
  onClose: () => void;
  loading: boolean;
}

function TaskModal({ mode, formData, isAdmin, onChange, onSave, onDelete, onClose, loading }: TaskModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', display: 'block',
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer', appearance: 'none' as const };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
            {mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Titulo *</label>
            <input
              autoFocus
              value={(formData.title as string) || ''}
              onChange={e => onChange('title', e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) onSave(); }}
              placeholder="O que precisa ser feito..."
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Descrição</label>
            <textarea
              value={(formData.description as string) || ''}
              onChange={e => onChange('description', e.target.value)}
              placeholder="Detalhes opcionais..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />
          </div>

          {/* Row: Owner Type + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Responsabilidade</label>
              <select
                value={(formData.owner_type as string) || 'client'}
                onChange={e => onChange('owner_type', e.target.value)}
                style={selectStyle}
                disabled={!isAdmin}
              >
                <option value="client">Tarefa do Cliente</option>
                <option value="moroni">Tarefa do Moroni</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const isActive = formData.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => onChange('status', s)}
                      style={{
                        flex: 1, padding: '8px 4px', borderRadius: '6px',
                        background: isActive ? cfg.bg : 'transparent',
                        border: isActive ? `1px solid ${cfg.color}44` : '1px solid rgba(255,255,255,0.06)',
                        color: isActive ? cfg.color : 'rgba(255,255,255,0.3)',
                        fontSize: '10px', cursor: 'pointer', textAlign: 'center',
                        transition: 'all 150ms',
                      }}
                      title={cfg.label}
                    >
                      <StatusDot status={s} size={8} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row: Date + Time + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Data</label>
              <input
                type="date"
                value={(formData.scheduled_date as string) || ''}
                onChange={e => onChange('scheduled_date', e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Horário</label>
              <select
                value={(formData.scheduled_time as string) || ''}
                onChange={e => onChange('scheduled_time', e.target.value)}
                style={selectStyle}
              >
                <option value="">--</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const h = String(Math.floor((i + 14) / 2)).padStart(2, '0');
                  const m = (i + 14) % 2 === 0 ? '00' : '30';
                  return <option key={i} value={`${h}:${m}`}>{h}:{m}</option>;
                })}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duração (min)</label>
              <select
                value={formData.duration_minutes || ''}
                onChange={e => onChange('duration_minutes', e.target.value ? Number(e.target.value) : null)}
                style={selectStyle}
              >
                <option value="">--</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hora</option>
                <option value="90">1h30</option>
                <option value="120">2 horas</option>
              </select>
            </div>
          </div>

          {/* Row: Project + Assigned */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Projeto</label>
              <input
                value={(formData.project_name as string) || ''}
                onChange={e => onChange('project_name', e.target.value)}
                placeholder="Nome do projeto..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Atribuído a</label>
              <input
                value={(formData.assigned_name as string) || ''}
                onChange={e => onChange('assigned_name', e.target.value)}
                placeholder="Nome..."
                style={inputStyle}
              />
            </div>
          </div>

          {/* Metadata (edit only) */}
          {mode === 'edit' && formData.created_at && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                Criado: {new Date(formData.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <div>
            {mode === 'edit' && onDelete && isAdmin && (
              confirmDelete ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#EF4444' }}>Confirmar?</span>
                  <button onClick={onDelete} style={{ padding: '6px 12px', borderRadius: '6px', background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
                    Excluir
                  </button>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '12px' }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontSize: '13px' }}>
                  Excluir
                </button>
              )
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: '8px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '14px' }}>
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              style={{ padding: '9px 22px', borderRadius: '8px', background: '#4A90FF', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Unlinked Tasks Sidebar ───────────────────────────────────────────────────

interface UnlinkedSidebarProps {
  tasks: Task[];
  onEditTask: (t: Task) => void;
  onDragStart: (id: string) => void;
  ownerFilter: OwnerType | 'all';
}

function UnlinkedSidebar({ tasks, onEditTask, onDragStart, ownerFilter }: UnlinkedSidebarProps) {
  const filtered = tasks.filter(t => {
    if (!t.scheduled_date && t.status === 'unlinked') return true;
    if (!t.scheduled_date) return true;
    return false;
  }).filter(t => ownerFilter === 'all' || t.owner_type === ownerFilter);

  if (filtered.length === 0) return null;

  return (
    <div style={{
      padding: '12px', borderRadius: '10px',
      background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '16px',
    }}>
      <div style={{
        fontSize: '11px', color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase', letterSpacing: '0.5px',
        marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <StatusDot status="unlinked" size={6} />
        Sem vinculação ({filtered.length})
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {filtered.map(task => {
          const ownerCfg = OWNER_CONFIG[task.owner_type];
          return (
            <div
              key={task.id}
              draggable
              onDragStart={() => onDragStart(task.id)}
              onClick={() => onEditTask(task)}
              style={{
                padding: '6px 10px', borderRadius: '6px',
                background: STATUS_CONFIG.unlinked.bg,
                borderLeft: `3px solid ${ownerCfg.color}`,
                fontSize: '12px', color: 'rgba(255,255,255,0.6)',
                cursor: 'grab', maxWidth: '240px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
              title={`${ownerCfg.label}: ${task.title}`}
            >
              {task.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Day View ─────────────────────────────────────────────────────────────────

interface DayViewProps {
  date: Date;
  tasks: Task[];
  onEditTask: (t: Task) => void;
  onDragStart: (id: string) => void;
  draggedTaskId: string | null;
  onDropOnSlot: (date: string, time: string) => void;
  onSlotClick: (date: string, time: string) => void;
}

function DayView({ date, tasks, onEditTask, onDragStart, draggedTaskId, onDropOnSlot, onSlotClick }: DayViewProps) {
  const dateStr = toDateStr(date);
  const dayTasks = tasks.filter(t => t.scheduled_date && toDateStr(parseDate(t.scheduled_date)) === dateStr);
  const withTime = dayTasks.filter(t => t.scheduled_time).sort((a, b) =>
    (a.scheduled_time || '').localeCompare(b.scheduled_time || '')
  );
  const withoutTime = dayTasks.filter(t => !t.scheduled_time);

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* Time grid */}
      <div style={{ flex: 1, borderRadius: '10px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        {/* All-day tasks */}
        {withoutTime.length > 0 && (
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Dia todo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {withoutTime.map(t => (
                <TaskCard key={t.id} task={t} onClick={() => onEditTask(t)} onDragStart={() => onDragStart(t.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Hour slots */}
        {HOURS.map(hour => {
          const fullSlot = `${String(hour).padStart(2, '0')}:00`;
          const halfSlot = `${String(hour).padStart(2, '0')}:30`;
          const fullTasks = withTime.filter(t => t.scheduled_time === fullSlot);
          const halfTasks = withTime.filter(t => t.scheduled_time === halfSlot);

          return (
            <div key={hour}>
              {/* :00 slot */}
              <div
                style={{
                  display: 'flex', minHeight: '48px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: fullTasks.length === 0 ? 'pointer' : 'default',
                }}
                onClick={() => { if (fullTasks.length === 0) onSlotClick(dateStr, fullSlot); }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = 'rgba(74,144,255,0.06)'; }}
                onDragLeave={e => { e.currentTarget.style.background = ''; }}
                onDrop={e => { e.preventDefault(); e.currentTarget.style.background = ''; if (draggedTaskId) onDropOnSlot(dateStr, fullSlot); }}
              >
                <div style={{
                  width: '56px', flexShrink: 0, padding: '4px 8px',
                  fontSize: '12px', color: 'rgba(255,255,255,0.4)',
                  textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {fullSlot}
                </div>
                <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {fullTasks.map(t => (
                    <TaskCard key={t.id} task={t} onClick={() => onEditTask(t)} onDragStart={() => onDragStart(t.id)} />
                  ))}
                </div>
              </div>

              {/* :30 slot */}
              <div
                style={{
                  display: 'flex', minHeight: '36px',
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  cursor: halfTasks.length === 0 ? 'pointer' : 'default',
                }}
                onClick={() => { if (halfTasks.length === 0) onSlotClick(dateStr, halfSlot); }}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = 'rgba(74,144,255,0.06)'; }}
                onDragLeave={e => { e.currentTarget.style.background = ''; }}
                onDrop={e => { e.preventDefault(); e.currentTarget.style.background = ''; if (draggedTaskId) onDropOnSlot(dateStr, halfSlot); }}
              >
                <div style={{
                  width: '56px', flexShrink: 0, padding: '4px 8px',
                  fontSize: '11px', color: 'rgba(255,255,255,0.2)',
                  textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {halfSlot}
                </div>
                <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {halfTasks.map(t => (
                    <TaskCard key={t.id} task={t} onClick={() => onEditTask(t)} onDragStart={() => onDragStart(t.id)} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Week View ────────────────────────────────────────────────────────────────

interface WeekViewProps {
  date: Date;
  tasks: Task[];
  onEditTask: (t: Task) => void;
  onDragStart: (id: string) => void;
  draggedTaskId: string | null;
  onDropOnSlot: (date: string, time: string) => void;
  onDayClick: (d: Date) => void;
  onSlotClick: (date: string, time: string) => void;
}

function WeekView({ date, tasks, onEditTask, onDragStart, draggedTaskId, onDropOnSlot, onDayClick, onSlotClick }: WeekViewProps) {
  const days = getWeekDays(date);
  const today = new Date();

  return (
    <div style={{ borderRadius: '10px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding: '10px 4px' }} />
        {days.map(d => {
          const isToday = isSameDay(d, today);
          return (
            <div
              key={d.toISOString()}
              onClick={() => onDayClick(d)}
              style={{
                padding: '10px 8px', textAlign: 'center', cursor: 'pointer',
                borderLeft: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>
                {WEEKDAYS[d.getDay()]}
              </div>
              <div style={{
                fontSize: '16px', fontWeight: isToday ? 700 : 400,
                color: isToday ? '#4A90FF' : 'rgba(255,255,255,0.7)',
              }}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hour rows */}
      {HOURS.map(hour => {
        const timeStr = `${String(hour).padStart(2, '0')}:00`;
        return (
          <div key={hour} style={{ display: 'grid', gridTemplateColumns: '56px repeat(7, 1fr)', minHeight: '52px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{
              padding: '4px 8px', fontSize: '11px', color: 'rgba(255,255,255,0.3)',
              textAlign: 'right', fontVariantNumeric: 'tabular-nums',
              borderRight: '1px solid rgba(255,255,255,0.04)',
            }}>
              {timeStr}
            </div>
            {days.map(d => {
              const dateStr = toDateStr(d);
              const slotTasks = tasks.filter(t =>
                t.scheduled_date && toDateStr(parseDate(t.scheduled_date)) === dateStr &&
                t.scheduled_time && t.scheduled_time.startsWith(String(hour).padStart(2, '0'))
              );

              return (
                <div
                  key={dateStr}
                  style={{
                    padding: '2px 4px',
                    borderLeft: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 80ms',
                    cursor: slotTasks.length === 0 ? 'pointer' : 'default',
                  }}
                  onClick={() => { if (slotTasks.length === 0) onSlotClick(dateStr, timeStr); }}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = 'rgba(74,144,255,0.08)'; }}
                  onDragLeave={e => { e.currentTarget.style.background = ''; }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.style.background = ''; if (draggedTaskId) onDropOnSlot(dateStr, timeStr); }}
                >
                  {slotTasks.map(t => (
                    <TaskCard key={t.id} task={t} compact onClick={() => onEditTask(t)} onDragStart={() => onDragStart(t.id)} />
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Month View ───────────────────────────────────────────────────────────────

interface MonthViewProps {
  year: number;
  month: number;
  tasks: Task[];
  onEditTask: (t: Task) => void;
  onDragStart: (id: string) => void;
  draggedTaskId: string | null;
  onDropOnDay: (date: string) => void;
  onDayClick: (d: Date) => void;
  onCreateOnDay: (date: string) => void;
}

function MonthView({ year, month, tasks, onEditTask, onDragStart, draggedTaskId, onDropOnDay, onDayClick, onCreateOnDay }: MonthViewProps) {
  const cells = getMonthDays(year, month);
  const today = new Date();

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach(t => {
      if (!t.scheduled_date) return;
      const key = toDateStr(parseDate(t.scheduled_date));
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    // Sort by time within each day
    for (const k in map) {
      map[k].sort((a, b) => (a.scheduled_time || '99').localeCompare(b.scheduled_time || '99'));
    }
    return map;
  }, [tasks]);

  return (
    <div>
      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '2px' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.35)',
            padding: '8px 0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} style={{ minHeight: '80px' }} />;

          const dateStr = toDateStr(day);
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = isSameDay(day, today);

          // Determine worst status for the dot
          let dotColor = 'transparent';
          if (dayTasks.length > 0) {
            if (dayTasks.some(t => t.status === 'urgent')) dotColor = STATUS_CONFIG.urgent.color;
            else if (dayTasks.some(t => t.status === 'attention')) dotColor = STATUS_CONFIG.attention.color;
            else if (dayTasks.every(t => t.status === 'done')) dotColor = STATUS_CONFIG.done.color;
            else dotColor = '#4A90FF';
          }

          return (
            <div
              key={dateStr}
              onClick={() => onCreateOnDay(dateStr)}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(74,144,255,0.5)'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = isToday ? 'rgba(74,144,255,0.2)' : 'rgba(255,255,255,0.04)'; }}
              onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = isToday ? 'rgba(74,144,255,0.2)' : 'rgba(255,255,255,0.04)'; if (draggedTaskId) onDropOnDay(dateStr); }}
              style={{
                minHeight: '80px', padding: '6px', borderRadius: '8px', cursor: 'pointer',
                background: isToday ? 'rgba(74,144,255,0.04)' : 'rgba(255,255,255,0.015)',
                border: isToday ? '1px solid rgba(74,144,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
                transition: 'all 120ms ease',
              }}
            >
              {/* Day number + indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span
                  onClick={(e) => { e.stopPropagation(); onDayClick(day); }}
                  style={{
                    fontSize: '12px', fontWeight: isToday ? 600 : 400,
                    color: isToday ? '#4A90FF' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', borderRadius: '4px', padding: '1px 4px',
                    transition: 'background 100ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(74,144,255,0.15)'; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = ''; }}
                  title="Ver dia"
                >
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor }} />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{dayTasks.length}</span>
                  </div>
                )}
              </div>

              {/* Task previews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {dayTasks.slice(0, 3).map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    compact
                    onClick={() => onEditTask(t)}
                    onDragStart={() => onDragStart(t.id)}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); onDayClick(day); }}
                    style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', paddingLeft: '4px', cursor: 'pointer' }}
                  >
                    +{dayTasks.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function TaskManager({ initialTasks, isAdmin, userId, supabaseUrl, supabaseAnonKey }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ownerFilter, setOwnerFilter] = useState<OwnerType | 'all'>('all');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Supabase Realtime ──────────────────────────────────────────────────
  useEffect(() => {
    let channel: ReturnType<any> | null = null;

    async function setupRealtime() {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        channel = supabase
          .channel('task-manager-changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'task_manager',
          }, (payload: any) => {
            if (payload.eventType === 'INSERT') {
              setTasks(prev => {
                if (prev.some(t => t.id === payload.new.id)) return prev;
                return [payload.new as Task, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              setTasks(prev => prev.map(t =>
                t.id === payload.new.id ? (payload.new as Task) : t
              ));
            } else if (payload.eventType === 'DELETE') {
              setTasks(prev => prev.filter(t => t.id !== payload.old.id));
            }
          })
          .subscribe();
      } catch (err) {
        console.warn('Realtime setup failed:', err);
      }
    }

    setupRealtime();

    return () => {
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
    };
  }, [supabaseUrl, supabaseAnonKey]);

  // ── Filtered tasks ─────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    if (ownerFilter === 'all') return tasks;
    return tasks.filter(t => t.owner_type === ownerFilter);
  }, [tasks, ownerFilter]);

  // Unlinked (no date) tasks
  const unlinkedTasks = useMemo(() =>
    tasks.filter(t => !t.scheduled_date),
    [tasks]
  );

  // ── Navigation ─────────────────────────────────────────────────────────
  const goToday = () => setCurrentDate(new Date());

  const goPrev = () => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else { d.setMonth(d.getMonth() - 1); }
    setCurrentDate(d);
  };

  const goNext = () => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else { d.setMonth(d.getMonth() + 1); }
    setCurrentDate(d);
  };

  const headerLabel = useMemo(() => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    if (view === 'week') {
      const days = getWeekDays(currentDate);
      const start = days[0];
      const end = days[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} de ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${start.getDate()} ${MONTHS[start.getMonth()].substring(0, 3)} - ${end.getDate()} ${MONTHS[end.getMonth()].substring(0, 3)} ${end.getFullYear()}`;
    }
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [view, currentDate]);

  // ── Modal ──────────────────────────────────────────────────────────────
  const openCreate = useCallback((defaults?: Partial<Task>) => {
    setFormData({
      title: '',
      description: '',
      status: 'unlinked',
      owner_type: isAdmin ? 'moroni' : 'client',
      scheduled_date: '',
      scheduled_time: '',
      duration_minutes: undefined,
      project_name: '',
      assigned_name: '',
      ...defaults,
    });
    setEditingTask(null);
    setModalMode('create');
    setModalOpen(true);
  }, [isAdmin]);

  const openEdit = useCallback((task: Task) => {
    setFormData({
      ...task,
      scheduled_date: task.scheduled_date ? (task.scheduled_date.includes('T') ? task.scheduled_date.split('T')[0] : task.scheduled_date) : '',
      scheduled_time: task.scheduled_time || '',
    });
    setEditingTask(task);
    setModalMode('edit');
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setFormData({});
    setEditingTask(null);
    setModalLoading(false);
  }, []);

  const handleFormChange = useCallback((field: keyof Task, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // ── API ────────────────────────────────────────────────────────────────
  const apiCreate = async () => {
    if (!formData.title?.trim()) return;
    setModalLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/task-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description || null,
          status: formData.status || 'unlinked',
          owner_type: formData.owner_type || 'client',
          scheduled_date: formData.scheduled_date || null,
          scheduled_time: formData.scheduled_time || null,
          duration_minutes: formData.duration_minutes || null,
          project_name: formData.project_name || null,
          assigned_name: formData.assigned_name || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao criar tarefa');
        return;
      }
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      closeModal();
    } catch {
      setError('Erro de conexão');
    } finally {
      setModalLoading(false);
    }
  };

  const apiUpdate = async () => {
    if (!editingTask || !formData.title?.trim()) return;
    setModalLoading(true);
    setError(null);
    try {
      const patch: Record<string, unknown> = {};
      const fields: (keyof Task)[] = ['title', 'description', 'status', 'owner_type', 'scheduled_date', 'scheduled_time', 'duration_minutes', 'project_name', 'assigned_name'];
      for (const f of fields) {
        const newVal = formData[f] ?? null;
        const oldVal = editingTask[f] ?? null;
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          patch[f] = newVal || null;
        }
      }
      if (Object.keys(patch).length === 0) { closeModal(); return; }

      const res = await fetch(`/api/task-manager/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erro ao salvar');
        return;
      }
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      closeModal();
    } catch {
      setError('Erro de conexão');
    } finally {
      setModalLoading(false);
    }
  };

  const apiDelete = async () => {
    if (!editingTask) return;
    const prev = tasks;
    setTasks(ts => ts.filter(t => t.id !== editingTask.id));
    closeModal();
    try {
      const res = await fetch(`/api/task-manager/${editingTask.id}`, { method: 'DELETE' });
      if (!res.ok) {
        setTasks(prev);
        setError('Erro ao excluir');
      }
    } catch {
      setTasks(prev);
      setError('Erro de conexão');
    }
  };

  // ── Drag & Drop handlers ──────────────────────────────────────────────
  const handleDragStart = useCallback((id: string) => setDraggedTaskId(id), []);

  const handleDropOnSlot = useCallback(async (date: string, time: string) => {
    if (!draggedTaskId) return;
    const prev = tasks;
    setTasks(ts => ts.map(t =>
      t.id === draggedTaskId
        ? { ...t, scheduled_date: date, scheduled_time: time, status: t.status === 'unlinked' ? 'attention' : t.status }
        : t
    ));
    setDraggedTaskId(null);
    try {
      const patch: Record<string, unknown> = { scheduled_date: date, scheduled_time: time };
      // Auto-change status from unlinked when scheduled
      const task = prev.find(t => t.id === draggedTaskId);
      if (task?.status === 'unlinked') patch.status = 'attention';

      const res = await fetch(`/api/task-manager/${draggedTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        setTasks(prev);
        setError('Erro ao mover tarefa');
      }
    } catch {
      setTasks(prev);
      setError('Erro de conexão');
    }
  }, [draggedTaskId, tasks]);

  const handleDropOnDay = useCallback(async (date: string) => {
    if (!draggedTaskId) return;
    const prev = tasks;
    setTasks(ts => ts.map(t =>
      t.id === draggedTaskId
        ? { ...t, scheduled_date: date, status: t.status === 'unlinked' ? 'attention' : t.status }
        : t
    ));
    setDraggedTaskId(null);
    try {
      const patch: Record<string, unknown> = { scheduled_date: date };
      const task = prev.find(t => t.id === draggedTaskId);
      if (task?.status === 'unlinked') patch.status = 'attention';

      const res = await fetch(`/api/task-manager/${draggedTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        setTasks(prev);
        setError('Erro ao mover tarefa');
      }
    } catch {
      setTasks(prev);
      setError('Erro de conexão');
    }
  }, [draggedTaskId, tasks]);

  const handleDayClick = useCallback((d: Date) => {
    setCurrentDate(d);
    setView('day');
  }, []);

  const handleSlotClick = useCallback((date: string, time: string) => {
    openCreate({ scheduled_date: date, scheduled_time: time, status: 'attention' });
  }, [openCreate]);

  const handleCreateOnDay = useCallback((date: string) => {
    openCreate({ scheduled_date: date, status: 'attention' });
  }, [openCreate]);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length;
    const unlinked = tasks.filter(t => t.status === 'unlinked').length;
    const attention = tasks.filter(t => t.status === 'attention').length;
    const urgent = tasks.filter(t => t.status === 'urgent').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const clientTasks = tasks.filter(t => t.owner_type === 'client').length;
    const moroniTasks = tasks.filter(t => t.owner_type === 'moroni').length;
    return { total, unlinked, attention, urgent, done, clientTasks, moroniTasks };
  }, [tasks]);

  // ── View switcher button style ─────────────────────────────────────────
  const viewBtn = (v: CalendarView): React.CSSProperties => ({
    padding: '7px 14px', borderRadius: '7px',
    background: view === v ? 'rgba(74,144,255,0.12)' : 'transparent',
    color: view === v ? '#4A90FF' : 'rgba(255,255,255,0.45)',
    border: view === v ? '1px solid rgba(74,144,255,0.2)' : '1px solid transparent',
    fontSize: '13px', fontWeight: view === v ? 500 : 400,
    cursor: 'pointer', transition: 'all 150ms ease',
  });

  const filterBtn = (f: OwnerType | 'all'): React.CSSProperties => {
    const isActive = ownerFilter === f;
    const color = f === 'all' ? '#fff' : OWNER_CONFIG[f as OwnerType].color;
    return {
      padding: '5px 12px', borderRadius: '6px',
      background: isActive ? (f === 'all' ? 'rgba(255,255,255,0.08)' : OWNER_CONFIG[f as OwnerType].bg) : 'transparent',
      color: isActive ? color : 'rgba(255,255,255,0.35)',
      border: isActive ? `1px solid ${color}33` : '1px solid transparent',
      fontSize: '12px', cursor: 'pointer', fontWeight: isActive ? 500 : 400,
      transition: 'all 150ms',
    };
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Stats bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
        padding: '12px 16px', marginBottom: '12px', borderRadius: '10px',
        background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{stats.total}</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>total</span>
        </div>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)' }} />
        {stats.urgent > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <StatusDot status="urgent" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: STATUS_CONFIG.urgent.color }}>{stats.urgent}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>urgentes</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <StatusDot status="attention" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: STATUS_CONFIG.attention.color }}>{stats.attention}</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>atenção</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <StatusDot status="done" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: STATUS_CONFIG.done.color }}>{stats.done}</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>feitas</span>
        </div>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: OWNER_CONFIG.client.color }}>{stats.clientTasks} cliente</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '11px', color: OWNER_CONFIG.moroni.color }}>{stats.moroniTasks} moroni</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: '12px', padding: '10px 14px', borderRadius: '8px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#EF4444', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', padding: '2px' }}>
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
        padding: '12px 16px', marginBottom: '12px', borderRadius: '10px',
        background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Left: nav + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={goPrev} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '6px', display: 'flex', borderRadius: '6px' }}>
            <ChevronIcon dir="left" />
          </button>
          <button onClick={goToday} style={{
            padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
            background: 'rgba(74,144,255,0.08)', color: '#4A90FF',
            border: '1px solid rgba(74,144,255,0.15)', cursor: 'pointer',
          }}>
            Hoje
          </button>
          <button onClick={goNext} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '6px', display: 'flex', borderRadius: '6px' }}>
            <ChevronIcon dir="right" />
          </button>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginLeft: '8px', textTransform: 'capitalize' }}>
            {headerLabel}
          </span>
        </div>

        {/* Center: view switcher */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button style={viewBtn('day')} onClick={() => setView('day')}>Dia</button>
          <button style={viewBtn('week')} onClick={() => setView('week')}>Semana</button>
          <button style={viewBtn('month')} onClick={() => setView('month')}>Mês</button>
        </div>

        {/* Right: filter + new */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button style={filterBtn('all')} onClick={() => setOwnerFilter('all')}>Todos</button>
          <button style={filterBtn('client')} onClick={() => setOwnerFilter('client')}>Cliente</button>
          <button style={filterBtn('moroni')} onClick={() => setOwnerFilter('moroni')}>Moroni</button>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
          <button
            onClick={() => openCreate({ scheduled_date: toDateStr(currentDate) })}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: '#4A90FF', color: '#fff',
              fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
            }}
          >
            <PlusIcon /> Nova
          </button>
        </div>
      </div>

      {/* Unlinked tasks sidebar */}
      <UnlinkedSidebar
        tasks={unlinkedTasks}
        onEditTask={openEdit}
        onDragStart={handleDragStart}
        ownerFilter={ownerFilter}
      />

      {/* Calendar view */}
      {view === 'day' && (
        <DayView
          date={currentDate}
          tasks={filteredTasks}
          onEditTask={openEdit}
          onDragStart={handleDragStart}
          draggedTaskId={draggedTaskId}
          onDropOnSlot={handleDropOnSlot}
          onSlotClick={handleSlotClick}
        />
      )}
      {view === 'week' && (
        <WeekView
          date={currentDate}
          tasks={filteredTasks}
          onEditTask={openEdit}
          onDragStart={handleDragStart}
          draggedTaskId={draggedTaskId}
          onDropOnSlot={handleDropOnSlot}
          onDayClick={handleDayClick}
          onSlotClick={handleSlotClick}
        />
      )}
      {view === 'month' && (
        <MonthView
          year={currentDate.getFullYear()}
          month={currentDate.getMonth()}
          tasks={filteredTasks}
          onEditTask={openEdit}
          onDragStart={handleDragStart}
          draggedTaskId={draggedTaskId}
          onDropOnDay={handleDropOnDay}
          onDayClick={handleDayClick}
          onCreateOnDay={handleCreateOnDay}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          mode={modalMode}
          formData={formData}
          isAdmin={isAdmin}
          onChange={handleFormChange}
          onSave={modalMode === 'create' ? apiCreate : apiUpdate}
          onDelete={modalMode === 'edit' ? apiDelete : undefined}
          onClose={closeModal}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
