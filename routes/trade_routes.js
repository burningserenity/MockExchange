'use strict'

// CRUD Routes for trades

const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Trade = require('../models/Trade');
const port = process.env.PORT || 8080;

/*  Helper Methods  */

// I like to see what's happening in the node console
const resolution = function (res, object) {
  console.log(JSON.stringify(object, null, 2));
  res.json(object);
}

// Poll Cryptocompare API and Trades collection for price matching
async function poll() {
  let p;
  let prices = [];
  const rates = [{buy: 'btc',sell: 'usd'}, {buy: 'ltc',sell: 'btc'}, {buy: 'eth',sell: 'btc'}, {buy: 'doge',sell: 'btc'}];

  // currencies array should match up 1:1 with prices
  const currencies = ['btc', 'ltc', 'eth', 'doge'];

  rates.forEach(rate => {
    p = axios.request({
      url: `http://127.0.0.1:${port}/api/currencies/${rate.buy}/${rate.sell}`,
      timeout: 3000
    }).catch(err => console.log(err));
    prices.push(p);
  });

  let promArr = await Promise.all(prices).catch(err => console.log(err));
  let pricesArr = promArr.map(index => {
    return index.data
  });

  Trade.find().then(dbTrades => {
    const openTrades = dbTrades.filter(trade => trade.open);
    openTrades.forEach(trade => {
      // Single use case for buying USD with BTC
      if (trade.curr_bought === 'usd' && trade.sold_amount >= (trade.bought_amount / pricesArr[0])) {
        executeTrade(pricesArr, trade, 'usd');
      }
      // Else loop through currencies until match with trade is found
      else {
        for (let i = 0; i < currencies.length; i++) {
          if (trade.curr_bought === currencies[i] && trade.sold_amount >= (pricesArr[i] * trade.bought_amount)) {
            executeTrade(pricesArr, trade, currencies[i]);
          }
        }
      }
    });
  });
};

// If price match is found, execute trade
function executeTrade(pricesArr, trade, currency) {
  console.log(`${trade.owner} bought ${currency}`);
  const balance = `${currency}_balance`;

  // Close trade order
  trade.update({$set: { "open": false }}).then(() => {

    // Update user's balance to reflect successful trade
    User.findOne({"_id": trade.owner}).then(user => {
      console.log(`user[balance] === ${user[balance]}\ntrade.bought_amount === ${trade.bought_amount}\ntotal === ${user[balance] + parseFloat(trade.bought_amount)}`);
      user.update({
        $set: {
          [balance]: user[balance] + parseFloat(trade.bought_amount)
        }
      }).then(() => {
        console.log('traded')
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  });
};

/*  The routes  */

// Find trades based on query parameters
router.get("/api/trades", (req, res) => {
  Trade.find(req.query).then(dbTrade => {
    resolution(res, dbTrade);
  });
});

// Route for poll function, see above
router.post("/api/trades", (req, res) => {
  poll().catch(err => console.log(err));
});

// Delete a trade
router.delete("/api/trades/:id/:trade", (req, res) => {
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
});

module.exports = router;
