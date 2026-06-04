-- =============================================================================
-- RHF Talentos — Database Schema
-- Target: PostgreSQL via Supabase
-- =============================================================================

-- ---------------------------------------------------------------------------
-- candidates
-- Stores all recruitment candidates ingested from ChatGuru or Pandapé.
-- ---------------------------------------------------------------------------
CREATE TABLE candidates (
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
);

-- ---------------------------------------------------------------------------
-- jobs
-- Open positions and their requirements.
-- ---------------------------------------------------------------------------
CREATE TABLE jobs (
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
);

-- ---------------------------------------------------------------------------
-- cvs
-- AI-generated CV summaries linking a candidate to a specific job.
-- ---------------------------------------------------------------------------
CREATE TABLE cvs (
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
);

-- ---------------------------------------------------------------------------
-- sync_log
-- Audit trail for all external integrations (Pandapé, ChatGuru, system).
-- ---------------------------------------------------------------------------
CREATE TABLE sync_log (
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
);

-- ---------------------------------------------------------------------------
-- messages
-- All inbound and outbound WhatsApp messages via ChatGuru.
-- ---------------------------------------------------------------------------
CREATE TABLE messages (
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
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_candidates_phone    ON candidates(phone);
CREATE INDEX idx_candidates_status   ON candidates(status);
CREATE INDEX idx_jobs_status         ON jobs(status);
CREATE INDEX idx_messages_phone      ON messages(phone);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_sync_log_created_at ON sync_log(created_at);
