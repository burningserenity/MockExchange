'use strict'

// CRUD Routes for users

// Dependencies
const express = require('express');
const router = express.Router();

const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);

const jwt = require('jsonwebtoken');

// Model required
const User = require('../models/User');

// Cryptocurrency exchange API, requires fetch defined globally
global.fetch = require('node-fetch');
const cc = require('cryptocompare');

// I like to see what's happening in the node console
const resolution = function (res, object) {
  console.log(JSON.stringify(object, null, 2));
  res.json(object);
}

// Get one or all registered users by query
router.get("/api/users", (req, res) => {
  // By _id
  if (req.query.id) {
    User.findOne({"_id": req.query.id}).populate('trades').then(dbUser => {
      resolution(res, dbUser);
    });
  }

  // By user_name
  else if (req.query.user_name) {
    User.findOne({"user_name": req.query.user_name}).then(dbUser => {
      resolution(res, dbUser);
    });
  }

  // Get all users
  else {
    User.find().then(dbUser => {
      resolution(res, dbUser);
    });
  }
});

// Add a user
router.post("/register", (req, res) => {
  if (req.body.user_name.length && req.body.passphrase.length) {
    const newUser = new User({
      user_name: req.body.user_name,
      passphrase: req.body.passphrase
    });
    newUser.save(err => {
      if (err) return res.json({
        success: false,
        msg: err
      });
      res.json({
        success: true,
        msg: 'Successfully created new user.',
        token: `JWT ${token}`,
        _id: user._id
      });
    });
  }
  else res.json({
    success: false,
    msg: 'Missing info'
  });
});

// Log in user
router.post('/login', (req, res) => {
  if (req.body.user_name.length && req.body.passphrase.length) {
    User.findOne({
      user_name: req.body.user_name
    }, (err, user) => {
      if (err) throw err;
      if (!user) res.status(401).send({
        success: false,
        msg: 'User not found.'
      });
      user.comparePassphrase(req.body.passphrase, (err, isMatch) => {
        if (err) res.status(401).send({
          success: false,
          msg: 'Incorrect passphrase'
        });
        else if (isMatch) {
          const token = jwt.sign(user.toJSON(), settings.secret)
          res.json({
            success: true,
            token: `JWT ${token}`,
            _id: user._id
          });
        }
      });
    });
  }
});

// Delete a user
router.delete("/api/users/:id", (req, res) => {
  User.deleteOne({"_id": req.params.id}).then(dbUser => {
    resolution(res, dbUser);
  });
});

module.exports = router;

