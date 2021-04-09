const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//DataBase Schema for the data the software is going to send
let PastTradesSchema = new Schema({
    currency: {type: String, required: true, max: 3},
    operation: {type: String, required: true, max: 10},
    date: {type: Date, required: true},
    amount: {type: Number, required: true},
});

//Exports a Mongoose Model have the scheman as a reference
module.exports = mongoose.model('PastTrades', PastTradesSchema);
