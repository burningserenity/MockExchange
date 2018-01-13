'use strict'

// Initialize Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    default: 100000.00
  },
  btc_balance: {
    type: Number,
    required: true,
    default: 0
  },
  ltc_balance: {
    type: Number,
    required: true,
    default: 0
  },
  eth_balance: {
    type: Number,
    required: true,
    default: 0
  },
  trades: {
    type: Array
  }
});

module.exports = mongoose.model("User", UserSchema);
