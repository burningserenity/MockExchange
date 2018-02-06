'use strict'

const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/User');
const Trade = require('../models/Trade');

// Cryptocurrency exchange API, requires fetch defined globally
global.fetch = require('node-fetch');
const cc = require('cryptocompare');

// I like to see what's happening in the node console
const resolution = function (res, object) {
  console.log(JSON.stringify(object, null, 2));
  res.json(object);
}

// Get one or all registered users by query
router.get("/api/users", (req, res) => {
  // By _id
  if (req.query.id) {
    User.findOne({"_id": req.query.id}).populate('trades').then(dbUser => {
      resolution(res, dbUser);
    });
  }

  // By user_name
  else if (req.query.user_name) {
    User.findOne({"user_name": req.query.user_name}).then(dbUser => {
      resolution(res, dbUser);
    });
  }

  // Get all users
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

// Order -- Instant as of right now, intended to make pending orders
router.put("/api/users/:id", (req, res) => {
  // Set currencies involved in trade
  const buy = `${req.body.buying}_balance`;
  const sell = `${req.body.selling}_balance`;
  User.findById(req.params.id, (err, doc) => {
    if (err) return res.status(500).send({error: err});
    Trade.create({
      "curr_bought": req.body.buying,
      "curr_sold": req.body.selling,
      "bought_amount": req.body.buyAmount,
      "sold_amount": req.body.sellAmount,
      "owner": req.params.id
    }).then(trade => {
      console.log(trade);
      if (err) return res.status(500).send({error: err});
      doc.update({
        $set: {
          [buy]: doc[buy] + parseFloat(req.body.buyAmount),
          [sell]: doc[sell] - parseFloat(req.body.sellAmount)
        },
        $push: {
          "trades" : trade
        }
      }, {
        runValidators: true
      }, (err, doc) => {
        if (err) return res.status(500).send({error: err});
        return res.json(doc);
      });
    });
  });
});

// Delete a user
router.delete("/api/users/:id", (req, res) => {
  User.deleteOne({"_id": req.params.id}).then(dbUser => {
    resolution(res, dbUser);
  });
});

// Delete a trade
router.delete("/api/users/:id/:trade", (req, res) => {
  Trade.findOneAndRemove({"_id": req.params.trade}).then(dbTrade => {
    const curr_bought = `${dbTrade.curr_bought}_balance`;
    const curr_sold = `${dbTrade.curr_sold}_balance`;
    const bought_amount = dbTrade.bought_amount;
    const sold_amount = dbTrade.sold_amount;
    return User.findOne({"_id": req.params.id}).then(dbUser => {
      return dbUser.update({
        $pull: {
          'trades': req.params.trade
        },
        $set: {
          [curr_sold]: dbUser[curr_sold] + parseFloat(sold_amount),
          [curr_bought]: dbUser[curr_bought] - parseFloat(bought_amount)
        }
      });
    });
  }).catch(err => {
    console.log(err);
    res.send(err);
  }).then(dbTransaction => {
    resolution(res, dbTransaction);
  });
});

module.exports = router;

