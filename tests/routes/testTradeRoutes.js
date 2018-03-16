'use strict'

const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost/exchange`, {useMongoClient: true});
mongoose.Promise = Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

const chai = require("chai");
const expect = chai.expect;

const request = require("supertest");
const port = process.env.PORT || 8080;
const app = request(`http://localhost:${port}`);

const Trade = require('../../models/Trade');
const poll = require('../../routes/trade_routes').poll;
const executeTrade = require('../../routes/trade_routes').executeTrade;

let pricesArr;
let testTrade = new Trade({
  'curr_bought': 'btc',
  'curr_sold': 'usd',
  'bought_amount': 1,
  'sold_amount': 1,
  'owner': 'ffffffffffffffffffffffff'
});

module.exports = () => {

  // Test trade routes
  describe('Trade Routes', () => {
    it('Responds with JSON array', done => {
      app
        .get('/api/trades')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('Gets VWAPs for BTC, LTC, ETH, and DOGE', done => {
      poll().then(prices => { 
        pricesArr = prices;
        expect(pricesArr).to.be.an('array').with.length(4);
        for (let i = 0; i < pricesArr.length; i++) expect(parseFloat(pricesArr[i])).to.be.gt(-1);
        done();
      });
    });

    it('Creates a trade', done => {
      app
        .post(`/api/users/`)
        .send({"user_name": "mochaChai"})
        .end((err, res) => {
          testTrade.owner = res.body._id;
          app
            .post(`/api/trades/${res.body._id}`)
            .send({
              buying: testTrade.curr_bought,
              selling: testTrade.curr_sold,
              buyAmount: testTrade.bought_amount,
              sellAmount: testTrade.sold_amount,
              owner: testTrade.owner
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.body.n).to.equal(1);
              expect(res.body.nModified).to.equal(1);
              expect(res.body.ok).to.equal(1);
              done();
            });
        });
    });

    it('Finds a user\'s trades', done => {
      app
        .get(`/api/trades/?owner=${testTrade.owner}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array').that.is.not.empty;
          expect(res.body[0].curr_bought).to.equal('btc');
          expect(res.body[0].curr_sold).to.equal('usd');
          expect(res.body[0].bought_amount).to.equal(1);
          expect(res.body[0].sold_amount).to.equal(1);
          expect(res.body[0].owner[0]).to.include(testTrade.owner);
          expect(res.body[0].open).to.be.true;
          testTrade._id = res.body[0]._id;
          done();
        });
    });

    it('Does not execute a trade if the offered price is < the current VWAP', done => {
      const exec = executeTrade([222222,222222,222222,222222]);
      exec.then(res => {
        expect(res).to.equal(0);
        done();
      });
    }); 

    it('Executes a trade if the offered price is >= the current VWAP', done => {
      const exec = executeTrade([1,1,1,1]);
      exec.then(res => {
        expect(res.n).to.equal(1);
        expect(res.nModified).to.equal(1);
        expect(res.ok).to.equal(1);
        done();
      })
    });

    it('Removes a trade', done => {
      app
        .delete(`/api/trades/${testTrade.owner}/${testTrade.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, res) => {
          expect(res.body.n).to.equal(1);
          expect(res.body.nModified).to.equal(1);
          expect(res.body.ok).to.equal(1);
          app
            .delete(`/api/users/${testTrade.owner}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, res) => {
              expect(res.body.n).to.equal(1);
              expect(res.body.ok).to.equal(1);
              mongoose.disconnect();
              done();
            });
        });
    });

  });
}
