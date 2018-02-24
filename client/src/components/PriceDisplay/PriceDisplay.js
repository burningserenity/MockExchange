import React from 'react';
import { Input, Jumbotron, JumboBtn } from "../../components/Jumbotron/";
import { Col, Row, Container } from "../../components/Grid/";

// Shows current prices for each currency

export const PriceDisplay = props => 
  <Container>
    <Row>
      <Col size="md-12">
        <Jumbotron>
          <Row>
            <Col size="md-3">
              <h4>BTC/USD</h4>
              <h5>{parseFloat(props.prices.btcTousd).toFixed(2)}</h5>
            </Col>
            <Col size="md-3">
              <h4>LTC/BTC</h4>
              <h5>{props.prices.ltcTobtc}</h5>
            </Col>
            <Col size="md-3">
              <h4>ETH/BTC</h4>
              <h5>{props.prices.ethTobtc}</h5>
            </Col>
            <Col size="md-3">
              <h4>DOGE/BTC</h4>
              <h5>{props.prices.dogeTobtc}</h5>
            </Col>
          </Row>
        </Jumbotron>
      </Col>
    </Row>
  </Container>;

