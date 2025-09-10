const { validateLatLon } = require('./functions');

function validateWeatherQuery(req, res, next) {
  const { lat, lon } = req.query;
  const check = validateLatLon(lat, lon);
  if (!check.ok) return res.status(400).json({ error: check.msg });
  req.coords = { lat: check.lat, lon: check.lon };
  next();
}

module.exports = { validateWeatherQuery };
