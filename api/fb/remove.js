module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { path } = req.body || {};
  if (!path) return res.status(400).json({ error: 'path required' });

  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;
  const headers = { 'apikey': SK, 'Authorization': 'Bearer ' + SK };

  try {
    const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    if (parts.length < 2) return res.json({ ok: true });

    const table = parts[0];
    const validTables = ['orders', 'payments', 'visitors', 'admin_users'];
    if (!validTables.includes(table)) return res.json({ ok: true });

    const id = parts[1];
    await fetch(SB + '/rest/v1/' + table + '?id=eq.' + id, {
      method: 'DELETE', headers
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error('fb/remove error:', e);
    return res.status(500).json({ error: e.message });
  }
};
