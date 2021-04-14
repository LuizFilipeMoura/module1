const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const client_controller = require('../controllers/clientController');


//REST routing.
// POST/signin get the values that user based on the email and password given
// POST/signup sign up the user
router.post('/signin', (req, res, next) => {
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.signIn(req, res, next);
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });

});
//Register the user
router.post('/signup', (req, res, next) => {
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.signUp(req, res, next);
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });

});

router.put('/', (req, res, next) => {
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.put(req, res, next);
            if(result === -1){
                reject(result)
            }
            resolve(result)
        })
    });

});

module.exports = router;

