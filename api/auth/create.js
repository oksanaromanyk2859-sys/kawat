module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required', code: 'auth/invalid' });

  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;
  const headers = { 'apikey': SK, 'Authorization': 'Bearer ' + SK, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };

  try {
    const check = await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email) + '&select=id', {
      headers: { 'apikey': SK, 'Authorization': 'Bearer ' + SK }
    });
    const existing = await check.json();

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists', code: 'auth/email-already-in-use' });
    }

    const r = await fetch(SB + '/rest/v1/admin_users', {
      method: 'POST', headers,
      body: JSON.stringify({ email, password_hash: password, role: 'admin' })
    });
    const data = await r.json();
    const user = data[0];
    const token = 'admin_' + Date.now().toString(36) + Math.random().toString(36).slice(2);

    return res.json({
      uid: 'admin-' + user.id,
      email: user.email,
      token,
      claims: { admin: true, role: 'admin' }
    });
  } catch (e) {
    console.error('auth/create error:', e);
    return res.status(500).json({ message: e.message, code: 'auth/internal' });
  }
};
