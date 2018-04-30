'use strict'

// CRUD Routes for trades

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Trade = require('../models/Trade');
const port = process.env.PORT || 8080;

/*  Helper Methods  */

// I like to see what's happening in the node console
const resolution = function (res, object) {
  console.log(JSON.stringify(object, null, 2));
  res.json(object);
}

// For parsing login headers
const getToken = require('../utils/getToken');


/*  The routes  */

// Order -- make a pending order
router.post("/api/trades/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = jwt.decode(getToken(req.headers), 'json');
  // Set currencies involved in trade
  if (token && token._id === req.params.id) {
    const buy = `${req.body.buying}_balance`;
    const sell = `${req.body.selling}_balance`;
    User.findById(req.params.id).then(doc => {
      if (doc[sell] < req.body.sellAmount) res.status(403).send({error: 'Insufficient funds'});
      Trade.create({
        "curr_bought": req.body.buying,
        "curr_sold": req.body.selling,
        "bought_amount": req.body.buyAmount,
        "sold_amount": req.body.sellAmount,
        "owner": req.params.id
      }).then(trade => {
        console.log(trade);
        doc.update({
          $set: {
            [sell]: (doc[sell] - parseFloat(req.body.sellAmount)).toPrecision(8)
          },
          $push: {
            "trades" : trade
          }
        }, {
          runValidators: true
        }, (err, doc) => {
          if (err) {
            trade.remove();
          }
          else return res.json(doc);
        });
      });
    }).catch(err => res.status(403).send({error: 'Forbidden'}));
  }
  else return res.status(402).send({success: false, error: 'Unauthorized'});
});

// Delete a trade
router.delete("/api/trades/:id/:trade", passport.authenticate('jwt', {
  session: false,
  failureRedirect: `https://localhost:3000/error`
}), (req, res) => {
  const token = jwt.decode(getToken(req.headers), 'json');

  if (token && token._id === req.params.id) {
    // Delete from Trade collection
    Trade.findOneAndRemove({"_id": req.params.trade}).then(dbTrade => {
      const curr_bought = `${dbTrade.curr_bought}_balance`;
      const curr_sold = `${dbTrade.curr_sold}_balance`;
      const bought_amount = dbTrade.bought_amount;
      const sold_amount = dbTrade.sold_amount;

      // Remove trade ID from user's collection and restore user's balance
      return User.findOne({"_id": req.params.id}).then(dbUser => {
        return dbUser.update({
          $pull: {
            'trades': req.params.trade
          },
          $set: {
            [curr_sold]: dbUser[curr_sold] + parseFloat(sold_amount)
          }
        });
      });
    }).catch(err => {
      console.log(err);
      res.send(err);
    }).then(dbTransaction => {
      resolution(res, dbTransaction);
    });
  }
  else return res.status(402).send({success: false, error: 'Unauthorized'});
});

module.exports = router;
