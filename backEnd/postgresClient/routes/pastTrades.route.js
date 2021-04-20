const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const pastTrades_controller = require('../controllers/pastTradesController');

//REST routing.
// PUT stores the new trade and
// POST list all of them
router.post('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () { //Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = pastTrades_controller.post(req, res, next);
            resolve(result)
        })
    });
});
//Add a new PastTrade to the DB
router.put('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = pastTrades_controller.put(req, res, next);

            resolve(result)
        })
    });
});
//Erase one pasttrade from the DB
router.delete('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = pastTrades_controller.deletePastTrade(req, res, next);
            resolve(result)
        })
    });
});

module.exports = router;

