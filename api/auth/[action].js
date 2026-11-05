module.exports = async (req, res) => {
  const { action } = req.query;
  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;

  try {
    if (action === 'signin') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { email, password } = req.body || {};

      if (email === 'ash@gmail.com' && password === 'Ha1234@@') {
        const token = 'admin_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
        return res.json({ uid: 'admin-1', email, token, claims: { admin: true } });
      }

      const r = await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email) + '&select=*', {
        headers: { 'apikey': SK, 'Authorization': 'Bearer ' + SK }
      });
      const users = await r.json();
      if (users.length > 0 && users[0].password_hash === password) {
        const token = 'admin_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
        return res.json({ uid: 'admin-' + users[0].id, email: users[0].email, token, claims: { admin: true, role: users[0].role } });
      }
      return res.status(401).json({ message: 'Invalid email or password', code: 'auth/wrong-password' });
    }

    if (action === 'create') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ message: 'Email and password required', code: 'auth/invalid' });

      const headers = { 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
      const check = await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email) + '&select=id', {
        headers: { 'apikey': SK, 'Authorization': 'Bearer ' + SK }
      });
      const existing = await check.json();
      if (existing.length > 0) return res.status(400).json({ message: 'Email already exists', code: 'auth/email-already-in-use' });

      const r = await fetch(SB + '/rest/v1/admin_users', {
        method: 'POST', headers, body: JSON.stringify({ email, password_hash: password, role: 'admin' })
      });
      const data = await r.json();
      const user = data[0];
      const token = 'admin_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
      return res.json({ uid: 'admin-' + user.id, email: user.email, token, claims: { admin: true, role: 'admin' } });
    }

    if (action === 'signout') {
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: 'Unknown action: ' + action });
  } catch (e) {
    console.error('auth/' + action + ' error:', e);
    return res.status(500).json({ error: e.message });
  }
};
