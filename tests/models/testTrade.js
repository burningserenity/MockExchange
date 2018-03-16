'use strict'

// Dependencies
const chai = require("chai");
const expect = chai.expect;

// Model to test
const Trade = require('../../models/Trade');
const testTrade = new Trade;

module.exports = () => {
  // Check Trade properties
  describe('Trade', () => {
    const tradeProps = ['curr_bought', 'curr_sold', 'bought_amount', 'sold_amount', 'open', 'owner'];
    const requiredTradeProps = tradeProps.slice(0, 4);
    it('Trade has fields: curr_bought, curr_sold, bought_amount, sold_amount, open, owner.', () => tradeProps.forEach(prop => expect(testTrade).to.have.a.property(prop)));

    it('Trade.open is true when instantiated', () => {
      expect(testTrade.open).to.be.true;
    });

    it('Trade.owner is an array for a reference to a user, with no default value', () => {
      expect(testTrade.owner).to.be.an('array').that.is.empty;
    });

    // Check Trade validation

    it('Rejects save if missing curr_bought, curr_sould, bought_amount, or sold_amount', done => {
      testTrade.validate(err => {
        requiredTradeProps.forEach(prop => expect(err.errors[prop]).to.exist);
        done();
      });
    })

    it('Rejects save if curr_bought and/or curr_sold are not usd, btc, ltc, eth, or doge', done => {
      const invalidCurrTrade = new Trade({
        'curr_bought': 'XMR',
        'curr_sold': 'QTUM',
        'bought_amount': 1,
        'sold_amount': 1
      });

      invalidCurrTrade.validate(err => {
        expect(err.errors[requiredTradeProps[0]]).to.exist;
        expect(err.errors[requiredTradeProps[1]]).to.exist;
      });
      done();
    });

    it('Accepts trade of valid currencies with trade values', done => {
      const currencies = ['usd', 'btc', 'ltc', 'eth', 'doge'];
      currencies.forEach(currency => {
        const validTrade = new Trade({
          'curr_bought': currency,
          'curr_sold': 'btc',
          'bought_amount': 1,
          'sold_amount': 1
        });  
        validTrade.validate(err => expect(err).to.not.exist);
      });
      currencies.forEach(currency => {
        const validTrade = new Trade({
          'curr_bought': 'btc',
          'curr_sold': currency,
          'bought_amount': 1,
          'sold_amount': 1
        });  
        validTrade.validate(err => expect(err).to.not.exist);
      });
      done();
    });
  });
}
