import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
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

  orderValidation (currency, price) {
    console.log(currency);
    if (currency === 'usd') return price.match(/^(\$?\d{1,3}(?:,?\d{3})*(?:\.\d{2})?|\.\d{2})?$/g);

    else return price.match(/^(\d{1,3}(?:,?\d{3})*(?:\.\d{0,8})?|\.\d{0,8})?$/g);
  };

    // Method for trading between cryptocurrencies
    // Checks if buying or selling and modifies the state accordingly

    cryptoOnlyOrder = props => {
      if (this.state.selling === "true") {
        this.setState({
          sellCurrency: this.state.currency,
          buyCurrency: 'btc'
        }, () => {
          const val1 = this.orderValidation(this.state.buyCurrency, this.state.amount);
          const val2 = this.orderValidation(this.state.sellCurrency, this.state.offer);
          console.log(`buying ${this.state.amount} btc, selling ${this.state.offer} ${this.state.sellCurrency}\nval1 = ${val1}\nval2 = ${val2}`)
          if (val1 != null && val2 != null)
            this.props.placeOrder(this.props.match, this.state.buyCurrency, this.state.sellCurrency, this.state.amount, this.state.offer);
        });
      }

      else {
        this.setState({
          buyCurrency: this.state.currency,
          sellCurrency: 'btc'
        }, () => {
          const val1 = this.orderValidation(this.state.buyCurrency, this.state.amount);
          const val2 = this.orderValidation(this.state.sellCurrency, this.state.offer);
          console.log(`selling ${this.state.offer} btc, buying ${this.state.amount} ${this.state.buyCurrency}\nval1 = ${val1}\nval2 = ${val2}`)
          if (val1 != null && val2 != null)
            this.props.placeOrder(this.props.match, this.state.buyCurrency, this.state.sellCurrency, this.state.amount, this.state.offer);
        });
      }
    };

    // Method for buying or selling BTC for USD
    // Checks if buying or selling and modifies the state accordingly

    usdOrder = props => {
      if (this.state.buyCurrency === 'btc') {
        console.log("hello")
        this.setState({sellCurrency: 'usd'}, () => { 
          const val1 = this.orderValidation(this.state.buyCurrency, this.state.usdAmount);
          const val2 = this.orderValidation(this.state.sellCurrency, this.state.usdOffer);
          if (val1 != null && val2 != null)
            this.props.placeOrder(this.props.match, this.state.buyCurrency, this.state.sellCurrency, this.state.usdAmount, this.state.usdOffer); 
        });
      }

      else if (this.state.buyCurrency === 'usd') {
        this.setState({sellCurrency: 'btc'}, () => {
          const val1 = this.orderValidation(this.state.buyCurrency, this.state.usdAmount);
          const val2 = this.orderValidation(this.state.sellCurrency, this.state.usdOffer);
          if (val1 != null && val2 != null)
            this.props.placeOrder(this.props.match, this.state.buyCurrency, this.state.sellCurrency, this.state.usdAmount, this.state.usdOffer); 
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
              <Form>
                <Form.Check name="CUR" type="radio" onChange={Pages.handleChange.bind(this)} id="buyCurrency" label="Buy BTC with USD" value="btc"
                />
                <Form.Check name="CUR" type="radio" onChange={Pages.handleChange.bind(this)} id="buyCurrency" value="usd" label="Sell BTC for USD"
                />
              <FormBtn type="button" onClick={() => this.usdOrder()}/>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col size="md-3">
              <h4>Trade Crypto</h4>
              <Form>
                <Form.Check name="CUR" type="radio" onChange={Pages.handleChange.bind(this)} id="currency" value="ltc" label="LTC" 
                />
                <Form.Check name="CUR" type="radio" onChange={Pages.handleChange.bind(this)} id="currency" value="eth" label="ETH"
                />
                <Form.Check name="CUR" type="radio" onChange={Pages.handleChange.bind(this)} id="currency" value="doge" label="DOGE" />
              </Form>
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
        <Form>
          <Form.Check name="BuySell" onChange={Pages.handleChange.bind(this)} id="selling" value={0===1} type="radio" label="Buy with BTC" 
          />
          <Form.Check name="BuySell" onChange={Pages.handleChange.bind(this)} id="selling" value={0===0} type="radio" label="Sell for BTC" 
          />
        </Form>
        <FormBtn onClick={() => this.cryptoOnlyOrder()}/>
      </Col>
    </Row>
  </Container>
      );
    };
};

export default PlaceOrder;
