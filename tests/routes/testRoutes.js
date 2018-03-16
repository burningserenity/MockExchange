'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Routes to test
const testCurrencyRoutes = require('./testCurrencyRoutes');
const testTradeRoutes = require('./testTradeRoutes');
const testUserRoutes = require('./testUserRoutes');

/* Run tests ---/ MUST HAVE RUNNING:                        ---\
 *           ---/ mongod                                    ---\
 *           ---/ node(mon) server.js from root of this app ---\
*/
testCurrencyRoutes();
testTradeRoutes();
testUserRoutes();

// Export to test suite
module.exports = {testCurrencyRoutes, testTradeRoutes, testUserRoutes};
