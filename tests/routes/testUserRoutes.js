'use strict'

const chai = require("chai");
const expect = chai.expect;

const request = require("supertest");
const port = process.env.PORT || 8080;
const app = request(`http://localhost:${port}`);

module.exports = () => {

  // Test user routes
  describe('User Routes', () => {

    const testUser = { name: 'mochaChai', _id: '' };

    it('Finds all registered users', done => {
      app
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('Adds a user', done => {
      app
        .post('/api/users')
        .send({"user_name": testUser.name})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.user_name).to.equal(testUser.name);
          done();
        });
    });

    it('Finds the added user by name; user has 0 balance for all cryptocurrencies and 10000.00 USD', done => {
      const cryptos = ['btc', 'ltc', 'eth', 'doge'];
      app
        .get(`/api/users/?user_name=${testUser.name}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          testUser._id = res.body._id;
          expect(res.body.user_name).to.equal(testUser.name);
          expect(res.body.usd_balance).to.equal(100000.00);
          for (let i = 0; i < cryptos.length; i++) {
            const balance = `${cryptos[i]}_balance`;
            expect(res.body[balance]).to.equal(0);
          }
          done();
        });
    });


    it('Deletes the added user', done => {
      app
        .delete(`/api/users/${testUser._id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.n).to.equal(1);
          expect(res.body.ok).to.equal(1);
          done();
        });
    });
  });
}
