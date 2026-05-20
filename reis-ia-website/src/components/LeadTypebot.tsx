/**
 * LeadTypebot
 * Conversational lead qualification form — typebot-style chat interface.
 * 8 qualification steps + calendar booking. Submits to /api/leads.
 * Styling: dark premium, matching reis-ia-website design system.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import BookingCalendar from './BookingCalendar';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepType = 'text' | 'phone' | 'email' | 'options' | 'options-or-text' | 'textarea' | 'calendar' | 'done';

interface Step {
  id: string;
  context?: (answers: Record<string, string>) => string; // conversational text before the question
  question: (answers: Record<string, string>) => string; // the actual question (shown after typing pause)
  type: StepType;
  options?: string[];
  placeholder?: string;
  validate?: (value: string) => string | null;
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  isCalendar?: boolean;
  isTyping?: boolean;
}

// ---------------------------------------------------------------------------
// Steps definition
// ---------------------------------------------------------------------------

const STEPS: Step[] = [
  {
    id: 'name',
    context: () => 'Opa! Que bom ter você aqui. Vou te fazer algumas perguntas rápidas pra entender como IA pode gerar mais receita e eficiência pro seu negócio.',
    question: () => 'Pra começar, qual é o seu nome?',
    type: 'text',
    placeholder: 'Seu nome completo',
    validate: (v) => (v.trim().length < 2 ? 'Por favor, informe seu nome.' : null),
  },
  {
    id: 'whatsapp',
    context: (a) => `Show, ${a.name?.split(' ')[0]}! Vou te enviar um resumo do que conversarmos aqui.`,
    question: () => 'Qual o seu WhatsApp?',
    type: 'phone',
    placeholder: '(11) 99999-9999',
    validate: (v) => {
      const digits = v.replace(/\D/g, '');
      return digits.length < 10 ? 'Informe um número válido com DDD.' : null;
    },
  },
  {
    id: 'email',
    context: () => 'É por e-mail que vou te mandar os materiais e confirmações.',
    question: () => 'Qual o seu melhor e-mail?',
    type: 'email',
    placeholder: 'seu@email.com',
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Informe um e-mail válido.',
  },
  {
    id: 'company',
    context: () => 'Agora me conta um pouco do seu momento. Isso me ajuda a direcionar o melhor caminho pra você.',
    question: () => 'Você já tem um negócio rodando?',
    type: 'options',
    options: [
      'Já tenho empresa',
      'Ainda não tenho empresa',
      'Estou criando do zero',
    ],
  },
  {
    id: 'companyName',
    question: (a) => a.company === 'Já tenho empresa'
      ? 'Qual o nome da empresa?'
      : 'Me fala o nome do projeto ou a área que você atua.',
    type: 'text',
    placeholder: 'Digite aqui...',
    validate: (v) => (v.trim().length < 2 ? 'Por favor, informe.' : null),
  },
  {
    id: 'segment',
    context: () => 'Cada segmento tem oportunidades diferentes de IA pra aumentar receita.',
    question: (a) => `Qual o segmento${a.company === 'Já tenho empresa' ? ' da empresa' : ' que você atua'}?`,
    type: 'options-or-text',
    options: [
      'Tecnologia',
      'Agência Digital',
      'E-commerce',
      'Serviços',
      'Indústria',
      'Saúde',
      'Educação',
    ],
    placeholder: 'Ou digite seu segmento...',
  },
  {
    id: 'role',
    context: () => 'Isso me ajuda a personalizar as recomendações pro seu nível de decisão.',
    question: () => 'Qual o seu cargo ou papel hoje?',
    type: 'options-or-text',
    options: [
      'CEO/Fundador',
      'Diretor',
      'Gerente',
      'Coordenador',
      'Especialista',
      'Autônomo',
    ],
    placeholder: 'Ou digite seu cargo...',
  },
  {
    id: 'revenue',
    context: () => 'Empresas em diferentes estágios têm prioridades diferentes. Quero te indicar o caminho certo pra maximizar resultado.',
    question: () => 'Qual a faixa de faturamento anual?',
    type: 'options',
    options: [
      'Ainda não faturo',
      'Até R$5k/mês',
      'R$5k - R$10k/mês',
      'R$10k - R$30k/mês',
      'R$30k - R$100k/mês',
      'R$100k - R$500k/mês',
      'R$500k - R$2M/mês',
      'Acima de R$2M/mês',
    ],
  },
  {
    id: 'employees',
    context: () => 'Isso define onde IA gera mais impacto — automação, escala de atendimento ou redução de custo.',
    question: () => 'Quantas pessoas no time?',
    type: 'options',
    options: ['Só eu', '1-5', '6-15', '16-50', '51-200', '200+'],
  },
  {
    id: 'description',
    context: (a) => `Última pergunta, ${a.name?.split(' ')[0]}. Essa é a mais importante.`,
    question: () => 'Qual o maior gargalo do seu negócio hoje e o que você espera resolver com IA?',
    type: 'textarea',
    placeholder: 'Ex: Meu time perde muito tempo qualificando leads manualmente e quero automatizar isso...',
    validate: (v) => (v.trim().length < 10 ? 'Conte um pouco mais pra eu te direcionar melhor.' : null),
  },
];

// WhatsApp group link for early-stage leads
const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/HiqWoC9fHN1GaT5yBIqUJz';

// Moroni's direct WhatsApp
const MORONI_WHATSAPP = '5511970578082';

// Only send to WhatsApp group if they DON'T revenue yet
// Everyone else (has company or not, but revenues) → calendar
function isQualifiedForBooking(answers: Record<string, string>): boolean {
  return answers.revenue !== 'Ainda não faturo';
}

const TOTAL_STEPS = STEPS.length + 1; // +1 for calendar

// ---------------------------------------------------------------------------
// Phone mask helper
// ---------------------------------------------------------------------------

function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// ---------------------------------------------------------------------------
// Bot SVG avatar
// ---------------------------------------------------------------------------

function BotAvatar() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(74,144,255,0.15)',
        border: '1px solid rgba(74,144,255,0.30)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px',
      }}
    >
      {/* Minimal robot icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="10" height="8" rx="2" stroke="#4A90FF" strokeWidth="1.2" />
        <rect x="6" y="2" width="4" height="3" rx="1" stroke="#4A90FF" strokeWidth="1.2" />
        <line x1="8" y1="5" x2="8" y2="2" stroke="#4A90FF" strokeWidth="1.2" />
        <circle cx="6" cy="9" r="1" fill="#4A90FF" />
        <circle cx="10" cy="9" r="1" fill="#4A90FF" />
        <line x1="6" y1="11" x2="10" y2="11" stroke="#4A90FF" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------

function TypingDots() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '12px 12px 12px 2px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        width: 'fit-content',
      }}
      aria-label="Digitando..."
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(74,144,255,0.70)',
            display: 'inline-block',
            animation: `typebotDots 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single chat message
// ---------------------------------------------------------------------------

interface ChatMessageProps {
  msg: Message;
  visible: boolean;
}

function ChatMessage({ msg, visible }: ChatMessageProps) {
  const isBot = msg.role === 'bot';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isBot ? 'row' : 'row-reverse',
        alignItems: 'flex-start',
        gap: '10px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 320ms ease, transform 320ms ease',
        marginBottom: '4px',
      }}
    >
      {isBot && <BotAvatar />}

      <div
        style={{
          maxWidth: 'calc(100% - 44px)',
          padding: msg.isTyping ? '0' : '12px 16px',
          borderRadius: isBot ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
          background: msg.isTyping
            ? 'transparent'
            : isBot
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(74,144,255,0.12)',
          border: msg.isTyping
            ? 'none'
            : isBot
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(74,144,255,0.25)',
          color: isBot ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.95)',
          fontSize: '15px',
          lineHeight: 1.55,
          fontWeight: isBot ? 400 : 500,
        }}
      >
        {msg.isTyping ? <TypingDots /> : msg.text}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WhatsApp redirect with countdown
// ---------------------------------------------------------------------------

function WhatsAppRedirect({ url }: { url: string }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = url;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [url]);

  return (
    <>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', margin: '0 0 16px' }}>
        Informações recebidas
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', borderRadius: '10px', border: 'none',
          background: '#25D366', color: '#fff', fontSize: '14px', fontWeight: 600,
          textDecoration: 'none', fontFamily: 'inherit', transition: 'background 150ms',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        Entrar no grupo de conteúdos
      </a>
      {countdown > 0 && (
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '10px' }}>
          Redirecionando em {countdown}s...
        </p>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Answer summary + WhatsApp CTA
// ---------------------------------------------------------------------------

function buildWhatsAppMessage(answers: Record<string, string>, booking?: { date: string; time: string } | null): string {
  const firstName = answers.name?.split(' ')[0] || '';
  let msg = `Oi! Sou ${answers.name}, acabei de preencher o formulário no site da REIS [IA].\n\n`;
  msg += `*Resumo:*\n`;
  if (answers.company) msg += `Empresa: ${answers.company === 'Já tenho empresa' ? answers.companyName : answers.company}\n`;
  if (answers.companyName && answers.company === 'Já tenho empresa') msg += `Nome: ${answers.companyName}\n`;
  if (answers.segment) msg += `Segmento: ${answers.segment}\n`;
  if (answers.role) msg += `Cargo: ${answers.role}\n`;
  if (answers.revenue) msg += `Faturamento: ${answers.revenue}\n`;
  if (answers.employees) msg += `Time: ${answers.employees}\n`;
  if (answers.description) msg += `Objetivo: ${answers.description}\n`;
  if (booking) {
    const [y, m, d] = booking.date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const formatted = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    msg += `\nSessão agendada: ${formatted} às ${booking.time}`;
  }
  return msg;
}

function AnswerSummary({ answers, booking }: { answers: Record<string, string>; booking?: { date: string; time: string } | null }) {
  const summaryItems: { label: string; value: string }[] = [];
  if (answers.name) summaryItems.push({ label: 'Nome', value: answers.name });
  if (answers.company === 'Já tenho empresa' && answers.companyName) {
    summaryItems.push({ label: 'Empresa', value: answers.companyName });
  } else if (answers.company) {
    summaryItems.push({ label: 'Situação', value: answers.company });
  }
  if (answers.segment) summaryItems.push({ label: 'Segmento', value: answers.segment });
  if (answers.role) summaryItems.push({ label: 'Cargo', value: answers.role });
  if (answers.revenue) summaryItems.push({ label: 'Faturamento', value: answers.revenue });
  if (answers.employees) summaryItems.push({ label: 'Time', value: answers.employees });
  if (answers.description) summaryItems.push({ label: 'Objetivo', value: answers.description });

  const whatsappUrl = `https://wa.me/${MORONI_WHATSAPP}?text=${encodeURIComponent(buildWhatsAppMessage(answers, booking))}`;

  return (
    <div style={{ textAlign: 'left', animation: 'typebotFadeUp 400ms ease 300ms both' }}>
      {/* Summary card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(74,144,255,0.80)', marginBottom: '16px' }}>
          Resumo das suas respostas
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {summaryItems.map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: '8px', fontSize: '14px', lineHeight: 1.5 }}>
              <span style={{ color: 'rgba(255,255,255,0.40)', flexShrink: 0, minWidth: '90px' }}>{item.label}:</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.60)', marginBottom: '14px', lineHeight: 1.5 }}>
          Fale direto comigo no WhatsApp pra agilizar:
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px 28px', borderRadius: '10px', border: 'none',
            background: '#25D366', color: '#fff', fontSize: '15px', fontWeight: 600,
            textDecoration: 'none', fontFamily: 'inherit', transition: 'background 150ms, transform 150ms',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface LeadTypebotProps {
  source?: string;
  defaultIntro?: string;
}

export default function LeadTypebot({ source = 'typebot-agendar', defaultIntro }: LeadTypebotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<{ date: string; time: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const addMessage = useCallback(
    (msg: Omit<Message, 'id'>, delayVisible = 0) => {
      const id = `${Date.now()}-${Math.random()}`;
      const fullMsg: Message = { ...msg, id };
      setMessages((prev) => [...prev, fullMsg]);
      setTimeout(() => {
        setVisibleIds((prev) => new Set([...prev, id]));
      }, delayVisible);
      return id;
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 80);
  }, []);

  // Show bot message with typing indicator, then real message
  const showBotMessage = useCallback(
    (text: string, onDone?: () => void) => {
      const typingId = addMessage({ role: 'bot', text: '', isTyping: true }, 0);
      scrollToBottom();

      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== typingId));
        addMessage({ role: 'bot', text }, 50);
        scrollToBottom();
        if (onDone) onDone();
      }, 900);
    },
    [addMessage, scrollToBottom]
  );

  // Show context message first, then question after a pause (two separate bubbles)
  const showStepMessages = useCallback(
    (context: string | undefined, question: string, onDone?: () => void) => {
      if (context) {
        // Show context first
        const typingId1 = addMessage({ role: 'bot', text: '', isTyping: true }, 0);
        scrollToBottom();

        setTimeout(() => {
          setMessages((prev) => prev.filter((m) => m.id !== typingId1));
          addMessage({ role: 'bot', text: context }, 50);
          scrollToBottom();

          // Then show question after another typing pause
          setTimeout(() => {
            const typingId2 = addMessage({ role: 'bot', text: '', isTyping: true }, 0);
            scrollToBottom();

            setTimeout(() => {
              setMessages((prev) => prev.filter((m) => m.id !== typingId2));
              addMessage({ role: 'bot', text: question }, 50);
              scrollToBottom();
              if (onDone) onDone();
            }, 700);
          }, 400);
        }, 900);
      } else {
        // No context — just show question
        showBotMessage(question, onDone);
      }
    },
    [addMessage, scrollToBottom, showBotMessage]
  );

  // ---------------------------------------------------------------------------
  // Initialization — show first bot message
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const firstStep = STEPS[0];
    if (defaultIntro) {
      // Custom intro (e.g., Builders) — show as single message then question
      showStepMessages(defaultIntro, firstStep.question({}), () => {
        setTimeout(() => inputRef.current?.focus(), 200);
      });
    } else {
      // Default — show context + question separately
      const ctx = firstStep.context ? firstStep.context({}) : undefined;
      showStepMessages(ctx, firstStep.question({}), () => {
        setTimeout(() => inputRef.current?.focus(), 200);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Submit a text/phone/email answer
  // ---------------------------------------------------------------------------

  function handleTextSubmit() {
    if (currentStep >= STEPS.length) return;
    const step = STEPS[currentStep];
    const val = step.type === 'phone' ? maskPhone(inputValue) : inputValue.trim();

    // Validate
    if (step.validate) {
      const err = step.validate(val);
      if (err) {
        setInputError(err);
        return;
      }
    } else if (!val) {
      setInputError('Este campo é obrigatório.');
      return;
    }

    setInputError('');
    setInputValue('');

    // Record answer
    const newAnswers = { ...answers, [step.id]: val };
    setAnswers(newAnswers);

    // Show user reply
    addMessage({ role: 'user', text: val }, 0);
    scrollToBottom();

    advanceStep(newAnswers);
  }

  // ---------------------------------------------------------------------------
  // Select an option answer
  // ---------------------------------------------------------------------------

  function handleOptionSelect(option: string) {
    if (currentStep >= STEPS.length) return;
    const step = STEPS[currentStep];
    const newAnswers = { ...answers, [step.id]: option };
    setAnswers(newAnswers);

    addMessage({ role: 'user', text: option }, 0);
    scrollToBottom();

    advanceStep(newAnswers);
  }

  // ---------------------------------------------------------------------------
  // Advance to next step
  // ---------------------------------------------------------------------------

  async function advanceStep(currentAnswers: Record<string, string>) {
    let nextStepIndex = currentStep + 1;

    // companyName step always shows — question adapts based on company answer

    if (nextStepIndex < STEPS.length) {
      // More qualification steps
      setCurrentStep(nextStepIndex);
      const nextStep = STEPS[nextStepIndex];
      const ctx = nextStep.context ? nextStep.context(currentAnswers) : undefined;
      const q = nextStep.question(currentAnswers);
      showStepMessages(ctx, q, () => {
        setTimeout(() => inputRef.current?.focus(), 200);
      });
    } else {
      // All steps done — save lead first, then route
      setCurrentStep(STEPS.length);

      // Save lead immediately (before calendar or WhatsApp)
      await submitLeadData(currentAnswers, null);

      if (isQualifiedForBooking(currentAnswers)) {
        // Qualified: context + question + calendar
        showStepMessages(
          `Excelente, ${currentAnswers.name?.split(' ')[0]}! Pelo que você me contou, IA pode gerar um impacto direto na sua receita e eficiência.`,
          'Vamos marcar uma conversa pra mapear as maiores oportunidades no seu negócio. Escolhe o melhor horário:',
          () => {
            setShowCalendar(true);
            scrollToBottom();
          }
        );
      } else {
        // Not qualified: context + WhatsApp group
        showStepMessages(
          `${currentAnswers.name?.split(' ')[0]}, muito bom ter essa visão! Pra quem tá começando, o melhor caminho é absorver os fundamentos primeiro.`,
          'Tenho um grupo no WhatsApp onde compartilho estratégias reais de como usar IA pra construir e escalar um negócio. Entra lá:',
          () => {
            setIsDone(true);
            setBookingDone(true);
            scrollToBottom();
          }
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Submit lead data to API (without booking yet)
  // ---------------------------------------------------------------------------

  async function submitLeadData(
    currentAnswers: Record<string, string>,
    booking: { date: string; time: string } | null = null
  ) {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentAnswers.name,
          whatsapp: currentAnswers.whatsapp,
          email: currentAnswers.email,
          company: currentAnswers.companyName || currentAnswers.company,
          segment: currentAnswers.segment,
          role: currentAnswers.role,
          revenue: currentAnswers.revenue,
          employees: currentAnswers.employees,
          description: currentAnswers.description || '',
          companyStatus: currentAnswers.company, // "Já tenho empresa" / "Ainda não tenho" / "Criando do zero"
          booking,
          source,
        }),
      });
      const data = await res.json();
      if (data.id) setLeadId(data.id);
    } catch (err) {
      console.error('[LeadTypebot] Failed to submit lead:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // Booking confirmed
  // ---------------------------------------------------------------------------

  async function handleBookingConfirm(date: string, time: string) {
    setSubmitting(true);
    setBookingInfo({ date, time });

    // Send booking data with all lead info (triggers WhatsApp + email notifications)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: answers.name,
          whatsapp: answers.whatsapp,
          email: answers.email,
          company: answers.companyName || answers.company,
          segment: answers.segment,
          role: answers.role,
          revenue: answers.revenue,
          employees: answers.employees,
          description: answers.description || '',
          companyStatus: answers.company,
          booking: { date, time },
          source,
          isBookingUpdate: true,
        }),
      });
      const data = await res.json();
      console.log('[LeadTypebot] Booking saved:', data);
    } catch (err) {
      console.error('[LeadTypebot] Failed to save booking:', err);
    }

    setShowCalendar(false);
    setSubmitting(false);
    setBookingDone(true);

    // Format the date nicely for the message
    const [y, m, d] = date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const formatted = dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });

    // Show user's selection as message
    addMessage({ role: 'user', text: `${formatted} às ${time}` }, 0);
    scrollToBottom();

    // Bot confirmation
    setTimeout(() => {
      showStepMessages(
        `Perfeito, ${answers.name?.split(' ')[0]}! Sessão confirmada. Vou te mandar os detalhes por e-mail e WhatsApp.`,
        'Nessa conversa vamos identificar onde IA gera mais resultado no seu negócio — aumentar receita, reduzir custos e liberar o tempo do seu time. Até lá!',
        () => {
          setIsDone(true);
          scrollToBottom();
        }
      );
    }, 400);
  }

  // ---------------------------------------------------------------------------
  // Phone input handler
  // ---------------------------------------------------------------------------

  function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskPhone(e.target.value);
    setInputValue(masked);
    if (inputError) setInputError('');
  }

  // ---------------------------------------------------------------------------
  // Generic input handler
  // ---------------------------------------------------------------------------

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (inputError) setInputError('');
  }

  // ---------------------------------------------------------------------------
  // Enter key on text inputs
  // ---------------------------------------------------------------------------

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTextSubmit();
    }
  }

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const currentStepData = currentStep < STEPS.length ? STEPS[currentStep] : null;
  const showTextInput =
    !showCalendar &&
    !isDone &&
    currentStepData &&
    ['text', 'phone', 'email'].includes(currentStepData.type);
  const showTextarea =
    !showCalendar &&
    !isDone &&
    currentStepData?.type === 'textarea';
  const showOptions =
    !showCalendar &&
    !isDone &&
    currentStepData?.type === 'options';
  const showOptionsOrText =
    !showCalendar &&
    !isDone &&
    currentStepData?.type === 'options-or-text';
  const showWhatsAppButton =
    isDone && bookingDone && !isQualifiedForBooking(answers);

  // Progress: 0 to 1
  const progress =
    currentStep < STEPS.length
      ? currentStep / TOTAL_STEPS
      : showCalendar && !bookingDone
      ? STEPS.length / TOTAL_STEPS
      : bookingDone
      ? 1
      : STEPS.length / TOTAL_STEPS;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* Global keyframes injected once */}
      <style>{`
        @keyframes typebotDots {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes typebotFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typebotSpin {
          to { transform: rotate(360deg); }
        }
        .typebot-option-btn:hover {
          background: rgba(74,144,255,0.10) !important;
          border-color: rgba(74,144,255,0.40) !important;
          color: rgba(255,255,255,0.95) !important;
        }
        .typebot-input:focus {
          outline: none;
          border-color: rgba(74,144,255,0.60) !important;
          box-shadow: 0 0 0 3px rgba(74,144,255,0.12) !important;
        }
        .typebot-submit:hover:not(:disabled) {
          background: #6AADFF !important;
        }
      `}</style>

      {/* Outer wrapper */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Progress bar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
              background: 'linear-gradient(90deg, #4A90FF, #6AADFF)',
              borderRadius: '2px',
              transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Blue ambient glow behind chat */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(74,144,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Chat messages scroll area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            zIndex: 1,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.08) transparent',
          }}
          role="log"
          aria-live="polite"
          aria-label="Conversa"
        >
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              visible={visibleIds.has(msg.id)}
            />
          ))}

          {/* Calendar inline in chat */}
          {showCalendar && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '10px',
                animation: 'typebotFadeUp 320ms ease both',
              }}
            >
              <BotAvatar />
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px 12px 12px 2px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <BookingCalendar onConfirm={handleBookingConfirm} />
              </div>
            </div>
          )}

          {/* Done state — summary + WhatsApp CTA */}
          {isDone && (
            <div
              style={{
                padding: '24px 0 8px',
                animation: 'typebotFadeUp 400ms ease 200ms both',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.30)',
                    marginBottom: '12px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3.5 3.5 6.5-7" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {showWhatsAppButton && (
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', margin: '0 0 16px' }}>
                    Informações recebidas
                  </p>
                )}
                {!showWhatsAppButton && bookingInfo && (
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', margin: '0 0 4px' }}>
                    Sessão confirmada
                  </p>
                )}
              </div>
              <AnswerSummary answers={answers} booking={bookingInfo} />
              {showWhatsAppButton && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <a
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'underline',
                    }}
                  >
                    Ou entre no grupo de conteúdos
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        {!isDone && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Text/email inputs */}
            {showTextInput && (
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type={
                      currentStepData?.type === 'email'
                        ? 'email'
                        : currentStepData?.type === 'phone'
                        ? 'tel'
                        : 'text'
                    }
                    value={inputValue}
                    onChange={
                      currentStepData?.type === 'phone'
                        ? handlePhoneInput
                        : handleInputChange
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={currentStepData?.placeholder || ''}
                    autoComplete={
                      currentStepData?.id === 'email'
                        ? 'email'
                        : currentStepData?.id === 'whatsapp'
                        ? 'tel'
                        : currentStepData?.id === 'name'
                        ? 'name'
                        : 'off'
                    }
                    className="typebot-input"
                    style={{
                      flex: 1,
                      padding: '13px 16px',
                      borderRadius: '10px',
                      border: inputError
                        ? '1px solid rgba(239,68,68,0.60)'
                        : '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      transition: 'border-color 160ms ease, box-shadow 160ms ease',
                    }}
                    aria-label={currentStepData?.placeholder}
                    aria-invalid={!!inputError}
                    aria-describedby={inputError ? 'typebot-input-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={handleTextSubmit}
                    className="typebot-submit"
                    style={{
                      padding: '13px 18px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#4A90FF',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                      fontFamily: 'inherit',
                      transition: 'background 160ms ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    aria-label="Enviar resposta"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {inputError && (
                  <p
                    id="typebot-input-error"
                    role="alert"
                    style={{
                      fontSize: '13px',
                      color: '#EF4444',
                      marginTop: '6px',
                      marginLeft: '4px',
                    }}
                  >
                    {inputError}
                  </p>
                )}
              </div>
            )}

            {/* Option buttons */}
            {showOptions && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  animation: 'typebotFadeUp 280ms ease both',
                }}
                role="group"
                aria-label={`Opções para: ${currentStepData?.question(answers)}`}
              >
                {currentStepData?.options?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleOptionSelect(opt)}
                    className="typebot-option-btn"
                    style={{
                      padding: '9px 18px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.80)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition:
                        'background 160ms ease, border-color 160ms ease, color 160ms ease',
                      letterSpacing: '0.005em',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Options with text fallback */}
            {showOptionsOrText && (
              <div style={{ animation: 'typebotFadeUp 280ms ease both' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}
                  role="group" aria-label={`Opções para: ${currentStepData?.question(answers)}`}
                >
                  {currentStepData?.options?.map((opt) => (
                    <button key={opt} type="button" onClick={() => handleOptionSelect(opt)}
                      className="typebot-option-btn"
                      style={{ padding: '9px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.80)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 160ms ease, border-color 160ms ease, color 160ms ease', letterSpacing: '0.005em' }}
                    >{opt}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStepData?.placeholder || 'Ou digite aqui...'}
                    className="typebot-input"
                    style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '14px', fontFamily: 'inherit', transition: 'border-color 160ms ease, box-shadow 160ms ease' }}
                  />
                  <button type="button" onClick={handleTextSubmit} className="typebot-submit"
                    style={{ padding: '11px 16px', borderRadius: '10px', border: 'none', background: '#4A90FF', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'background 160ms ease' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Textarea input */}
            {showTextarea && (
              <div style={{ animation: 'typebotFadeUp 280ms ease both' }}>
                <textarea
                  ref={inputRef as any}
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); if (inputError) setInputError(''); }}
                  placeholder={currentStepData?.placeholder || ''}
                  className="typebot-input"
                  rows={3}
                  style={{
                    width: '100%', padding: '13px 16px', borderRadius: '10px',
                    border: inputError ? '1px solid rgba(239,68,68,0.60)' : '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)', color: '#ffffff', fontSize: '15px',
                    fontFamily: 'inherit', resize: 'none',
                    transition: 'border-color 160ms ease, box-shadow 160ms ease',
                  }}
                  aria-label={currentStepData?.placeholder}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  {inputError && <p style={{ fontSize: '13px', color: '#EF4444', margin: 0 }}>{inputError}</p>}
                  <button
                    type="button"
                    onClick={handleTextSubmit}
                    className="typebot-submit"
                    style={{
                      marginLeft: 'auto', padding: '10px 20px', borderRadius: '10px', border: 'none',
                      background: '#4A90FF', color: '#fff', fontSize: '14px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px',
                      transition: 'background 160ms ease',
                    }}
                  >
                    Enviar
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Calendar state — no input needed, handled inline */}
            {showCalendar && !bookingDone && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.35)',
                  textAlign: 'center',
                  padding: '8px 0',
                }}
              >
                Selecione uma data e horário acima para confirmar
              </p>
            )}
          </div>
        )}

        {/* Done actions */}
        {isDone && (
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              animation: 'typebotFadeUp 400ms ease 600ms both',
            }}
          >
            <a
              href="/"
              style={{
                padding: '11px 22px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.70)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 160ms ease, color 160ms ease',
              }}
            >
              Ir para o início
            </a>
          </div>
        )}
      </div>
    </>
  );
}
