'use strict'

if (process.env.passportSecret.length < 1) throw 'Please run export passportSecret=<secret> from the login shell';

module.exports = {
  'secret': process.env.passportSecret
};
