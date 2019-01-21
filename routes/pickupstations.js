/** PickUp Station Router */

var express = require('express');
var router = express.Router();

const PickUpStationsController = require('../controllers').PickUpStations;
const auth = require('../auth/auth');
const utility = require('../lib/Utility');

router.post('/', PickUpStationsController.create);

router.get('/', PickUpStationsController.getPickUpStations);

module.exports = router;