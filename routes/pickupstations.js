/** PickUp Station Router */

var express = require('express');
var router = express.Router();

const StationsController = require('../controllers').PickUpStations;
const auth = require('../auth/auth');
const utility = require('../lib/Utility');


router.get('/', StationsController.getPickUpStations);

router.get('/:id', StationsController.getPickUpStationsByID);

router.post('/', [auth.authenticate(), utility.verifyAdmin], StationsController.create);

router.put('/:id', [auth.authenticate(), utility.verifyAdmin], StationsController.updatePickUpStations);

router.delete('/:id', [auth.authenticate(), utility.verifyAdmin], StationsController.deletePickUpStations);

module.exports = router;