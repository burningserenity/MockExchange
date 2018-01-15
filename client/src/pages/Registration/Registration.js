import React, { Component } from 'react';
import { Jumbotron } from "../../components/Jumbotron/";
import { FormBtn, Input } from "../../components/Form/"
import { Link } from 'react-router-dom';
import { Col, Row, Container } from "../../components/Grid/";
import axios from 'axios';
import Pages from "../../utils/Pages";

class Registration extends Component {
  state = {user_name: ""};

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.user_name) {
      console.log(this.state.user_name);
      axios.post('/api/users', {user_name: this.state.user_name}).then(res => {
        window.location.href = `/exchange/${res.data._id}`
      }).catch(err => console.log(err));
    }
  };

  render() {
    return(
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Please enter your name</h1>
            </Jumbotron>

            <Col size="md-8 centered">
              <form align="center">
                <Input 
                  value={this.state.user_name}
                  onChange={Pages.handleChange.bind(this)}
                  id="user_name"
                  name="user_name"
                />

              <FormBtn onClick={this.handleFormSubmit.bind(this)} />
              </form>
            </Col>
          </Col>
        </Row>
      </Container>
    );
  };
};

export default Registration;
