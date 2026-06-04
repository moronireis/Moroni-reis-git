/**
 * Contacts API — Vercel Serverless Function
 *
 * GET /api/contacts — list all candidates
 * GET /api/contacts?status=new — filter by status
 */

const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { status, limit = '50' } = req.query;
    let query = `candidates?order=created_at.desc&limit=${limit}`;
    if (status) query += `&status=eq.${status}`;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    });
    const data = await response.json();
    return res.status(200).json({ status: 'ok', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
