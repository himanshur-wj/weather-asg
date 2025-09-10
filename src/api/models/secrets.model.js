const { pool } = require('../../config/database');

const CACHE = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getSecret(provider, keyName) {
  const k = `${provider}:${keyName}`;
  const hit = CACHE.get(k);
  if (hit && Date.now() - hit.ts < TTL_MS) return hit.value;

  const [rows] = await pool.query(
    'SELECT key_value FROM secrets WHERE provider=? AND key_name=? ORDER BY id DESC LIMIT 1',
    [provider, keyName]
  );
  if (!rows.length) {
    throw new Error(`Missing secret: ${provider}.${keyName} — insert it into the "secrets" table`);
  }
  const value = rows[0].key_value;
  CACHE.set(k, { value, ts: Date.now() });
  return value;
}

module.exports = { getSecret };
