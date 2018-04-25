'use strict'

// Initialize Mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
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
  passphrase: {
    type: String,
    required: true
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

UserSchema.pre('save', function(next) {
  const user = this;
  console.log(JSON.stringify(user, null, 2));
  if (this.isModified('passphrase') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.passphrase, salt, null, (err, hash) => {
        if (err) return next(err);
        user.passphrase = hash;
        next();
      });
    });
  }
  else return next();
});

UserSchema.methods.comparePassphrase = function(passphrase, cb) {
  bcrypt.compare(passphrase, this.passphrase, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
