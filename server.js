'use strict'

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Express configuration
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/user_routes.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use("/", userRoutes);

// Mongoose configuration
mongoose.connect(`mongodb://localhost/exchange`, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Server connection
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
