'use strict'

// Initialize Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Incorporate users model to ensure ownership
const User = require("./User");

// Trade schema
const TradeSchema = new Schema({
  curr_bought: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    enum: ['btc', 'ltc', 'eth', 'doge', 'usd']
  },
  curr_sold: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    enum: ['btc', 'ltc', 'eth', 'doge', 'usd']
  },
  bought_amount: {
    type: Number,
    required: true,
    min: 0
  },
  sold_amount: {
    type: Number,
    required: true,
    min: 0
  },
  open: {
    type: Boolean,
    required: true,
    default: true
  },
  owner: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {
  timestamps: {
    createdAt: 'order_timestamp'
  }
});

module.exports = mongoose.model("Trade", TradeSchema);
