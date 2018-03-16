'use strict'

const chai = require("chai");
const expect = chai.expect;

const request = require("supertest");
const port = process.env.PORT || 8080;
const app = request(`http://localhost:${port}`);

module.exports = () => {

  // Test currency routes
  describe('Currency Routes', () => {
    const cryptos = ['btc', 'ltc', 'eth', 'doge'];

    it('Gets the USD price for a single BTC', done => {
      app
        .get('/api/currencies/btc/usd')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(parseFloat(res.body) === NaN).to.be.false;
          done();
        });
    });

    for (let i = 1; i < cryptos.length; i++) {
      it(`Gets the BTC price for a single ${cryptos[i].toUpperCase()}`, done => {
        app
          .get(`/api/currencies/${cryptos[i]}/btc`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(parseFloat(res.body) === NaN).to.be.false;
            done();
          });
      });
    }
  });
}
