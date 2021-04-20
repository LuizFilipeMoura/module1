
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let queue = require('queue');

//Starts the queue
let q = queue({ results: [], autostart: true });
//Export the queue
module.exports = q;

// Import Routes
const pastTrades = require('./routes/pastTrades.route');
const wallets = require('./routes/wallet.route');
const clients = require('./routes/client.route');
const withdraws = require('./routes/withdraw.route');
const deposits = require('./routes/deposit.route');

const app = express();
app.use(cors());

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Routing
app.use('/pasttrades', pastTrades);
app.use('/wallets', wallets);
app.use('/clients', clients);
app.use('/withdraws', withdraws);
app.use('/deposits', deposits);

//Opens server
let port = 8000;
let host = '0.0.0.0';

app.listen(port, host, () => {
    console.log('Server open in port: ' + port);
});


