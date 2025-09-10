function isFiniteNumber(x) {
  return typeof x === 'number' && Number.isFinite(x);
}

function toNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function validateLatLon(lat, lon) {
  const la = toNumber(lat), lo = toNumber(lon);
  if (la === null || lo === null) return { ok: false, msg: 'lat/lon must be numbers' };
  if (la < -90 || la > 90) return { ok: false, msg: 'lat out of range (-90..90)' };
  if (lo < -180 || lo > 180) return { ok: false, msg: 'lon out of range (-180..180)' };
  return { ok: true, lat: la, lon: lo };
}

module.exports = { isFiniteNumber, toNumber, validateLatLon };
