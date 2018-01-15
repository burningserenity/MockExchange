'use strict'

// Get VWAP from specified exchanges for specified currency

const express = require('express');
const router = express.Router();

// Cryptocurrency exchange API, requires fetch defined globally
global.fetch = require('node-fetch');
const cc = require('cryptocompare');

// For dealing with decimals outside Node's precision capabilities
const BigNumber = require('bignumber.js');
BigNumber.config({
  ROUNDING_MODE: 8,
  EXPONENTIAL_AT: 20
});

router.get('/api/currencies/:buy/:sell', (req, res) => {
  cc.generateAvg(req.params.buy.toUpperCase(), req.params.sell.toUpperCase(), ['HitBTC', 'Bittrex', 'YoBit']).then(data => {
    const vwap = new BigNumber(data.PRICE);
    const adjusted = vwap.toString();
    console.log(adjusted);
    res.json(adjusted);
  }).catch(console.error);
});

module.exports = router;
