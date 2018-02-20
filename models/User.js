'use strict'

// Initialize Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = Promise;

// Incorporate trades model for population
const Trade = require('./Trade');

// User schema
const UserSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    dropDups: true
  },
  usd_balance: {
    type: Number,
    required: true,
    default: 100000.00,
    min: [0, 'Not enough USD for order']
  },
  btc_balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Not enough BTC for order']
  },
  ltc_balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Not enough LTC for order']
  },
  eth_balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Not enough ETH for order']
  },
  doge_balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Not enough DOGE for order']
  },
  trades: [{type: Schema.Types.ObjectId, ref: 'Trade'}]
});

module.exports = mongoose.model("User", UserSchema);
