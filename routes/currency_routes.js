'use strict'

// Get VWAP from specified exchanges for specified currency

const express = require('express');
const router = express.Router();

// Cryptocurrency exchange API, requires fetch defined globally
global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cc = require('cryptocompare');
cc.setApiKey(process.env.CCAPIKEY)

// For dealing with decimals outside Node's precision capabilities
// As of 4-25-18, this is for making the DOGE/BTC conversion rate readable
const BigNumber = require('bignumber.js');
BigNumber.config({
  ROUNDING_MODE: 8,
  EXPONENTIAL_AT: 20,
  POW_PRECISION: 1e+9
});

router.get('/api/currencies/:buy/:sell', (req, res) => {
  cc.generateAvg(req.params.buy.toUpperCase(), req.params.sell.toUpperCase(), ['Coinbase', 'Kraken', 'Bitstamp', 'Bitfinex']).then(data => {
    const vwap = new BigNumber(data.PRICE);
    const adjusted = vwap.toString();
    res.json(adjusted);
  }).catch(console.error);
});

module.exports = router;
