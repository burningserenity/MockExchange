'use strict'

const axios = require('axios');

const port = process.env.PORT || 8080;

const Trade = require('../models/Trade');
const User = require('../models/User');

// If price match is found, execute trade
const executeTrade = function(pricesArr) {
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
          if (trade.curr_sold === 'usd') chosen = pricesArr[0];
          else chosen = 1 / pricesArr[0];
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
              chosen = 1 / pricesArr[j];
            }
          }
        }
        // Do math depending on buying BTC with USD or something else
        if (trade.sold_amount >= (trade.bought_amount * chosen) ) {
          // Close trade order
          trade.update({ $set: { "open": false } }).then(() => {

            // Update user's balance to reflect successful trade
            User.findOne({ "_id": trade.owner }).then(user => {
              const newBalance = (user[balance] + trade.bought_amount).toFixed(2);
              user.update({
                $set: {
                  [balance]: newBalance
                }
              }).then(doc => {
                resolve(doc);
              }).catch(err => reject(err));
            }).catch(err => reject(err));
          });
        }
        else if (i === openTrades.length - 1) resolve(0);
      });
    });
  });
};

// Poll Cryptocompare API and Trades collection for price matching
const poll = async function() {
  let p;
  let prices = [];
  const rates = [{buy: 'btc',sell: 'usd'}, {buy: 'ltc',sell: 'btc'}, {buy: 'eth',sell: 'btc'}, {buy: 'doge',sell: 'btc'}];

  rates.forEach(rate => {
    p = axios.request({
      url: `http://127.0.0.1:${port}/api/currencies/${rate.buy}/${rate.sell}`,
      timeout: 3000
    }).catch(() => reject());
    prices.push(p);
  });

  let promArr = await Promise.all(prices).catch(err => console.log(err));
  let pricesArr = promArr.map(index => {
    return index.data
  });

  return pricesArr;
};

module.exports = { executeTrade, poll };
