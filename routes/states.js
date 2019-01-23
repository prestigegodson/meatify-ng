/** Address Book Router */

var express = require('express');
var router = express.Router();

const StatesController = require('../controllers').States;

/**
 * CRUD States
 */

 router.get('/', StatesController.getStates);

 router.get('/:id', StatesController.getStateById);

module.exports = router;