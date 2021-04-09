
//Imports the mongoose Model
const Wallet = require("../models/wallet.model");

//PUT FUNCTION, updates the amount of money in the wallet
exports.put =  async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    //Search and Update the value of the wallet
    Wallet.findByIdAndUpdate("606f467ee5af255278baab6a", req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Wallet`
                });
            } else res.send({ message: "Wallet was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Wallet"
            });
        });
};

//GET function, get the value on that wallet
exports.get =  (req, res, next) => {
    Wallet.find({_id: "606f467ee5af255278baab6a"}, function(err, wallet) {
        res.send(wallet);
    });
};

//CREATES a new wallet, not used
exports.create =  (req, res, next) => {
    res.header( 'Access-Control-Allow-Origin', '*');
    let wallet = new Wallet(
        {
            id: 1,
            dollarAmount: req.body.dollar,
            poundAmount: req.body.pound,
        }
    );
    wallet.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('PastTrade successfully created')
    })
};
