import React, { Component } from 'react';
import { ListGroup, Radio } from 'react-bootstrap';
import { Col, Row, Container } from "../../components/Grid/";
import { FormBtn, Input } from "../../components/Form/";
import API from "../../utils/API";
import Pages from "../../utils/Pages";

// Component which sets trade orders

class PlaceOrder extends Component {
  state = {
    currency: "",
    buyCurrency: "",
    sellCurrency: "",
    amount: "",
    offer: "",
    usdAmount: "",
    usdOffer: "",
    selling: false
  };

  // Method for trading between cryptocurrencies
  // Checks if buying or selling and modifies the state accordingly

  cryptoOnlyOrder = () => {
    if (this.state.selling === "true") {
      this.setState({
        sellCurrency: this.state.currency,
        buyCurrency: 'btc'
      }, () => {
        API.placeOrder(this.props.match.params.id, this.state.buyCurrency, this.state.sellCurrency, this.state.amount, this.state.offer).then(() => window.location.href = `/exchange/${this.props.match.params.id}`);
      });
    }

    else {
      this.setState({
        buyCurrency: this.state.currency,
        sellCurrency: 'btc'
      }, () => {
        API.placeOrder(this.props.match.params.id, this.state.buyCurrency, this.state.sellCurrency, this.state.amount, this.state.offer).then(() => window.location.href = `/exchange/${this.props.match.params.id}`);
      });
    }
  };

  render() {
    return(
      <Container>
        <Row>
          <Col size="md-3">
            <h4>Buy/Sell BTC with USD</h4>
            <h5>Amount</h5>
            <Input onChange={Pages.handleChange.bind(this)} id="usdAmount" name="buy_btc" />
            <h5>Offer</h5>
            <Input onChange={Pages.handleChange.bind(this)} id="usdOffer" name="buy_btc" />
            <ListGroup>
              <Radio name="CUR" onChange={Pages.handleChange.bind(this)} id="buyCurrency" value="btc">Buy BTC with USD</Radio>
              <Radio name="CUR" onChange={Pages.handleChange.bind(this)} id="buyCurrency" value="usd">Sell BTC for USD</Radio>
            </ListGroup>
          <FormBtn onClick={() => { 

            {/* In line function for trading with USD */}

            if (this.state.buyCurrency === 'btc') {
              this.setState({sellCurrency: 'usd'}, () => { 
                API.placeOrder(this.props.match.params.id, this.state.buyCurrency, this.state.sellCurrency, this.state.usdAmount, this.state.usdOffer).then(() => window.location.href = `/exchange/${this.props.match.params.id}`); 
              });
            }
            else if (this.state.buyCurrency === 'usd') {
              this.setState({sellCurrency: 'btc'}, () => {
                API.placeOrder(this.props.match.params.id, this.state.buyCurrency, 'btc', this.state.usdAmount, this.state.usdOffer).then(() => window.location.href = `/exchange/${this.props.match.params.id}`); 
              });
            }
          }}/>
          </Col>
        </Row>
        <Row>
          <Col size="md-3">
            <h4>Trade Crypto</h4>
            <ListGroup>
              <Radio name="CUR" onChange={Pages.handleChange.bind(this)} id="currency" value="ltc">LTC</Radio>
              <Radio name="CUR" onChange={Pages.handleChange.bind(this)} id="currency" value="eth">ETH</Radio>
              <Radio name="CUR" onChange={Pages.handleChange.bind(this)} id="currency" value="doge">DOGE</Radio>
            </ListGroup>
          </Col>
          <Col size="md-3">
            <h5>Amount</h5>
            <Input
              value={this.state.amount}
              onChange={Pages.handleChange.bind(this)}
              id="amount"
            />
          </Col>
          <Col size="md-3">
            <h5>Offer</h5>
            <Input
              value={this.state.offer}
              onChange={Pages.handleChange.bind(this)}
              id="offer"
            />
          </Col>
          <Col size="md-3">
            <ListGroup>
              <Radio name="BuySell" onChange={Pages.handleChange.bind(this)} id="selling" value={0===1}>Buy with BTC</Radio>
              <Radio name="BuySell" onChange={Pages.handleChange.bind(this)} id="selling" value={0===0}>Sell for BTC</Radio>
            </ListGroup>
          <FormBtn onClick={() => this.cryptoOnlyOrder()}/>
          </Col>
        </Row>
      </Container>
    );
  };
};

export default PlaceOrder;
