#!/bin/bash
# ============================================
# AZEREDO IA — Setup Automático
# Executa APÓS criar projeto no Supabase
# ============================================
# Uso: bash scripts/setup.sh

set -e

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Variáveis não definidas."
  echo "   Exporte antes de rodar:"
  echo "   export SUPABASE_URL=https://xxx.supabase.co"
  echo "   export SUPABASE_SERVICE_ROLE_KEY=eyJhbGci..."
  exit 1
fi

SB_URL="$SUPABASE_URL"
SB_KEY="$SUPABASE_SERVICE_ROLE_KEY"
AUTH_HEADER="Authorization: Bearer $SB_KEY"
API="$SB_URL/rest/v1"

echo ""
echo "🚀 AZEREDO IA — Setup iniciando..."
echo "   Supabase: $SB_URL"
echo ""

# ---- HELPER: executar SQL via REST ----
run_sql() {
  local label="$1"
  local sql="$2"
  echo -n "   → $label... "
  RESULT=$(curl -s -X POST "$SB_URL/rest/v1/rpc/exec_sql" \
    -H "Content-Type: application/json" \
    -H "$AUTH_HEADER" \
    -H "apikey: $SB_KEY" \
    -d "{\"sql\": $(echo "$sql" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}")
  
  if echo "$RESULT" | grep -q '"error"'; then
    echo "❌"
    echo "     $RESULT"
  else
    echo "✅"
  fi
}

# ---- 1. Executar schema ----
echo "📋 Passo 1: Executando schema SQL..."
SCHEMA=$(cat supabase/schema.sql)
# Split and run via pg endpoint
curl -s -X POST "$SB_URL/pg/query" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -H "apikey: $SB_KEY" \
  -d "{\"query\": $(cat supabase/schema.sql | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')}" > /tmp/schema_result.json
cat /tmp/schema_result.json | head -c 200
echo ""

echo ""
echo "✅ Setup SQL executado."
echo ""
echo "⚙️  Próximos passos manuais necessários:"
echo "   1. Ir ao Supabase SQL Editor e rodar:"
echo "      → supabase/schema.sql"
echo "      → supabase/seed-brands.sql"
echo "      → supabase/seed-templates.sql"
echo "   2. Criar usuário admin em Authentication → Users → Invite"
echo "      Email: moroni@reisia.com.br (ou o email desejado)"
