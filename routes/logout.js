var express = require('express');
var router = express.Router();
var registerProcessController = require('../controllers/registration.controller')

/* GET home page. */
router.get('/', registerProcessController.logout);

module.exports = router;
