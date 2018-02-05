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
  // By _id
  if (req.query.id) {
    Trade.findOne({"_id": req.query.id}).then(dbTrade => {
      resolution(res, dbTrade);
    });
  }

  // By owner's _id
  else if (req.query.owner) {
    Trade.find({"owner": req.query.owner}).then(dbTrade => {
      resolution(res, dbTrade);
    });
  }

  // All trades
  else {
    Trade.find().then(dbTrade => {
      resolution(res, dbTrade);
    });
  }
});

module.exports = router;
