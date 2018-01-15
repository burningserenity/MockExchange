import React from 'react';
import { Input, Jumbotron, JumboBtn } from "../../components/Jumbotron/";
import { Col, Row, Container } from "../../components/Grid/";

export const BalanceDisplay = props =>
  <Container>
    <Row>
      <Col size="md-12">
        <Jumbotron>
          <Row>
            <Col size="md-3">
              <h4>USD</h4>
              <h5>{props.balances.usd_balance}</h5>
            </Col>
            <Col size="md-3">
              <h4>BTC</h4>
              <h5>{props.balances.btc_balance}</h5>
            </Col>
            <Col size="md-3">
              <h4>LTC</h4>
              <h5>{props.balances.ltc_balance}</h5>
            </Col>
            <Col size="md-3">
              <h4>ETH</h4>
              <h5>{props.balances.eth_balance}</h5>
            </Col>
            <Col size="md-3">
              <h4>DOGE</h4>
              <h5>{props.balances.doge_balance}</h5>
            </Col>
          </Row>
        </Jumbotron>
      </Col>
    </Row>
  </Container>;
