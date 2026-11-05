const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        page: 'knet-payment',
        ip_address: req.headers['x-forwarded-for'] || '',
        user_agent: req.headers['user-agent'] || '',
        referrer: req.headers['referer'] || ''
      })
    });
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: true });
  }
};
