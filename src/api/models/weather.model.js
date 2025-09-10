const { pool } = require('../../config/database');

async function createHistory({ address, lat, lon, resultJson, method = 'fetch' }) {
  const [res] = await pool.query(
    `INSERT INTO weather_history (address, lat, lon, result_json, method)
     VALUES (?,?,?,?,?)`,
    [address ?? null, lat ?? null, lon ?? null, JSON.stringify(resultJson ?? {}), method]
  );
  return res.insertId;
}

async function listHistory({ limit = 50 } = {}) {
  const [rows] = await pool.query(
    `SELECT id, address, lat, lon, created_at, method,
            JSON_EXTRACT(result_json, '$.current.main.temp') AS last_temp,
            JSON_EXTRACT(result_json, '$.current.weather[0].description') AS last_desc
     FROM weather_history
     ORDER BY id DESC
     LIMIT ?`,
    [Number(limit)]
  );
  return rows;
}

module.exports = { createHistory, listHistory };
