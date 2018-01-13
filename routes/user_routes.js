'use strict'

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// I like to see what's happening in the node console
const resolution = function (res, object) {
  JSON.stringify(object, null, 2);
  res.json(object);
}

// Get one or all registered users by _id
router.get("/api/users/:id?", (req, res) => {
  if (req.params.id !== undefined) {
    User.findOne({"_id": req.params.id}).then(dbUser => {
      resolution(res, dbUser);
    });
  }

  else {
    User.find().then(dbUser => {
      resolution(res, dbUser);
    });
  }
});

// Add a user
router.post("/api/users", (req, res) => {
  User.create({"user_name": req.body.user_name}).then(dbUser => {
      resolution(res, dbUser);
  });
});

// Trade
router.put("/api/users/:id", (req, res) => {
  const buy = `${req.body.buying}_balance`;
  const sell = `${req.body.selling}_balance`;
  console.log(`buy: ${buy}\nsell: ${sell}`);
  User.updateOne({
    "_id": req.params.id
  }, {
    $inc: {
      [buy]: req.body.buyAmount,
      [sell]: req.body.sellAmount
    }
  }, (err, doc) => {
    if (err) return res.send(500, {error: err});
    return res.json(doc);
  });
});

module.exports = router;

