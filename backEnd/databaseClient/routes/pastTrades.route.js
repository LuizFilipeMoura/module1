const express = require('express');
const router = express.Router();

//Importing the controller
const pastTrades_controller = require('../controllers/pastTrades.controller');

//REST routing.
// POST stores the new trade and
// GET list all of them
router.get('/', (req, res, next) => pastTrades_controller.list(req, res, next));
router.post('/', (req, res, next) => pastTrades_controller.create(req, res, next));

module.exports = router;

