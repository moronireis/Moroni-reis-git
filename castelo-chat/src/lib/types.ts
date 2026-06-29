export type LeadStage =
  | 'novo'
  | 'contato_feito'
  | 'proposta_enviada'
  | 'visita_agendada'
  | 'visita_realizada'
  | 'negociacao'
  | 'fechado'
  | 'perdido';

export type EventType =
  | 'casamento'
  | 'debutante'
  | 'corporativo'
  | 'confraternizacao'
  | 'outro';

export interface Contact {
  id: string;
  instance_id: string;
  phone: string;
  name: string | null;
  push_name: string | null;
  photo_url: string | null;
  is_group: boolean;
  last_message_at: string | null;
  last_message_direction: string | null;
  last_message_preview: string | null;
  unread_count: number;
  created_at: string;
  // CRM fields
  lead_stage: LeadStage | null;
  event_type: EventType | null;
  event_date: string | null;
  guest_count: number | null;
  budget_range: string | null;
  email: string | null;
  notes: string | null;
  source: string | null;
}

export interface Message {
  id: string;
  contact_id: string;
  instance_id: string;
  direction: 'inbound' | 'outbound';
  content_type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker';
  body: string | null;
  status: string;
  media_url: string | null;
  media_mime: string | null;
  wa_message_id: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export interface Template {
  id: string;
  name: string;
  shortcut: string | null;
  category: string;
  body: string;
}

export interface ConnectionStatus {
  id: string;
  label: string;
  connected: boolean;
  phone?: string;
  name?: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  qrcode?: string;
}
