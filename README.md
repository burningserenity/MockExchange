# MockExchange

A mock cryptocurrency exchange to be used as a teaching tool.

Symbol glossary:

  USD: United States Dollar

  BTC: Bitcoin

  LTC: Litecoin

  ETH: Ethereum

  DOGE: Dogecoin

  VWAP: Volume Weighted Average Price

The available trades are:

  USD/BTC

  BTC/LTC

  BTC/ETH

  BTC/DOGE

and vice versa.

This app is still in alpha. To get started, ensure Node.js 9.4.0, npm 5.6.0, Yarn 1.3.2, and MongoDB 3.6.0 or greater are installed on your machine.

Next, there are some global npm packages to install:

  npm i -g concurrently nodemon react-scripts

These allow the development server to start

Next install the local npm packages. From the application's root directory:

  npm i && cd client && npm i && cd ..

Start from the app's root directory with this command:

  npm run dev

After a moment the front and backend portions of the app will start.

The first page that opens is the log in page, but there aren't any users so this isn't very useful at the moment.

Click on the Register link just below the text input field.

Enter any name in the text input field on this page. Any subsequent names must be unique or you won't progress past this page.

Next, you will come to the main page. The first thing you will notice is a list of prices. 
These are the VWAPs calculated from Bittrex, HitBTC, and YoBit, via the CryptoCompare module. 
These prices are queried every three seconds, and re-render automatically.

The next portion of this page shows the balances your user has in each currency. 
By default, each user starts with 100000 USD and 0 of everything else. 
As of now, it is acceptible to have balances far in the negative.

The third portion is two forms for making trades. 

The top one allows you to buy and sell BTC using USD. 
The input beneath the word "Amount" is the amount purchased. 
The input beneath the word "Offer" is the amount sold. 
Two radio buttons beneath those determine whether you buy BTC or sell it.

The bottom form allows you to trade BTC for either LTC, ETH, or DOGE.
There are three radio buttons which determine the altcoin to trade.
The amount and offer inputs work similarly to the previous: amount means buy, offer means sell.
The last two radio buttons work like the two for the previous form, and determine whether you are buying or selling the chosen altcoin.

Trades are posted and can be canceled until they are executed. The balance of the currency you are offering will be debited. A trade is executed when the VWAP for that currency is less than or equal to the amount you are offering. When a trade is executed it will disappear from the screen and your balance for the currency you just bought will increase accordingly.

Finally, if you were to go back to the log in page, you can log in using the name of the user you just created.
For now you have to click the "Enter" button for this to work, rather than pressing the enter/return key.

There are also some other API routes you're welcome to investigate. Most are in /routes/user_routes.js, with one in /routes/currency_routes.js.

To get the current VWAP for a given currency, point you client to http://localhost:8080/api/currencies/:buy/:sell
The two parameters at the end determine the pairing.
For instance, if you want to see how many US Dollars a Bitcoin costs, do http://localhost:8080/api/currencies/BTC/USD.

To get a list of all users: http://localhost:8080/api/users
To get a user by _id: http://localhost:8080/api/users/?id={_id}
To get a user by name: http://localhost:8080/api/users/?user_name={name}

To add a user, do a POST request to http://localhost:8080/api/users with a body of user_name={name}

To delete a user, do a DELETE request to http://localhost:8080/api/users/:id, where id is the _id field for the user in the database.

Finally, to make a transaction, do a PUT request to http://localhost:8080/api/users/:id, where id is the _id field for the user in the database, 
with a body including buying={currency to buy} buyAmount={amount to buy} selling={currency to sell} sellAmount={amount to sell}
