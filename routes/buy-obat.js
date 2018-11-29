var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller')

/* GET home page. */
router.post('/', userController.buyObat)

module.exports = router;
