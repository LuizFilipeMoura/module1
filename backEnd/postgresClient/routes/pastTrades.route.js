const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const pastTrades_controller = require('../controllers/pastTradesController');

//REST routing.
// POST stores the new trade and
// GET list all of them
router.get('/', (req, res, next) => {
    q.push(function () { //Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = pastTrades_controller.get(req, res, next)
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });
});
//Add a new PastTrade to the DB
router.post('/', (req, res, next) => {
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = pastTrades_controller.post(req, res, next)
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });
});

module.exports = router;

