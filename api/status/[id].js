const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { id } = req.query;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${id}&select=status`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    if (data.length > 0) {
      res.json({ status: data[0].status });
    } else {
      res.json({ status: 'pending' });
    }
  } catch (err) {
    res.json({ status: 'pending' });
  }
};
