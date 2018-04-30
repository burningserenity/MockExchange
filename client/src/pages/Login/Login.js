import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { FormBtn, Input } from "../../components/Form/"
import { Jumbotron } from "../../components/Jumbotron";
import { Col, Row, Container } from "../../components/Grid/";
import axios from 'axios';
import Pages from "../../utils/Pages";

// Login and landing page

class Login extends Component {

  state = {
    user_name: "",
    passphrase: ""
  };

  // Mocks log in by getting user by name and returning the user's _id

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.user_name && this.state.passphrase) {

      axios.post(`/login`, {
        user_name: this.state.user_name, 
        passphrase: this.state.passphrase
      }).then(res => {
        localStorage.setItem('jwtToken', res.data.token);
        window.location.href = `/exchange`;
      }).catch(err => console.log(err));
    }
  };

  render() {

    if (localStorage.getItem('jwtToken')) return ( <Redirect to='/exchange' /> );

    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Mock Exchange</h1>
              <Row>
                <Col size="md-6 centered">
                  <form>
                    <Input 
                      value={this.state.user_name}
                      onChange={Pages.handleChange.bind(this)} 
                      id="user_name" 
                      name="user_name" 
                      placeholder="username" 
                    />
                    <Input 
                      value={this.state.passphrase}
                      onChange={Pages.handleChange.bind(this)} 
                      id="passphrase" 
                      name="passphrase" 
                      placeholder="passphrase" 
                      type="password"
                    />
                    <FormBtn onSubmit={this.handleFormSubmit.bind(this)} onClick={this.handleFormSubmit.bind(this)} />
                  </form>
                </Col>
              </Row>
              <Row>
                <Col size="md-6 centered">
                  <h4>Welcome to Mock Exchange!</h4>
                  <p>Login or register</p>
                  <a href="/registration" className="btn btn-sm btn-outline-success mr-3">Register</a>
                </Col>
              </Row>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  };
};

export default Login;
