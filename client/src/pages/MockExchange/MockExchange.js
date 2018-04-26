import React, { Component } from 'react';
import { Col, Row, Container } from "../../components/Grid/";
import API from "../../utils/API";
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import { PriceDisplay } from "../../components/PriceDisplay/PriceDisplay";
import { BalanceDisplay } from "../../components/BalanceDisplay/BalanceDisplay";
import { OpenTrades } from "../../components/OpenTrades/OpenTrades";
import PlaceOrder from "../../components/PlaceOrder/PlaceOrder";

// The page with all the action

class MockExchange extends Component {

  constructor(props) {
    super();

    this.state = {
      btcTousd: 0,
      ltcTobtc: 0,
      ethTobtc: 0,
      dogeTobtc: 0,

      usd_balance: 0,
      btc_balance: 0,
      ltc_balance: 0,
      eth_balance: 0,
      doge_balance: 0,

      trades: []
    };

    BigNumber.config({
      ROUNDING_MODE: 4,
      EXPONENTIAL_AT: 20,
      POW_PRECISION: 1e+9,
    });
  }

  // Loads current prices, gets user _id from route parameter and
  // Reloads the prices every three seconds.

  componentDidMount() {
    this.loadPrices();
    this.loadUserData();
    setInterval(this.loadPrices, 3000);
    console.log(this.props);
  };


  loadPrices = () => {
    // Get promise for VWAP of each currency
    const promArr = API.getAllPrices();

    // Break promise down into array
    let priceArr;
    promArr.then(res => {
      priceArr = res.map(index => {
        return index.data;
      });
      // Put Array in the state
      this.setState({
        btcTousd: priceArr[0],
        ltcTobtc: priceArr[1],
        ethTobtc: priceArr[2],
        dogeTobtc: priceArr[3]
      })
    });
  };

  loadUserData() {
    // Get promise from Mongoose
    const dbUser = API.getUserData(localStorage.getItem('_id'));

    // Resolve logged in user's currency balances to the state
    dbUser.then(res => {
      const openTrades = res.data.trades.filter(trade => trade.open);
      const displayTrades = openTrades.map(trade => {
        trade.bought_amount = BigNumber(trade.bought_amount).toString();
        trade.sold_amount = BigNumber(trade.sold_amount).toString();
        return trade;
      });

      this.setState({
        usd_balance: BigNumber(res.data.usd_balance).toString(),
        btc_balance: BigNumber(res.data.btc_balance).toString(),
        ltc_balance: BigNumber(res.data.ltc_balance).toString(),
        eth_balance: BigNumber(res.data.eth_balance).toString(),
        doge_balance: BigNumber(res.data.doge_balance).toString(),

        trades: displayTrades
      });
    }).catch(err => window.location.href = '/');
  };

  cancelOrder = (owner, trade) => {
    API.cancelOrder(owner, trade).then(() => {
      this.loadUserData(localStorage.getItem('_id'));
    });
  };

  placeOrder = (owner, buying, selling, buyAmount, sellAmount) => {
    API.placeOrder(owner, buying, selling, buyAmount, sellAmount).then(() => {
      this.loadUserData(localStorage.getItem('_id'));
    })
  };

render() {
  return (
    <Container>
      <Row>
        <h1>Current Prices</h1>
        <PriceDisplay prices={this.state} />
      </Row>
      <Row>
        <h1>Your Balances</h1>
        <BalanceDisplay balances={this.state} />
      </Row>
      <Row>
        <h1>Place an order</h1>
        <PlaceOrder match={this.props.match} placeOrder={this.placeOrder} />
      </Row>
      <Row>
        <h1>Open Trade Orders</h1>
        <OpenTrades trades={this.state.trades} cancelOrder={this.cancelOrder} />
      </Row>
    </Container>
  )
};
};

export default MockExchange;
