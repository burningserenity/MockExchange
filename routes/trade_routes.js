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

  return pricesArr;
}

// If price match is found, execute trade
function executeTrade(pricesArr) {
  // currencies array must match up one-to-one with pricesArr array
  const currencies = ['btc', 'ltc', 'eth', 'doge'];
  let chosen;
  
  return new Promise((resolve, reject) => {
    Trade.find().then(dbTrades => {
      // Get only open trades
      const openTrades = dbTrades.filter(trade => trade.open);
      openTrades.forEach((trade, i) => {
        const balance = `${trade.curr_bought}_balance`;
        // Get price to compare
        if (trade.curr_bought === 'usd' || trade.curr_sold === 'usd') {
          chosen = pricesArr[0];
        }
        else if (trade.curr_sold === 'btc'){
          for (let j = 0; j < currencies.length; j++) {
            if (trade.curr_bought === currencies[j]) {
              chosen = pricesArr[j];
            }
          }
        }
        else {
          for (let j = 0; j < currencies.length; j++) {
            if (trade.curr_sold === currencies[j]) {
              chosen = pricesArr[j];
            }
          }
        }
        // Do math depending on buying BTC with USD or something else
        if (trade.curr_bought === 'usd' && trade.sold_amount >= (trade.bought_amount / chosen) ) {
          // Close trade order
          trade.update({ $set: { "open": false } }).then(() => {

            // Update user's balance to reflect successful trade
            User.findOne({ "_id": trade.owner }).then(user => {
              user.update({
                $set: {
                  [balance]: user[balance] + parseFloat(trade.bought_amount)
                }
              }).then(doc => {
                resolve(doc);
              }).catch(err => console.log(err));
            }).catch(err => console.log(err));
          });
        }
        else if (trade.curr_bought === 'btc' && trade.sold_amount >= trade.bought_amount / chosen) {
          console.log(`\n\n\n${chosen}\n\n\n`)
          // Close trade order
          trade.update({ $set: { "open": false } }).then(() => {

            // Update user's balance to reflect successful trade
            User.findOne({ "_id": trade.owner }).then(user => {
              user.update({
                $set: {
                  [balance]: user[balance] + parseFloat(trade.bought_amount)
                }
              }).then(doc => {
                resolve(doc);
              }).catch(err => console.log(err));
            }).catch(err => console.log(err));
          });
        }
        else if (trade.curr_bought !== 'btc' && trade.sold_amount >= chosen * trade.bought_amount) {
          // Close trade order
          trade.update({ $set: { "open": false } }).then(() => {

            // Update user's balance to reflect successful trade
            User.findOne({ "_id": trade.owner }).then(user => {
              user.update({
                $set: {
                  [balance]: user[balance] + parseFloat(trade.bought_amount)
                }
              }).then(doc => {
                resolve(doc);
              }).catch(err => console.log(err));
            }).catch(err => console.log(err));
          });
        }
        else if (i === openTrades.length - 1) resolve(0);
      });
    });
  });
  // Pull trades from database
  
};
/*  The routes  */

// Find trades based on query parameters
router.get("/api/trades", (req, res) => {
  Trade.find(req.query).then(dbTrade => {
    resolution(res, dbTrade);
  });
});

// Route for poll function, see above
router.put("/api/trades", (req, res) => {
  poll()
    .then(pricesArr => executeTrade(pricesArr))
    .catch(err => console.log(err));
});

// Order -- make a pending order
router.post("/api/trades/:id", (req, res) => {
  // Set currencies involved in trade
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

module.exports = {router, poll, executeTrade};
