
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let queue = require('queue');

let q = queue({ results: [], autostart: true });
module.exports = q;
// Import Routes
const pastTrades = require('./routes/pastTrades.route');
const wallets = require('./routes/wallet.route');
const clients = require('./routes/client.route');

const app = express();
app.use(cors());


// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Routing
app.use('/pasttrades', pastTrades);
app.use('/wallets', wallets);
app.use('/clients', clients);



//Opens server
let port = 8000;
app.listen(port, () => {
    console.log('Server open in port: ' + port);
});


