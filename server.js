'use strict'

// Dependencies
const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const passport = require('passport');

// Express configuration
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/user_routes.js');
const curRoutes = require('./routes/currency_routes.js');
const tradeRoutes = require('./routes/trade_routes.js').router;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static("client/build"));

app.use(session({ secret: "cats "}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", userRoutes, curRoutes, tradeRoutes);

// Mongoose configuration
mongoose.connect(`mongodb://localhost/exchange`, {useMongoClient: true});
mongoose.Promise = Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


function hitPoll() {
  // Throw errors away and try again
  axios.put(`http://127.0.0.1:${port}/api/trades`).catch(() => 0);
}

// Server connection
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  // Query API twice as often as client side
  // This is to compensate for persistent error with every other attempt to call hitPoll
  setInterval(hitPoll, 1500);
});

