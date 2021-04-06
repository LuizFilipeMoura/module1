const express = require('express');
const router = express.Router();

// Colocar controller que ainda não foi criado
const pastTrades_controller = require('../controllers/pastTrades.controller');
// teste simples

router.get('/', (req, res, next) => pastTrades_controller.list(req, res, next));
router.post('/', (req, res, next) => pastTrades_controller.create(req, res, next));

module.exports = router;

