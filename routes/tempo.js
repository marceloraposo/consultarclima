var express = require('express');
var router = express.Router();
var tempo_controller = require('../controllers/tempo');

router.get('/ver/:lat/:lon', tempo_controller.ver);

module.exports = router;