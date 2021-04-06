// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dbUser:hylcc123@cluster0.6xqax.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("myFirstDatabase").collection("pastTrades");
//     // perform actions on the collection object
//     client.close();
// });

// Configurar acesso à BD.
const mongoose = require('mongoose');
let url = 'mongodb+srv://dbUser:hylcc123@cluster0.6xqax.mongodb.net/myFirstDatabase';
let mongoDB = process.env.MONGODB_URI || url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na Ligação ao MongoDB'));
