const axios = require('axios');
const { getSecret } = require('../models/secrets.model');

async function getCurrent(lat, lon, units = 'metric') {
  const key = await getSecret('openweathermap', 'api_key');
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const { data } = await axios.get(url, { params: { lat, lon, appid: key, units } });
  return {
    coord: data.coord,
    name: data.name,
    dt: data.dt,
    timezone: data.timezone,
    main: data.main,
    wind: data.wind,
    weather: data.weather,
    clouds: data.clouds,
    visibility: data.visibility
  };
}

// Try One Call 3.0 (hourly 48h). If unavailable on free tier, fall back to 5 day/3-hour forecast.
async function getHourly(lat, lon, units = 'metric', hours = 12) {
  const key = await getSecret('openweathermap', 'api_key');

  try {
    const url = 'https://api.openweathermap.org/data/3.0/onecall';
    const { data } = await axios.get(url, {
      params: { lat, lon, appid: key, units, exclude: 'minutely,daily,alerts,current' }
    });
    const hourly = (data.hourly || []).slice(0, hours);
    return { provider: 'onecall3', lat: data.lat, lon: data.lon, timezone: data.timezone, hourly };
  } catch (e) {
    // Fallback: 5 day / 3 hour forecast
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const { data } = await axios.get(url, { params: { lat, lon, appid: key, units } });
    const list = (data.list || []).slice(0, Math.ceil(hours / 3));
    const hourlyApprox = list.map(item => ({
      dt: item.dt,
      main: item.main,
      weather: item.weather,
      clouds: item.clouds,
      wind: item.wind,
      visibility: item.visibility,
      pop: item.pop
    }));
    return { provider: 'forecast3h', city: data.city, hourly_3h: hourlyApprox };
  }
}

module.exports = { getCurrent, getHourly };
