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
  // Must be _id, owner, curr_bought, and/or curr_sold

  let query = Object.keys(req.query).reduce((mappedQuery, key) => {
    let param = req.query[key]
    console.log(`param = ${param}`);

    if (param) mappedQuery[key] = param

    return mappedQuery
  }, {});

  Trade.find(query).then(dbTrade => {
    resolution(res, dbTrade);
  });
});

module.exports = router;
