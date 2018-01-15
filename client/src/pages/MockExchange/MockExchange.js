import React, { Component } from 'react';
import { Col, Row, Container } from "../../components/Grid/";
import API from "../../utils/API";
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PriceDisplay } from "../../components/PriceDisplay/PriceDisplay";
import { BalanceDisplay } from "../../components/BalanceDisplay/BalanceDisplay";
import { OpenTrades } from "../../components/OpenTrades/OpenTrades";
import PlaceOrder from "../../components/PlaceOrder/PlaceOrder";

// The page with all the action

class MockExchange extends Component {
  state = {
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

  // Loads current prices, gets user _id from route parameter and
  // Reloads the prices every three seconds.

  componentDidMount() {
    this.loadPrices();
    this.loadUserData(this.props.match.params.id);
    setInterval(this.loadPrices, 3000);
  };

  loadPrices = () => {
    // Get promise for VWAP of each currency
    const promArr = API.getAllPrices();

    // Break promise down into array
    let priceArr;
    promArr.then(res => {
      priceArr = res.map(index => {
        return index.data
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

  loadUserData(id) {
    // Get promise from Mongoose
    const dbUser = API.getUserData(id);

    // Resolve logged in user's currency balances to the state
    dbUser.then(res => {
      this.setState({
        usd_balance: res.data.usd_balance,
        btc_balance: res.data.btc_balance,
        ltc_balance: res.data.ltc_balance,
        eth_balance: res.data.eth_balance,
        doge_balance: res.data.doge_balance,

        trades: res.data.trades
      });
    });
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
          <PlaceOrder match={this.props.match}/>
        </Row>
        <Row>
          <h1>Open Trade Orders</h1>
          <OpenTrades trades={this.state.trades} />
        </Row>
      </Container>
    )
  };
};

export default MockExchange;
