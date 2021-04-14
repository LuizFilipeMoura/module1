const express = require('express');
const router = express.Router();
const q = require('../index');
//Importing the controller
const wallet_controller = require('../controllers/walletController');


//REST routing.
// GET get the values of the wallet
// PUT edit the values of the wallet
router.post('/', (req, res, next) => {

    q.push(function () {
        return new Promise(function (resolve, reject) {
            const result = wallet_controller.post(req, res, next);
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });
});
router.put('/', (req, res, next) => {

    q.push(function () {
        return new Promise(function (resolve, reject) {
            const result = wallet_controller.put(req, res, next);
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });
});

module.exports = router;

