/**
 * ChatGuru Webhook Handler
 *
 * Receives inbound webhook payloads from ChatGuru (WhatsApp messages,
 * chat events, etc.) and logs them for processing.
 *
 * POST /webhook/chatguru  — receive ChatGuru events
 * GET  /health            — health check
 */

import express, { Request, Response } from "express";

// ---------------------------------------------------------------------------
// ChatGuru webhook payload shape
// ---------------------------------------------------------------------------

export interface ChatGuruWebhookPayload {
  // Contact info
  nome?: string;
  celular?: string;

  // Message content
  texto_mensagem?: string;
  tipo_mensagem?: string;

  // Chat identifiers
  phone_id?: string;
  chat_id?: string;
  chat_created?: string;

  // Timestamps
  datetime_post?: string;

  // Metadata
  tags?: string;
  campos_personalizados?: string;
  responsavel_nome?: string;
  link_chat?: string;

  // Catch-all for any additional fields
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

export const app = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * GET /health
 * Simple liveness check for load balancers and monitoring.
 */
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "rhf-talentos-webhook",
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /webhook/chatguru
 * Receives webhook events from ChatGuru.
 * Parses the known fields, logs the full payload, and returns 200.
 */
app.post("/webhook/chatguru", (req: Request, res: Response) => {
  const payload = req.body as ChatGuruWebhookPayload;

  // Log the full raw payload for debugging and future processing
  console.log("[webhook] ChatGuru event received:", {
    timestamp: new Date().toISOString(),
    nome: payload.nome,
    celular: payload.celular,
    tipo_mensagem: payload.tipo_mensagem,
    phone_id: payload.phone_id,
    chat_id: payload.chat_id,
    chat_created: payload.chat_created,
    datetime_post: payload.datetime_post,
    tags: payload.tags,
    campos_personalizados: payload.campos_personalizados,
    responsavel_nome: payload.responsavel_nome,
    link_chat: payload.link_chat,
    // Truncate message text for log readability
    texto_mensagem: payload.texto_mensagem?.substring(0, 200),
    raw: payload,
  });

  // TODO (Phase 2): persist to messages table, match candidate by phone,
  // trigger AI response suggestion, update candidate status.

  res.status(200).json({ received: true });
});

// ---------------------------------------------------------------------------
// Server startup
// ---------------------------------------------------------------------------

export function startWebhookServer(port?: number): void {
  const webhookPort = port ?? parseInt(process.env.WEBHOOK_PORT ?? "3333", 10);

  app.listen(webhookPort, () => {
    console.log(`[webhook] ChatGuru webhook server running on port ${webhookPort}`);
    console.log(`[webhook] Endpoints:`);
    console.log(`[webhook]   POST http://localhost:${webhookPort}/webhook/chatguru`);
    console.log(`[webhook]   GET  http://localhost:${webhookPort}/health`);
  });
}
