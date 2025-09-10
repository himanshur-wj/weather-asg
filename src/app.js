const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Views (Nunjucks)
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
});
app.set('view engine', 'njk');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to accept HTML form posts
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
const routes = require('./api/routes');
app.use(routes);

module.exports = app;
