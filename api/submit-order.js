const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { watch_id, watch_name, full_name, phone, civil_id, governorate, area, address_details } = req.body;

    if (!full_name || !phone || !civil_id || !governorate || !area) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        watch_id: watch_id || 5,
        watch_name: watch_name || '',
        full_name,
        phone,
        civil_id,
        governorate,
        area,
        address_details: address_details || '',
        status: 'pending'
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.json({ success: true, order: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
