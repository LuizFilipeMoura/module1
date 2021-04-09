const express = require('express');
const router = express.Router();

//Importing the controller
const wallet_controller = require('../controllers/wallet.controller');


//REST routing.
// GET get the values of the wallet
// PUT edit the values of the wallet
router.get('/', (req, res, next) => wallet_controller.get(req, res, next));
router.put('/', (req, res, next) => wallet_controller.put(req, res, next));
router.post('/', (req, res, next) => wallet_controller.create(req, res, next));

module.exports = router;

