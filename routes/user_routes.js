'use strict'

// CRUD Routes for users

const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/User');
const Trade = require('../models/Trade');

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
router.post("/api/users", (req, res) => {
  User.create({"user_name": req.body.user_name}).then(dbUser => {
    resolution(res, dbUser);
  });
});

// Delete a user
router.delete("/api/users/:id", (req, res) => {
  User.deleteOne({"_id": req.params.id}).then(dbUser => {
    resolution(res, dbUser);
  });
});

module.exports = router;

