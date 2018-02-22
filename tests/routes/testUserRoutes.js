'use strict'

const chai = require("chai");
const expect = chai.expect;

const request = require("supertest");
const port = process.env.PORT || 8080;
const app = request(`http://localhost:${port}`);

describe('User Routes', done => {

  const testUser = { name: 'mochaChai' };

  it('Finds all registered users', () => {
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

  it('Adds a user', () => {
    app
      .post('/api/users')
      .send({"user_name": testUser.name})
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

  it('Finds the added user by name; user has 0 balance for all cryptocurrencies and 10000.00 USD', () => {
    const cryptos = ['btc', 'ltc', 'eth', 'doge'];
    app
      .get(`/api/users/?user_name=${testUser.name}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.user_name).to.equal(testUser.name);
        expect(res.body.usd_balance).to.equal(100000.00);
        for (let i = 0; i < cryptos.length; i++) {
          const balance = `${cryptos[i]}_balance`;
          expect(res.body[balance]).to.equal(0);
        }
        testUser._id = res.body._id;
        done();
      });
  });

  it('Finds the added user by _id', () => {
    app
      .get(`/api/users/?id=${testUser._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.user_name).to.equal(testUser.name);
        done();
      });
  });

  it('Deletes the added user', () => {
    app
      .delete(`/api/users/${testUser._id}`)
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
