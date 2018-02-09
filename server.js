'use strict'

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

// Express configuration
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/user_routes.js');
const curRoutes = require('./routes/currency_routes.js');
const tradeRoutes = require('./routes/trade_routes.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/", userRoutes, curRoutes, tradeRoutes);

// Mongoose configuration
mongoose.connect(`mongodb://localhost/exchange`, {useMongoClient: true});
mongoose.Promise = Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

function hitPoll() {
  axios.post(`http://127.0.0.1:${port}/api/trades`);
}

// Server connection
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  setInterval(hitPoll, 3000);
});
