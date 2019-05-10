var express = require('express');
var router = express.Router();
var tempo_controller = require('../controllers/tempo');

router.get('/ver/:lat/:lon', tempo_controller.ver);
router.get('/forecast/:lat/:lon', tempo_controller.forecast);

module.exports = router;