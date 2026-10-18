import mysql, { type PoolOptions } from 'mysql2/promise';
import { attachDatabasePool } from '@vercel/functions';

const globalForMysql = globalThis as unknown as { mysqlPool?: mysql.Pool };

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  let config: PoolOptions;
  if (!connectionString) {
    config = { host: '127.0.0.1', user: 'unconfigured', password: 'unconfigured', database: 'unconfigured', connectionLimit: 3 };
  } else {
    const parsed = new URL(connectionString);
    config = {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: decodeURIComponent(parsed.pathname.replace(/^\//, '')),
      waitForConnections: true,
      connectionLimit: 3,
      maxIdle: 2,
      idleTimeout: 60000,
      queueLimit: 10,
      enableKeepAlive: true,
      ssl: parsed.searchParams.get('ssl') === 'true' ? { rejectUnauthorized: true } : undefined
    };
  }
  const pool = mysql.createPool(config);
  try { attachDatabasePool(pool); } catch { /* local development / unsupported runtime */ }
  return pool;
}

export const db = globalForMysql.mysqlPool ?? createPool();
if (process.env.NODE_ENV !== 'production') globalForMysql.mysqlPool = db;

function assertDatabaseConfigured() { if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured. Add your MySQL connection string in Vercel Environment Variables.'); }

export async function getSettings() {
  assertDatabaseConfigured();
  const [rows] = await db.query<any[]>('SELECT settings_json FROM site_settings WHERE id = 1 LIMIT 1');
  return rows[0]?.settings_json ?? {
    churchName: 'La Gloire de Dieu', address: '', cityCountry: '', phone: '', prayerLine: '', email: ''
  };
}

export async function getCollection(collection: string) {
  assertDatabaseConfigured();
  const [rows] = await db.execute<any[]>(
    'SELECT payload FROM site_records WHERE collection_name = ? ORDER BY created_at DESC LIMIT 1000', [collection]
  );
  return rows.map((row) => typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload);
}

export async function insertRecord(collection: string, item: any) {
  assertDatabaseConfigured();
  await db.execute('INSERT INTO site_records (collection_name, record_id, payload) VALUES (?, ?, ?)',
    [collection, item.id, JSON.stringify(item)]);
}

export async function updateRecord(collection: string, id: string, update: (item: any) => any | null) {
  assertDatabaseConfigured();
  const [rows] = await db.execute<any[]>('SELECT payload FROM site_records WHERE collection_name = ? AND record_id = ? LIMIT 1', [collection, id]);
  if (!rows.length) return null;
  const current = typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
  const next = update(current);
  if (!next) return null;
  await db.execute('UPDATE site_records SET payload = ? WHERE collection_name = ? AND record_id = ?', [JSON.stringify(next), collection, id]);
  return next;
}

export async function deleteRecord(collection: string, id: string) {
  assertDatabaseConfigured();
  const [result] = await db.execute<any>('DELETE FROM site_records WHERE collection_name = ? AND record_id = ?', [collection, id]);
  return result.affectedRows > 0;
}
