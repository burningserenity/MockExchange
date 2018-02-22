'use strict'

const chai = require("chai");
const expect = chai.expect;

const request = require("supertest");
const port = process.env.PORT || 8080;
const app = request(`http://localhost:${port}`);

const Trade = require('../../models/Trade');

let testTrade = new Trade({
  'curr_bought': 'btc',
  'curr_sold': 'usd',
  'bought_amount': 1,
  'sold_amount': 1,
  'owner': 'ffffffffffffffffffffffff'
});

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

  it('Creates a trade', done => {
    app
      .post(`/api/trades/${testTrade.owner}`)
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
        expect(res.body[0].owner[0]).to.equal('ffffffffffffffffffffffff');
        expect(res.body[0].open).to.be.true;
        testTrade._id = res.body[0]._id;
        done();
      });
  });

  it('Removes a trade', done => {
    app
      .delete(`/api/trades/${testTrade.owner}/${testTrade.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.n).to.equal(1);
        expect(res.body.nModified).to.equal(1);
        expect(res.body.ok).to.equal(1);
        done()
      });
  });

});
