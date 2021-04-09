const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//DataBase Schema for the data the software is going to send
let WalletSchema = new Schema({
    dollarAmount: {type: Number, required: true},
    poundAmount: {type: Number, required: true},
});

//Exports a Mongoose Model have the scheman as a reference
module.exports = mongoose.model('Wallet', WalletSchema);
