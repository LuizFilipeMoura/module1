
//Imports the mongoose Model
const PastTrades = require("../models/pastTrades.model");

//LIST function, sends all past trades to the client
exports.list =  (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin', '*');
    PastTrades.find({}, function(err, trades) {
        var pastTrades = [];

        trades.forEach(function(trade) {
            pastTrades.push(trade);
        });

        res.send(pastTrades);
    });
};

//CREATE FUNCTION, stores the transation in the Database
exports.create =  (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin', '*');
    let pastTrade = new PastTrades(
        {
            currency: req.body.currency,
            operation: req.body.operation,
            date: new Date(),
            amount: req.body.amount
        }
    );
    pastTrade.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('PastTrade successfully created')
    })
};


