'use strict'

// CRUD Routes for trades

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trade = require('../models/Trade');

// I like to see what's happening in the node console
const resolution = function (res, object) {
  console.log(JSON.stringify(object, null, 2));
  res.json(object);
}

router.get("/api/trades", (req, res) => {
  // Find trades based on query parameters
  Trade.find(req.query).then(dbTrade => {
    resolution(res, dbTrade);
  });
});

module.exports = router;
