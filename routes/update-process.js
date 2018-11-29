var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin.controller')

/* GET home page. */
router.post('/', adminController.update)

module.exports = router;
