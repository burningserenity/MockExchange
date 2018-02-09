'use strict'

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const users = require('./models/User');
const trades = require('./models/Trade');

// Express configuration
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/user_routes.js');
const curRoutes = require('./routes/currency_routes.js');
const tradeRoutes = require('./routes/trade_routes.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/", userRoutes, curRoutes, tradeRoutes);

// Mongoose configuration
mongoose.connect(`mongodb://localhost/exchange`, {useMongoClient: true});
mongoose.Promise = Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

async function getAllPrices() {
  let p;
  let prices = [];
  const rates = [{buy: 'btc',sell: 'usd'}, {buy: 'ltc',sell: 'btc'}, {buy: 'eth',sell: 'btc'}, {buy: 'doge',sell: 'btc'}];
  const currencies = ['btc', 'ltc', 'eth', 'doge'];
  rates.forEach(rate => {
    p = axios.get(`http://127.0.0.1:8080/api/currencies/${rate.buy}/${rate.sell}`);
    prices.push(p);
  });
  let promArr = await Promise.all(prices);
  let pricesArr = promArr.map(index => {
    return index.data
  });
  trades.find().then(dbTrades => {
    const openTrades = dbTrades.filter(trade => trade.open);
    openTrades.forEach(trade => {
      for (let i = 0; i < currencies.length; i++) {
        if (trade.curr_bought === currencies[i] && trade.sold_amount >= (pricesArr[i] * trade.bought_amount)) {
          console.log(`${trade.owner} bought ${currencies[i]}`);
          const balance = `${currencies[i]}_balance`;
          trade.update({$set: { "open": false }}).then(() => {
            users.findOne({"_id": trade.owner}).then(user => {
          console.log(`user[balance] === ${user[balance]}\ntrade.bought_amount === ${trade.bought_amount}\ntotal === ${user[balance] + parseFloat(trade.bought_amount)}`);
              user.update({
                $set: {
                  [balance]: user[balance] + parseFloat(trade.bought_amount)
                }
              }).then(transaction => console.log(JSON.stringify(transaction, null, 2)));
            });
          });
        }
      }
    });
  });
  /*
   *    db.trades.find().then(trades => {
   *        if (currency_price_in_trade === current_price_of_currency) {
   *            increase quantity of bought currency;
   *            set trade.open to false;
   *        }
   *    })
   * */
};

// Server connection
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  setInterval(getAllPrices, 3000);
});
