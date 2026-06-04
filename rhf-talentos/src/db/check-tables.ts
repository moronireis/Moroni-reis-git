/**
 * Check what tables and columns exist in the Supabase instance.
 */

import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";
const endpoint = `${SUPABASE_URL}/pg/query`;

async function query(label: string, sql: string): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  console.log(`\n--- ${label} (${res.status}) ---`);
  console.log(text);
}

await query(
  "Tables in public schema",
  `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
);

await query(
  "Columns in messages table",
  `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages' ORDER BY ordinal_position`
);

await query(
  "Existing indexes",
  `SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname`
);
