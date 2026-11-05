module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { path } = req.body || {};
  if (path === undefined) return res.status(400).json({ error: 'path required' });

  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;
  const headers = { 'apikey': SK, 'Authorization': 'Bearer ' + SK };

  try {
    const parts = (path || '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    if (parts.length === 0) return res.json({ value: null });

    const table = parts[0];
    const validTables = ['orders', 'payments', 'visitors', 'admin_users'];
    if (!validTables.includes(table)) return res.json({ value: null });

    if (parts.length === 1) {
      const r = await fetch(SB + '/rest/v1/' + table + '?select=*&order=created_at.desc', { headers });
      const data = await r.json();
      const value = {};
      for (const row of data) value[row.id] = row;
      return res.json({ value });
    }

    if (parts.length === 2) {
      const id = parts[1];
      const r = await fetch(SB + '/rest/v1/' + table + '?id=eq.' + id + '&select=*', { headers });
      const data = await r.json();
      return res.json({ value: data[0] || null });
    }

    if (parts.length >= 3) {
      const id = parts[1];
      const field = parts[2];
      const r = await fetch(SB + '/rest/v1/' + table + '?id=eq.' + id + '&select=' + field, { headers });
      const data = await r.json();
      return res.json({ value: data[0] ? data[0][field] : null });
    }

    return res.json({ value: null });
  } catch (e) {
    console.error('fb/read error:', e);
    return res.status(500).json({ error: e.message });
  }
};
