const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const withdraw_controller = require('../controllers/withdrawController');

//REST routing.
// PUT stores the new trade and
// POST list all of them
router.post('/', (req, res, next) => {
    console.log('post');

    q.push(function () { //Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = deposit_controller.post(req, res, next);
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });
});
//Add a new PastTrade to the DB
router.put('/', (req, res, next) => {
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = deposit_controller.put(req, res, next)
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });
});

module.exports = router;

