/**
 * RHF Talentos — Entry point
 *
 * Starts the ChatGuru webhook server and logs startup information.
 */

import "dotenv/config";
import { startWebhookServer } from "./webhooks/chatguru-webhook.js";

const PORT = parseInt(process.env.WEBHOOK_PORT ?? "3333", 10);

console.log("=".repeat(60));
console.log("  RHF Talentos — AI Recruitment Automation");
console.log("=".repeat(60));
console.log(`  Environment : ${process.env.NODE_ENV ?? "development"}`);
console.log(`  Webhook port: ${PORT}`);
console.log(
  `  ChatGuru    : ${process.env.CHATGURU_ACCOUNT_ID ? "configured" : "NOT configured"}`
);
console.log(
  `  Anthropic   : ${process.env.ANTHROPIC_API_KEY ? "configured" : "NOT configured"}`
);
console.log(
  `  Supabase    : ${process.env.SUPABASE_URL ? "configured" : "NOT configured"}`
);
console.log("=".repeat(60));

startWebhookServer(PORT);
