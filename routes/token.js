var express = require('express');
var router = express.Router();

const tokenController = require("../controllers").Token;

router.post('/', tokenController.login);

module.exports = router;