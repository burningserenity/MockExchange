'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Model to test
const User = require('../../models/User');
const testUser = new User;

module.exports = () => {

  // Check User properties
  describe('User', () => {
    const userProps = ['user_name', 'usd_balance', 'btc_balance', 'ltc_balance', 'eth_balance', 'doge_balance', 'trades'];
    it('User has fields: user_name, usd_balance, btc_balance, ltc_balance, eth_balance, doge_balance, trades', () => {
      userProps.forEach((user, i) => {
        expect(testUser).to.have.a.property(userProps[i]);
        i++;
      });
    });

    it('User.trades is an array for a reference to trades, with no default value', () => {
      expect(testUser.trades).to.be.an('array').that.is.empty;
    });

    // Check User validation
    it('Rejects save if user_name missing', done => {
      testUser.validate(err => expect(err.errors.user_name).to.exist);
      done();
    });

    it('Rejects save if any balance would be negative', done => {
      const invalidUser = new User({
        'user_name': 'foo',
        'usd_balance': -1,
        'btc_balance': -1,
        'ltc_balance': -1,
        'eth_balance': -1,
        'doge_balance': -1
      });
      invalidUser.validate(err => {
        userProps.forEach(prop => expect(err.errors[prop]).to.exist);
      });
      done();
    });

    it('Saves user with default balances', done => {
      const validUser = new User({'user_name': 'bar'});
      validUser.validate(err => {
        expect(validUser.usd_balance.to.equal(100000.00));
        expect(err.to.not.exist);
      });
      done();
    });
  });
};
