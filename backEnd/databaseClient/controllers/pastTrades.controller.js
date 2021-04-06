
//Test Function
const PastTrades = require("../models/pastTrades.model");

exports.test = function (req, res) {
    res.send('Hello! Controller`s test');
};

exports.list =  (req, res, next) => {
    PastTrades.find({}, function(err, trades) {
        var pastTrades = [];

        trades.forEach(function(trade) {
            pastTrades.push(trade);
        });

        res.send(pastTrades);
    });
};

//CREATE FUNCTION
exports.create =  (req, res, next) => {
    console.log(req.body);
    let pastTrade = new PastTrades(
        {
            currency: req.body.currency,
            operation: req.body.operation,
            date: req.body.date,
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
