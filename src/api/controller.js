const { forwardGeocode } = require('./services/mapbox');
const { getCurrent, getHourly } = require('./services/openweather');
const { createHistory, listHistory } = require('./models/weather.model');

async function geocode(req, res) {
  try {
    const { address } = req.body;
    if (!address || address.trim().length < 3) return res.status(400).json({ error: 'Address required' });
    const result = await forwardGeocode(address.trim());
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Geocoding failed' });
  }
}

async function currentWeather(req, res) {
  try {
    const { lat, lon } = req.coords;
    const units = (req.query.units || 'metric');
    const data = await getCurrent(lat, lon, units);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message || 'OpenWeather current failed' });
  }
}

async function hourlyWeather(req, res) {
  try {
    const { lat, lon } = req.coords;
    const units = (req.query.units || 'metric');
    const hours = Math.max(1, Math.min(48, Number(req.query.hours ?? 12)));
    const data = await getHourly(lat, lon, units, hours);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message || 'OpenWeather hourly failed' });
  }
}

async function saveHistory(req, res) {
  try {
    const { address, lat, lon, units = 'metric', hours = 12, method = 'fetch' } = req.body || {};
    if (!address) return res.status(400).json({ error: 'address is required' });

    const la = Number(lat), lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return res.status(400).json({ error: 'lat/lon must be numbers' });

    // compute fresh results (ensures request+result saved server-side)
    const current = await getCurrent(la, lo, units);
    const hourly = await getHourly(la, lo, units, hours);

    const id = await createHistory({
      address,
      lat: la,
      lon: lo,
      resultJson: { current, hourly },
      method
    });

    // If the request was an HTML form post, return a tiny HTML redirect/summary
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
      res.set('Content-Type', 'text/html');
      res.send(`<html><body><script>window.location.href='/'</script>Saved history id ${id}</body></html>`);
      return;
    }

    res.json({ id, saved: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Save failed' });
  }
}

async function history(req, res) {
  try {
    const rows = await listHistory({ limit: Number(req.query.limit ?? 50) });
    res.json({ items: rows });
  } catch (e) {
    res.status(500).json({ error: e.message || 'History failed' });
  }
}

module.exports = {
  geocode,
  currentWeather,
  hourlyWeather,
  saveHistory,
  history
};
