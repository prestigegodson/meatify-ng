/** Animal Routes */

const auth = require('../auth/auth');
var express = require('express');
var router = express.Router();

const AnimalController = require('../controllers').Animal;

router.get('/', AnimalController.index);

module.exports = router;