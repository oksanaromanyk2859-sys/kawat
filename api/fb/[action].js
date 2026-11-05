module.exports = async (req, res) => {
  const { action } = req.query;
  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;
  const baseH = { 'apikey': SK, 'Authorization': 'Bearer ' + SK };
  const writeH = { ...baseH, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
  const validTables = ['orders', 'payments', 'visitors', 'admin_users'];

  function parsePath(p) {
    return (p || '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  }

  async function readData(path) {
    const parts = parsePath(path);
    if (parts.length === 0) return null;
    const table = parts[0];
    if (!validTables.includes(table)) return null;

    if (parts.length === 1) {
      const r = await fetch(SB + '/rest/v1/' + table + '?select=*&order=created_at.desc', { headers: baseH });
      const data = await r.json();
      const value = {};
      for (const row of data) value[row.id] = row;
      return value;
    }
    if (parts.length === 2) {
      const r = await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1] + '&select=*', { headers: baseH });
      const data = await r.json();
      return data[0] || null;
    }
    if (parts.length >= 3) {
      const field = parts[2];
      const r = await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1] + '&select=' + field, { headers: baseH });
      const data = await r.json();
      return data[0] ? data[0][field] : null;
    }
    return null;
  }

  try {
    if (action === 'read') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { path } = req.body || {};
      return res.json({ value: await readData(path) });
    }

    if (action === 'poll') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      return res.json({ value: await readData(req.query.path || '') });
    }

    if (action === 'set') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { path, value } = req.body || {};
      const parts = parsePath(path);
      if (parts.length < 1) return res.json({ ok: true });
      const table = parts[0];
      if (!validTables.includes(table)) return res.json({ ok: true });

      if (parts.length === 2) {
        const check = await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1] + '&select=id', { headers: baseH });
        const existing = await check.json();
        if (existing.length > 0) {
          await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1], { method: 'PATCH', headers: writeH, body: JSON.stringify(value) });
        } else {
          const insertData = typeof value === 'object' && value !== null ? { ...value } : { value };
          await fetch(SB + '/rest/v1/' + table, { method: 'POST', headers: writeH, body: JSON.stringify(insertData) });
        }
      } else if (parts.length >= 3) {
        await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1], { method: 'PATCH', headers: writeH, body: JSON.stringify({ [parts[2]]: value }) });
      }
      return res.json({ ok: true });
    }

    if (action === 'update') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { path, value } = req.body || {};
      const parts = parsePath(path);
      if (parts.length < 2) return res.json({ ok: true });
      const table = parts[0];
      if (!validTables.includes(table)) return res.json({ ok: true });

      if (parts.length === 2 && typeof value === 'object' && value !== null) {
        await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1], { method: 'PATCH', headers: writeH, body: JSON.stringify(value) });
      } else if (parts.length >= 3) {
        await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1], { method: 'PATCH', headers: writeH, body: JSON.stringify({ [parts[2]]: value }) });
      }
      return res.json({ ok: true });
    }

    if (action === 'remove') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { path } = req.body || {};
      const parts = parsePath(path);
      if (parts.length < 2) return res.json({ ok: true });
      const table = parts[0];
      if (!validTables.includes(table)) return res.json({ ok: true });
      await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1], { method: 'DELETE', headers: baseH });
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: 'Unknown action: ' + action });
  } catch (e) {
    console.error('fb/' + action + ' error:', e);
    return res.status(500).json({ error: e.message });
  }
};
