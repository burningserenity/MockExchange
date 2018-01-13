'use strict'

const express = require('express');
const router = express.Router();
const user = require('../models/User');

router.get("/api/users", (req, res) => {
  console.log(JSON.stringify(user, null, 2));
  res.send("Check the console");
});

module.exports = router;

