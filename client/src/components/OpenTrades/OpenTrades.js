import React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Input, Jumbotron, JumboBtn } from "../../components/Jumbotron/";
import { Col, Row, Container } from "../../components/Grid/";

export const OpenTrades = props =>
  <Container>
    <Row>
      {props.trades.map(order => (
        <ListGroupItem key={order.timestamp}>
          <Row>
            <Col size="md-6">
              <h5>Buying</h5>
              <h6>{order.curr_bought}</h6>
              <h6>{order.bought_amount}</h6>
              <br />
            </Col>
            <Col size="md-6">
              <h5>Selling</h5>
              <h6>{order.curr_sold}</h6>
              <h6>{order.sold_amount}</h6>
            </Col>
          </Row>
          <Row>
            <Col size="md-12">
              <h5>Timestamp</h5>
              <h6>{order.timestamp}</h6>
            </Col>
          </Row>
          <JumboBtn>Cancel</JumboBtn>
        </ListGroupItem>
      ))}
    </Row>
  </Container>
