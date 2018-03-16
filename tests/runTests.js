'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

/* Tests to run ---/ MUST HAVE RUNNING:                        ---\
 *              ---/ mongod                                    ---\
 *              ---/ node(mon) server.js from root of this app ---\
 */

const testModels = require('./models/testModels');
const testRoutes = require('./routes/testRoutes');

