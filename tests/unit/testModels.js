'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Models to test
const testUser = require('./models/testUser');
const testTrade = require('./models/testTrade');

testUser();
testTrade();
