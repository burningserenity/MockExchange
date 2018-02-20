'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Models to test
const Trade = require('../../models/Trade');
const User = require('../../models/User');

// Instantiated models
const testTrade = new Trade;
const testUser = new User;

// Check Trade properties
describe('Trade', () => {
  it('Trade has fields: curr_bought, curr_sold, bought_amount, sold_amount, open, owner.', () => {
    expect(testTrade).to.have.a.property('curr_bought');
    expect(testTrade).to.have.a.property('curr_sold');
    expect(testTrade).to.have.a.property('bought_amount');
    expect(testTrade).to.have.a.property('sold_amount');
    expect(testTrade).to.have.a.property('open');
    expect(testTrade).to.have.a.property('owner');
  });

  it('Trade.open is true when instantiated', () => {
    expect(testTrade.open).to.be.true;
  });

  it('Trade.owner is an array for a reference to a user, with no default value', () => {
    expect(testTrade.owner).to.be.an('array').that.is.empty;
  });
});

describe('User', () => {
  it('User has fields: user_name, usd_balance, btc_balance, ltc_balance, eth_balance, doge_balance, trades', () => {
    expect(testUser).to.have.a.property('user_name');
    expect(testUser).to.have.a.property('usd_balance');
    expect(testUser).to.have.a.property('btc_balance');
    expect(testUser).to.have.a.property('ltc_balance');
    expect(testUser).to.have.a.property('eth_balance');
    expect(testUser).to.have.a.property('doge_balance');
    expect(testUser).to.have.a.property('trades');
  });

  it('User.trades is an array for a reference to trades, with no default value', () => {
    expect(testUser.trades).to.be.an('array').that.is.empty;
  });
});
