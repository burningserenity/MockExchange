'use strict'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Error extends Component {
  componentDidMount() {
    localStorage.removeItem('jwtToken');
  }

  render() {
    return(
      <Redirect to='/' />
    );
  };
};

export default Error;
