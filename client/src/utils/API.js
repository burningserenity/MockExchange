import axios from 'axios';


export default {

  // Helper function to make an order

  placeOrder: function(id, buying, selling, buyAmount, sellAmount) {
    return axios.post(`/api/trades/${id}`, {
      buying: buying,
      selling: selling,
      buyAmount: buyAmount,
      sellAmount: sellAmount
    });
  },

  // Helper function to cancel and delete an open order
  
  cancelOrder: function(user, trade) {
    return axios.delete(`/api/trades/${user}/${trade}`);
  },

  // Helper function to hit API route for CryptoCompare
  
  getAllPrices: async function() {
    let p;
    let prices = [];
    const rates = [{buy: 'btc',sell: 'usd'}, {buy: 'ltc',sell: 'btc'}, {buy: 'eth',sell: 'btc'}, {buy: 'doge',sell: 'btc'}];
    rates.forEach(rate => {
      p = axios.get(`/api/currencies/${rate.buy}/${rate.sell}`);
      prices.push(p);
    });
    let pricesArr = await Promise.all(prices);
    return pricesArr;
  },

  // Helper function to get user from Mongoose

  getUserData: async function(id) {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    const balances = await axios.get(`/api/users/?id=${id}`);
    return balances;
  },

  parseToken: function (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}
