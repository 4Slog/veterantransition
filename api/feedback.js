export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, message, rating, resume_type, page_url } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message required' });

  const resp = await fetch(`${process.env.SUPABASE_URL}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email, message, rating, resume_type, page_url })
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error('Feedback insert error:', err);
    return res.status(500).json({ error: 'Failed to save feedback' });
  }

  res.status(200).json({ ok: true });
}
