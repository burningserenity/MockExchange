'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Models to test
const testUser = require('./testUser');
const testTrade = require('./testTrade');

testUser();
testTrade();

module.exports = {testUser, testTrade}
