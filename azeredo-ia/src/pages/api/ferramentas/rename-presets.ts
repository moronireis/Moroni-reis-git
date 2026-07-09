import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

/**
 * Presets do Renomeador de Fotos, por fábrica.
 * Guardados em az_settings (key = 'rename_presets') como { [nomeFabrica]: rule }.
 *
 * GET  → { presets: { [nome]: rule } }
 * POST { name, rule }        → salva/atualiza preset
 * POST { name, delete:true } → remove preset
 */

const KEY = 'rename_presets';

type Rule =
  | { type: 'segment'; separator: string; index: number }
  | { type: 'regex'; pattern: string; group: number };

function validRule(rule: any): rule is Rule {
  if (!rule || typeof rule !== 'object') return false;
  if (rule.type === 'segment') {
    return typeof rule.separator === 'string' && rule.separator.length > 0 &&
      Number.isInteger(rule.index) && rule.index >= 0;
  }
  if (rule.type === 'regex') {
    if (typeof rule.pattern !== 'string' || !Number.isInteger(rule.group) || rule.group < 1) return false;
    try { new RegExp(rule.pattern); return true; } catch { return false; }
  }
  return false;
}

async function readPresets(sb: ReturnType<typeof createServerClient>): Promise<Record<string, Rule>> {
  const { data } = await sb.from('az_settings').select('value').eq('key', KEY).maybeSingle();
  return (data?.value && typeof data.value === 'object') ? data.value as Record<string, Rule> : {};
}

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const presets = await readPresets(createServerClient());
  return new Response(JSON.stringify({ presets }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  let body: any;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '';
  if (!name) return new Response(JSON.stringify({ error: 'Nome do preset é obrigatório' }), { status: 400 });

  const sb = createServerClient();
  const presets = await readPresets(sb);

  if (body.delete === true) {
    delete presets[name];
  } else {
    if (!validRule(body.rule)) {
      return new Response(JSON.stringify({ error: 'Regra inválida' }), { status: 400 });
    }
    presets[name] = body.rule;
  }

  const { error } = await sb.from('az_settings').upsert({
    key: KEY, value: presets, updated_at: new Date().toISOString(),
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ presets }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
