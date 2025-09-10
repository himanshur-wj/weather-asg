const axios = require('axios');
const { getSecret } = require('../models/secrets.model');

async function forwardGeocode(address) {
  const token = await getSecret('mapbox', 'access_token');
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
  const { data } = await axios.get(url, { params: { access_token: token, limit: 1 } });
  if (!data.features?.length) throw new Error('No geocoding result for that address');
  const f = data.features[0];
  const [lon, lat] = f.center; // Mapbox returns [lon, lat]
  return { lat, lon, place_name: f.place_name };
}

module.exports = { forwardGeocode };
