/**
 * CV Engine — AI-powered text generation for recruitment
 *
 * Uses Claude Haiku (claude-haiku-4-5) for cost efficiency.
 * All functions use prompt caching on the system message.
 *
 * FALLBACK MODE: If ANTHROPIC_API_KEY is empty/missing, all functions
 * use template-based generation so the system works for demos without
 * an API key. Log output indicates which mode is active.
 */

import Anthropic from "@anthropic-ai/sdk";

const API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const USE_TEMPLATE_FALLBACK = !API_KEY.trim();

if (USE_TEMPLATE_FALLBACK) {
  console.log("[cv-engine] ANTHROPIC_API_KEY not set — running in TEMPLATE FALLBACK mode");
} else {
  console.log("[cv-engine] ANTHROPIC_API_KEY detected — running in CLAUDE API mode");
}

const client = USE_TEMPLATE_FALLBACK
  ? null
  : new Anthropic({ apiKey: API_KEY });

// Model: Haiku for cost efficiency on high-volume recruitment tasks
const MODEL = "claude-haiku-4-5";

// ---------------------------------------------------------------------------
// Template fallback helpers
// ---------------------------------------------------------------------------

/**
 * Template-based professional summary — used when ANTHROPIC_API_KEY is absent.
 * Generates realistic PT-BR text from candidate data without API calls.
 */
function templateProfessionalSummary(
  candidate: CandidateData,
  _conversationSummary: string,
  jobTitle: string
): string {
  const name = candidate.name;
  const expPhrase =
    candidate.experience_years !== undefined && candidate.experience_years > 0
      ? `com ${candidate.experience_years} ${candidate.experience_years === 1 ? "ano" : "anos"} de experiência`
      : "com sólida trajetória profissional";
  const eduPhrase = candidate.education
    ? `Formação em ${candidate.education}.`
    : "";
  const skillsPhrase =
    candidate.skills && candidate.skills.length > 0
      ? `Possui conhecimentos em ${candidate.skills.slice(0, 4).join(", ")}.`
      : "";
  const locationPhrase = candidate.location
    ? ` Baseado em ${candidate.location}.`
    : "";

  return (
    `${name} é um profissional ${expPhrase} no mercado de trabalho.${locationPhrase} ` +
    `Demonstra perfil compatível com a vaga de ${jobTitle}, apresentando comprometimento e foco em resultados. ` +
    `${eduPhrase} ${skillsPhrase}`.trim() +
    ` Busca oportunidade de crescimento profissional e contribuição efetiva para a equipe.`
  ).replace(/\s{2,}/g, " ").trim();
}

/**
 * Template-based job description — used when ANTHROPIC_API_KEY is absent.
 */
function templateJobDescription(
  title: string,
  clientName: string,
  requirements: string,
  salary: string
): string {
  return `DESCRIÇÃO DA VAGA

Cargo: ${title}
Empresa: ${clientName}
Faixa salarial: ${salary}

Sobre a vaga:
A empresa ${clientName} está em busca de um(a) profissional para ocupar a posição de ${title}. O candidato selecionado atuará em um ambiente dinâmico, contribuindo diretamente para os resultados da equipe.

Requisitos:
${requirements}

O que oferecemos:
- Remuneração: ${salary}
- Oportunidade de crescimento profissional
- Ambiente colaborativo e orientado a resultados

---

SCRIPT DE ENTREVISTA — ${title}

1. Fale sobre sua trajetória profissional e o que te motivou a se candidatar a esta vaga.
2. Quais são suas principais competências para esta posição?
3. Descreva uma situação desafiadora que você enfrentou e como a resolveu.
4. Como você organiza suas prioridades quando tem múltiplas demandas simultâneas?
5. Qual foi o projeto ou resultado profissional do qual você mais se orgulha?
6. Como você lida com feedbacks negativos ou críticas ao seu trabalho?
7. Descreva sua experiência com os requisitos listados na vaga.
8. Quais são suas expectativas de desenvolvimento para os próximos dois anos?
9. Como você costuma colaborar com equipes multifuncionais?
10. Tem alguma dúvida sobre a vaga ou sobre a empresa ${clientName}?`;
}

/**
 * Template-based chat response suggestion — keyword-driven fallback.
 * Returns contextual responses for the recruiter to send via WhatsApp.
 */
function templateChatResponse(
  conversationHistory: string,
  jobContext: string,
  candidateName: string
): string {
  const lower = conversationHistory.toLowerCase();
  const firstName = candidateName.split(" ")[0];

  // Salary / compensation questions
  if (/sal[aá]rio|remunera|combina|quanto|pagar|valor/.test(lower)) {
    return `Olá, ${firstName}! Sobre a remuneração, trabalhamos com uma faixa que está alinhada com o mercado para a posição. Posso compartilhar mais detalhes na próxima etapa do processo. Você tem disponibilidade para uma conversa rápida esta semana?`;
  }

  // Availability / scheduling
  if (/disponibilidade|hor[aá]rio|quando|agenda|entrevista|conversar/.test(lower)) {
    return `${firstName}, que ótimo! Vamos agendar uma conversa para avançarmos no processo. Você tem disponibilidade amanhã ou depois de amanhã, no período da manhã ou tarde? Me informe o melhor horário para você.`;
  }

  // Interest confirmation / application
  if (/interesse|tenho interesse|quero|candidat|vaga/.test(lower)) {
    return `Olá, ${firstName}! Ficamos felizes com seu interesse. Vou analisar o seu perfil e retorno em breve com os próximos passos. Enquanto isso, pode me enviar seu currículo atualizado?`;
  }

  // Experience / background questions
  if (/experi[eê]ncia|trabalhou|empresa|cargo|fun[çc][aã]o/.test(lower)) {
    return `${firstName}, obrigado por compartilhar sua experiência. Seu perfil está sendo avaliado com atenção. Em breve entro em contato com mais informações sobre as próximas etapas do processo seletivo.`;
  }

  // Default: move conversation forward
  return `Olá, ${firstName}! Tudo bem? Entrei em contato para dar continuidade ao processo seletivo referente à vaga de ${jobContext}. Poderia confirmar seu interesse e disponibilidade para prosseguirmos?`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CandidateData {
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  experience_years?: number;
  education?: string;
  skills?: string[];
}

// ---------------------------------------------------------------------------
// generateProfessionalSummary
// ---------------------------------------------------------------------------

/**
 * Generates a professional summary paragraph (3-5 sentences) in Portuguese
 * suitable for inclusion in a candidate's CV.
 * Uses prompt caching on the system message for cost efficiency.
 */
export async function generateProfessionalSummary(
  candidate: CandidateData,
  conversationSummary: string,
  jobTitle: string
): Promise<string> {
  if (USE_TEMPLATE_FALLBACK) {
    console.log("[cv-engine] generateProfessionalSummary → template mode");
    return templateProfessionalSummary(candidate, conversationSummary, jobTitle);
  }

  const systemPrompt = `Você é um redator especializado em recursos humanos de uma agência de recrutamento profissional chamada RHF Talentos.
Sua tarefa é redigir resumos profissionais objetivos e precisos para candidatos, em português brasileiro.

Diretrizes:
- Escreva em 3 a 5 frases
- Tom objetivo e profissional, adequado para o mercado de trabalho brasileiro
- Destaque as competências mais relevantes para a vaga
- Mencione anos de experiência quando disponível
- Não invente informações — baseie-se apenas nos dados fornecidos
- Escreva na terceira pessoa`;

  const userPrompt = `Redija um resumo profissional para o seguinte candidato:

Nome: ${candidate.name}
${candidate.location ? `Localização: ${candidate.location}` : ""}
${candidate.experience_years !== undefined ? `Anos de experiência: ${candidate.experience_years}` : ""}
${candidate.education ? `Formação: ${candidate.education}` : ""}
${candidate.skills && candidate.skills.length > 0 ? `Habilidades: ${candidate.skills.join(", ")}` : ""}

Conversa/contexto do candidato:
${conversationSummary}

Vaga de interesse: ${jobTitle}

Escreva apenas o parágrafo do resumo profissional, sem títulos ou formatação adicional.`;

  try {
    const response = await client!.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: systemPrompt,
          // Cache the stable system prompt — saves ~90% on repeated calls
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new Error("No text block in AI response");
    }
    return block.text.trim();
  } catch (error) {
    console.error("[cv-engine] generateProfessionalSummary error:", error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// generateJobDescription
// ---------------------------------------------------------------------------

/**
 * Generates a formatted job description plus an interview script in Portuguese,
 * ready for use by the recruiter during screening calls.
 */
export async function generateJobDescription(
  title: string,
  clientName: string,
  requirements: string,
  salary: string
): Promise<string> {
  if (USE_TEMPLATE_FALLBACK) {
    console.log("[cv-engine] generateJobDescription → template mode");
    return templateJobDescription(title, clientName, requirements, salary);
  }

  const systemPrompt = `Você é um especialista em recursos humanos da agência RHF Talentos.
Crie descrições de vagas profissionais e scripts de entrevista em português brasileiro.

Formato de saída esperado:
1. Descrição da vaga (objetiva, 3-4 parágrafos)
2. Script de entrevista (10 perguntas relevantes para a vaga)

Tom: profissional, direto, adequado ao mercado brasileiro.`;

  const userPrompt = `Crie a descrição e o script de entrevista para a seguinte vaga:

Título: ${title}
Empresa cliente: ${clientName}
Requisitos: ${requirements}
Faixa salarial: ${salary}`;

  try {
    const response = await client!.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new Error("No text block in AI response");
    }
    return block.text.trim();
  } catch (error) {
    console.error("[cv-engine] generateJobDescription error:", error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// suggestChatResponse
// ---------------------------------------------------------------------------

/**
 * Suggests a WhatsApp message response for the recruiter to send via ChatGuru.
 * Keeps tone professional, friendly, and focused on the recruitment process.
 */
export async function suggestChatResponse(
  conversationHistory: string,
  jobContext: string,
  candidateName: string
): Promise<string> {
  if (USE_TEMPLATE_FALLBACK) {
    console.log("[cv-engine] suggestChatResponse → template mode");
    return templateChatResponse(conversationHistory, jobContext, candidateName);
  }

  const systemPrompt = `Você é um assistente de recrutamento da agência RHF Talentos.
Sugira respostas para o recrutador enviar via WhatsApp aos candidatos.

Diretrizes:
- Tom profissional mas acolhedor — como um recrutador experiente e humano
- Mensagens curtas e diretas (máximo 3 parágrafos)
- Foco no processo seletivo
- Use o nome do candidato quando apropriado
- Português brasileiro natural, sem formalidade excessiva
- Não use emojis em excesso — no máximo 1 por mensagem`;

  const userPrompt = `Contexto da vaga: ${jobContext}

Nome do candidato: ${candidateName}

Histórico da conversa:
${conversationHistory}

Sugira a próxima mensagem que o recrutador deve enviar. Escreva apenas a mensagem, sem explicações.`;

  try {
    const response = await client!.messages.create({
      model: MODEL,
      max_tokens: 256,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new Error("No text block in AI response");
    }
    return block.text.trim();
  } catch (error) {
    console.error("[cv-engine] suggestChatResponse error:", error);
    throw error;
  }
}
