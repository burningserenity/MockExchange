import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Jumbotron } from "../../components/Jumbotron/";
import { FormBtn, Input } from "../../components/Form/"
import { Col, Row, Container } from "../../components/Grid/";
import axios from 'axios';
import Pages from "../../utils/Pages";

// Create new user

class Registration extends Component {
  state = {
    user_name: "",
    passphrase: "",
    repeatPass: ""
  };

  // Handles user creation and redirects the new user to the main page

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.user_name && this.state.passphrase && (this.state.passphrase === this.state.repeatPass)) {
      axios.post('/register', {
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

    return(
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Please enter your name</h1>

              <form align="center">
                <Row>
                  <Col size="md-12">
                    <Input
                      value={this.state.user_name}
                      placeholder="username"
                      onChange={Pages.handleChange.bind(this)}
                      id="user_name"
                      name="user_name"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col size="md-12">
                    <Input
                      value={this.state.passphrase}
                      placeholder="passphrase"
                      onChange={Pages.handleChange.bind(this)}
                      id="passphrase"
                      name="passphrase"
                      type="password"
                    />
                    <Input
                      value={this.state.repeatPass}
                      placeholder="repeat passphrase"
                      onChange={Pages.handleChange.bind(this)}
                      id="repeatPass"
                      name="repeatPass"
                      type="password"
                    />
                  </Col>
                </Row>

                <FormBtn onSubmit={this.handleFormSubmit.bind(this)} onClick={this.handleFormSubmit.bind(this)} />
              </form>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  };
};

export default Registration;
