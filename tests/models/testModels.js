'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Models to test
const testUser = require('./testUser');
const testTrade = require('./testTrade');

// Run tests --- MUST HAVE mongod RUNNING
testUser();
testTrade();

// Export to test suite
module.exports = {testUser, testTrade}
