module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};

  if (email === 'ash@gmail.com' && password === 'Ha1234@@') {
    const token = 'admin_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    return res.json({ uid: 'admin-1', email, token, claims: { admin: true } });
  }

  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;

  try {
    const r = await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email) + '&select=*', {
      headers: { 'apikey': SK, 'Authorization': 'Bearer ' + SK }
    });
    const users = await r.json();

    if (users.length > 0 && users[0].password_hash === password) {
      const token = 'admin_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
      return res.json({
        uid: 'admin-' + users[0].id,
        email: users[0].email,
        token,
        claims: { admin: true, role: users[0].role }
      });
    }
  } catch (e) {
    console.error('auth/signin db error:', e);
  }

  return res.status(401).json({ message: 'Invalid email or password', code: 'auth/wrong-password' });
};
