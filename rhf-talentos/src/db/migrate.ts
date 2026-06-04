/**
 * RHF Talentos — Database Migration Runner
 *
 * Runs each DDL statement against the Cloudfy Supabase instance
 * via the /pg/query HTTP endpoint.
 *
 * Usage: npx tsx src/db/migrate.ts
 */

import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env");
  process.exit(1);
}

const endpoint = `${SUPABASE_URL}/pg/query`;

async function runSQL(label: string, sql: string): Promise<void> {
  console.log(`\nRunning: ${label}...`);
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
  if (!res.ok) {
    console.error(`  FAILED (${res.status}): ${text}`);
    throw new Error(`Migration failed: ${label}`);
  }
  console.log(`  OK (${res.status})`);
}

// ---------------------------------------------------------------------------
// Migration statements — each run separately
// ---------------------------------------------------------------------------

const migrations: Array<{ label: string; sql: string }> = [
  {
    label: "CREATE TABLE candidates",
    sql: `
      CREATE TABLE IF NOT EXISTS candidates (
        id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        name               TEXT        NOT NULL,
        phone              TEXT        NOT NULL UNIQUE,
        email              TEXT,
        location           TEXT,
        experience_years   INTEGER,
        education          TEXT,
        skills             TEXT[],
        pandape_id         TEXT,
        chatguru_chat_id   TEXT,
        chatguru_phone_id  TEXT,
        status             TEXT        DEFAULT 'new'
                                       CHECK (status IN (
                                         'new','screening','qualified',
                                         'interview','presented','hired','rejected'
                                       )),
        raw_data           JSONB,
        created_at         TIMESTAMPTZ DEFAULT now(),
        updated_at         TIMESTAMPTZ DEFAULT now()
      )
    `,
  },
  {
    label: "CREATE TABLE jobs",
    sql: `
      CREATE TABLE IF NOT EXISTS jobs (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        title         TEXT        NOT NULL,
        client_name   TEXT        NOT NULL,
        description   TEXT,
        requirements  TEXT,
        salary_range  TEXT,
        location      TEXT,
        status        TEXT        DEFAULT 'open'
                                  CHECK (status IN (
                                    'open','screening','presenting','closed','cancelled'
                                  )),
        recruiter     TEXT,
        pandape_id    TEXT,
        form_data     JSONB,
        created_at    TIMESTAMPTZ DEFAULT now(),
        updated_at    TIMESTAMPTZ DEFAULT now()
      )
    `,
  },
  {
    label: "CREATE TABLE cvs",
    sql: `
      CREATE TABLE IF NOT EXISTS cvs (
        id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        candidate_id            UUID        REFERENCES candidates(id),
        job_id                  UUID        REFERENCES jobs(id),
        ai_summary              TEXT,
        professional_experience TEXT,
        education_text          TEXT,
        skills_text             TEXT,
        pdf_url                 TEXT,
        status                  TEXT        DEFAULT 'draft'
                                            CHECK (status IN (
                                              'draft','reviewed','approved','sent'
                                            )),
        sent_at                 TIMESTAMPTZ,
        created_at              TIMESTAMPTZ DEFAULT now()
      )
    `,
  },
  {
    label: "CREATE TABLE sync_log",
    sql: `
      CREATE TABLE IF NOT EXISTS sync_log (
        id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        source        TEXT        NOT NULL
                                  CHECK (source IN ('pandape','chatguru','system')),
        action        TEXT        NOT NULL,
        entity_type   TEXT,
        entity_id     TEXT,
        status        TEXT        DEFAULT 'success'
                                  CHECK (status IN ('success','error','pending')),
        payload       JSONB,
        error_message TEXT,
        created_at    TIMESTAMPTZ DEFAULT now()
      )
    `,
  },
  {
    // NOTE: The shared Supabase instance already has a 'messages' table used by
    // the hub platform. RHF uses 'rhf_messages' to avoid collision.
    label: "CREATE TABLE rhf_messages",
    sql: `
      CREATE TABLE IF NOT EXISTS rhf_messages (
        id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        candidate_id          UUID        REFERENCES candidates(id),
        phone                 TEXT        NOT NULL,
        direction             TEXT        NOT NULL
                                          CHECK (direction IN ('inbound','outbound')),
        content               TEXT,
        message_type          TEXT        DEFAULT 'chat'
                                          CHECK (message_type IN (
                                            'chat','image','ptt','file'
                                          )),
        chatguru_message_id   TEXT,
        chatguru_chat_id      TEXT,
        raw_webhook           JSONB,
        created_at            TIMESTAMPTZ DEFAULT now()
      )
    `,
  },
  {
    label: "CREATE INDEX idx_candidates_phone (skip if exists)",
    sql: `CREATE INDEX IF NOT EXISTS idx_candidates_phone ON candidates(phone)`,
  },
  {
    label: "CREATE INDEX idx_candidates_status (skip if exists)",
    sql: `CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status)`,
  },
  {
    label: "CREATE INDEX idx_jobs_status (skip if exists)",
    sql: `CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)`,
  },
  {
    label: "CREATE INDEX idx_rhf_messages_phone",
    sql: `CREATE INDEX IF NOT EXISTS idx_rhf_messages_phone ON rhf_messages(phone)`,
  },
  {
    label: "CREATE INDEX idx_rhf_messages_created_at",
    sql: `CREATE INDEX IF NOT EXISTS idx_rhf_messages_created_at ON rhf_messages(created_at)`,
  },
  {
    label: "CREATE INDEX idx_sync_log_created_at",
    sql: `CREATE INDEX IF NOT EXISTS idx_sync_log_created_at ON sync_log(created_at)`,
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("  RHF Talentos — Database Migration");
  console.log(`  Target: ${SUPABASE_URL}`);
  console.log("=".repeat(60));

  for (const m of migrations) {
    await runSQL(m.label, m.sql);
  }

  console.log("\n" + "=".repeat(60));
  console.log("  Migration complete.");
  console.log("=".repeat(60) + "\n");
}

main().catch((err) => {
  console.error("\nMigration aborted:", err.message);
  process.exit(1);
});
