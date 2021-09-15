'use strict'

// CRUD Routes for users

// Dependencies
const express = require('express');
const router = express.Router();

const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);

const jwt = require('jsonwebtoken');
const getToken = require('../utils/getToken');

// Model required
const User = require('../models/User');

// Cryptocurrency exchange API, requires fetch defined globally
global.fetch = import('node-fetch');
const cc = require('cryptocompare');

// I like to see what's happening in the node console
const resolution = function (res, object) {
  console.log(JSON.stringify(object, null, 2));
  res.json(object);
}

// Get registered users by id
router.get("/api/users", passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = jwt.decode(getToken(req.headers), 'json');
  console.log(req.headers)

  if (token && token._id) {

    if (req.query.id === token._id) {
      User.findOne({"_id": req.query.id}).populate('trades').then(dbUser => {
        resolution(res, dbUser);
      });
    }

    else {
      res.status(400).send({
        success: false,
        msg: 'No query specified'
      })
    }
  }

  else return res.status(402).send({success: false, error: 'Unauthorized'});
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
      const token = jwt.sign(newUser.toJSON(), settings.secret)
      res.json({
        success: true,
        msg: 'Successfully created new user.',
        token: `JWT ${token}`
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
            token: `JWT ${token}`
          });
        }
      });
    });
  }
});

// Delete a user
router.delete("/api/users/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
  const token = jwt.decode(getToken(req.headers), 'json');

  if (token && token._id) {
    User.deleteOne({"_id": req.params.id}).then(dbUser => {
      resolution(res, dbUser);
    });
  }

  else return res.status(402).send({success: false, error: 'Unauthorized'});
});

module.exports = router;

