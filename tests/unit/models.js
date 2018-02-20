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
  const tradeProps = ['curr_bought', 'curr_sold', 'bought_amount', 'sold_amount', 'open', 'owner'];
  it('Trade has fields: curr_bought, curr_sold, bought_amount, sold_amount, open, owner.', () => {
    tradeProps.forEach((trade, i) => {
      expect(testTrade).to.have.a.property(tradeProps[i]);
      i++;
    });
  });

  it('Trade.open is true when instantiated', () => {
    expect(testTrade.open).to.be.true;
  });

  it('Trade.owner is an array for a reference to a user, with no default value', () => {
    expect(testTrade.owner).to.be.an('array').that.is.empty;
  });
});

describe('User', () => {
  const userProps = ['user_name', 'usd_balance', 'ltc_balance', 'eth_balance', 'doge_balance', 'trades'];
  it('User has fields: user_name, usd_balance, btc_balance, ltc_balance, eth_balance, doge_balance, trades', () => {
    userProps.forEach((user, i) => {
      expect(testUser).to.have.a.property(userProps[i]);
      i++;
    });
  });

  it('User.trades is an array for a reference to trades, with no default value', () => {
    expect(testUser.trades).to.be.an('array').that.is.empty;
  });
});
