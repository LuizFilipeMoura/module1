const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const deposit_controller = require('../controllers/depositController');

//REST routing.
// PUT stores the deposit and
// POST list all of them
router.post('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () { //Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = deposit_controller.post(req, res, next);
            resolve(result)
        })
    });
});
//Add a new Deposit to the DB
router.put('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = deposit_controller.put(req, res, next)
            resolve(result)
        })
    });
});

module.exports = router;

