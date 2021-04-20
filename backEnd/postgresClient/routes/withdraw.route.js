const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const withdraw_controller = require('../controllers/withdrawController');

//REST routing.
// PUT stores withdraw and
// POST list all of them
router.post('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () { //Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = withdraw_controller.post(req, res, next);
            resolve(result)
        })
    });
});
//Add a new Withdraw to the DB
router.put('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = withdraw_controller.put(req, res, next)
            resolve(result)
        })
    });
});

module.exports = router;

