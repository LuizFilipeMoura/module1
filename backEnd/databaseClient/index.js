const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Import Routes
const pastTrades = require('./routes/pastTrades.route');
const wallet = require('./routes/wallet.route');
const app = express();
app.use(cors())

//Access to the database
const mongoose = require('mongoose');
let url = 'mongodb+srv://dbUser:hylcc123@cluster0.6xqax.mongodb.net/myFirstDatabase';
let mongoDB = process.env.MONGODB_URI || url;
mongoose.connect(mongoDB,{useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error conection with Mongo'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', pastTrades);
app.use('/wallet', wallet);


//Opens server
let port = 8000;
app.listen(port, () => {
    console.log('Server open in port: ' + port);
});

