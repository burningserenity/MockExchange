import React, { Component } from 'react';
import { Input, Jumbotron, JumboBtn } from "../../components/Jumbotron";
import { Col, Row, Container } from "../../components/Grid/";
import axios from 'axios';
import Pages from "../../utils/Pages";

// Login and landing page

class Login extends Component {

  state = {user_name: ""};

  // Mocks log in by getting user by name and returning the user's _id

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.user_name) {

      axios.get(`/api/users/?user_name=${this.state.user_name}`).then(res => window.location.href = `/exchange/${res.data._id}`)
          .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Mock Exchange</h1>
              <Row>
                <Col size="md-6 centered">
                  <Input onChange={Pages.handleChange.bind(this)} id="user_name" name="user_name" placeholder="Enter Username" />
                  <JumboBtn onClick={this.handleFormSubmit.bind(this)}>
                    Enter
                  </JumboBtn>
                </Col>
              </Row>
              <Row>
                <Col size="md-6 centered">
                  <h4>Welcome to Mock Exchange!</h4>
                  <p>Log in or register</p>
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
