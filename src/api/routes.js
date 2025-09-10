const express = require('express');
const router = express.Router();
const ctrl = require('./controller');
const { validateWeatherQuery } = require('./validators');

// API endpoints
router.post('/api/geocode', ctrl.geocode);
router.get('/api/weather/current', validateWeatherQuery, ctrl.currentWeather);
router.get('/api/weather/hourly', validateWeatherQuery, ctrl.hourlyWeather);
router.post('/api/history', ctrl.saveHistory);
router.get('/api/history', ctrl.history);

// Minimal UI
router.get('/', (req, res) => {
  res.render('index.njk', { title: 'Weather Tech Test' });
});

module.exports = router;
