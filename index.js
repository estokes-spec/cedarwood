const express = require('express');
const sql = require('mssql');
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.PROXY_API_KEY || 'Cedarwood5324414';

const sqlConfig = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: parseInt(process.env.SQL_PORT || '1433', 10),
  options: { encrypt: true, trustServerCertificate: false, connectTimeout: 30000, requestTimeout: 30000 }
};

app.use((req, res, next) => {
  if (req.path === '/health') return next();
  const key = req.headers['x-api-key'] || req.query.key;
  if (key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

app.get('/health', (req, res) => res.json({ ok: true, server: sqlConfig.server, db: sqlConfig.database }));

app.get('/tables', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME`);
    await pool.close();
    res.json({ success: true, tables: result.recordset.map(r => r.TABLE_NAME) });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/peek/:table', async (req, res) => {
  const table = req.params.table.replace(/[^\w]/g, '');
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(`SELECT TOP 10 * FROM [${table}]`);
    await pool.close();
    res.json({ success: true, rows: result.recordset });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/query', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q' });
  if (!/^\s*SELECT\s/i.test(q)) return res.status(400).json({ error: 'Only SELECT allowed' });
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(q);
    await pool.close();
    res.json({ success: true, rowCount: result.recordset.length, rows: result.recordset });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}, server: ${sqlConfig.server}`));
