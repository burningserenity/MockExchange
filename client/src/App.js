import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import MockExchange from "./pages/MockExchange/MockExchange";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Error from "./pages/Error/Error";

class App extends Component {
  constructor() {
    super();

    this.state = {
      user_name: "user_name",
      usd_balance: 100000.00,
      btc_balance: 0,
      ltc_balance: 0,
      eth_balance: 0,
      doge_balance: 0,
      trades: []
    }
  };

  test() {
    console.log(this.props);
  };


  render() {
    return (
      <div className="App">
        <h1>Hello</h1>
        <BrowserRouter>
          <Switch>
            <Route exact path="/exchange" component={MockExchange} />
            <Route exact path="/" component={Login} />
            <Redirect from="/login" to='/' />
            <Route exact path="/registration" component={Registration} />
            <Redirect from="/register" to='/registration' />
            <Route exact path="/error" component={Error} />
            <Redirect from="*" to='/exchange' />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
