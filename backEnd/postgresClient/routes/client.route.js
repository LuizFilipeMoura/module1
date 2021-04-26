const express = require('express');
const router = express.Router();
const q = require('../index');

//Importing the controller
const client_controller = require('../controllers/clientController');


//REST routing.
// POST '/signin' get the values that user based on the email and password given
// POST '/signup' sign up the user
// PUT for update
// POST '/' Lists the users

router.post('/signin', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.signIn(req, res, next);
            resolve(result)
        })
    });

});

//Register the user
router.post('/signup', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.signUp(req, res, next);
            resolve(result)
        })
    });

});

//Updates the user
router.put('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.put(req, res, next);
            resolve(result)
        })
    });
});

//Updates the user
router.put('/changepassword', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.changepassword(req, res, next);
            resolve(result)
        })
    });
});


//Gets all the names and email of all users
router.post('/', (req, res, next) => {
    //Pushes promise into the queue, when it is resolved the user receives the data
    q.push(function () {//Add transaction to the queue and resolves if the promise is resolved
        return new Promise(function (resolve, reject) {
            const result = client_controller.getClients(req, res, next);
            resolve(result)
        })
    });

});

module.exports = router;

