const express = require('express');
const bodyParser = require('body-parser');

// Importa Routes
const pastTrades = require('./routes/pastTrades.route');
const app = express();

//Acesso à BD
const mongoose = require('mongoose');
let url = 'mongodb+srv://dbUser:hylcc123@cluster0.6xqax.mongodb.net/myFirstDatabase';
let mongoDB = process.env.MONGODB_URI || url;
mongoose.connect(mongoDB,{useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na Ligação ao MongoDB'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', pastTrades);

//Servidor
let porto = 8000;
app.listen(porto, () => {
    console.log('Servidor em execução no porto: ' + porto);
});

