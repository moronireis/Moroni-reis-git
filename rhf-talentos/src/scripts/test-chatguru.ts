/**
 * ChatGuru API connectivity test script.
 *
 * Usage:
 *   npm run test-api                          # validate config only
 *   npm run test-api -- --send 5551999999999  # also send a test message
 */

import "dotenv/config";
import { ChatGuruClient } from "../api/chatguru.js";

// ---------------------------------------------------------------------------
// Load config from environment
// ---------------------------------------------------------------------------

const config = {
  endpoint: process.env.CHATGURU_ENDPOINT ?? "",
  key: process.env.CHATGURU_KEY ?? "",
  accountId: process.env.CHATGURU_ACCOUNT_ID ?? "",
  phoneId: process.env.CHATGURU_PHONE_ID ?? "",
};

// ---------------------------------------------------------------------------
// Validate required vars
// ---------------------------------------------------------------------------

function validateConfig(): boolean {
  const missing: string[] = [];
  if (!config.endpoint) missing.push("CHATGURU_ENDPOINT");
  if (!config.key) missing.push("CHATGURU_KEY");
  if (!config.accountId) missing.push("CHATGURU_ACCOUNT_ID");
  if (!config.phoneId) missing.push("CHATGURU_PHONE_ID");

  if (missing.length > 0) {
    console.error("❌  Missing required environment variables:", missing.join(", "));
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("  RHF Talentos — ChatGuru API Connectivity Test");
  console.log("=".repeat(60));

  // 1. Validate config
  if (!validateConfig()) {
    console.log("\nPlease set all required variables in your .env file.");
    process.exit(1);
  }

  // 2. Print config (never print the key)
  console.log("\nConfiguration loaded:");
  console.log(`  Endpoint   : ${config.endpoint}`);
  console.log(`  Account ID : ${config.accountId}`);
  console.log(`  Phone ID   : ${config.phoneId}`);
  console.log(`  API Key    : ${"*".repeat(10)} (hidden)`);

  // 3. Instantiate client
  const client = new ChatGuruClient(config);

  // 4. List all available methods
  console.log("\nAvailable ChatGuruClient methods:");
  const methods = [
    "sendMessage(chatNumber, text, sendDate?)",
    "sendFile(chatNumber, fileUrl, caption)",
    "getMessageStatus(chatNumber, messageId)",
    "addChat(chatNumber, name, text, userId?, dialogId?)",
    "getChatAddStatus(chatNumber, chatAddId)",
    "updateChatName(chatNumber, name)",
    "updateCustomFields(chatNumber, fields)",
    "updateContext(chatNumber, context)",
    "addNote(chatNumber, noteText)",
    "executeDialog(chatNumber, dialogId)",
  ];
  methods.forEach((m) => console.log(`  • ${m}`));

  // 5. Parse --send flag
  const args = process.argv.slice(2);
  const sendFlagIndex = args.indexOf("--send");

  if (sendFlagIndex === -1) {
    console.log(
      "\n✅  Client configured correctly and ready to go."
    );
    console.log(
      "    Use --send <phone_number> to send a test message."
    );
    console.log("    Example: npm run test-api -- --send 5551999999999\n");
    return;
  }

  // 6. --send flag: send a test message to the given number
  const targetNumber = args[sendFlagIndex + 1];
  if (!targetNumber) {
    console.error("\n❌  --send requires a phone number argument.");
    console.error("    Example: npm run test-api -- --send 5551999999999\n");
    process.exit(1);
  }

  console.log(`\nSending test message to ${targetNumber}...`);

  try {
    const result = await client.sendMessage(
      targetNumber,
      "Olá! Esta é uma mensagem de teste do sistema RHF Talentos. Por favor, desconsidere."
    );
    console.log("\n✅  Message sent successfully:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌  Failed to send test message:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
