/** Platoon Router */

var express = require('express');
var router = express.Router();

const platoonController = require('../controllers').Platoons;
const auth          = require('../auth/auth');
const firebaseAuth  = require('../auth/fbAuth');
const utility       = require('../lib/Utility');

/**
 * POST /Create Platoons
 * GET / platoons by Id
 * PUT /Modifed Platoons
 * GET /Check if platoon is_completed
 * GET /Find platoon by butcher id
 * GET ref_no /Get platoons by ref_no
 * GET Users attached to platoon
 * GET Orders attached to platoon
 */

 router.get('/', platoonController.getPlatoons);

 router.get('/:id', platoonController.getPlatoonById);

 router.get('/:id/is_completed', platoonController.isPlatoonCompleted);

 router.get('/ref_no/:ref_no', [firebaseAuth.verifyToken], platoonController.getPlatoonByRefNo);

 router.put('/:id', [auth.authenticate(), utility.verifyAdmin], platoonController.updatePlatoon);

 router.delete('/:id', [auth.authenticate(), utility.verifyAdmin], platoonController.destoryPlatoon);

 router.post('/', [auth.authenticate(), utility.verifyAdmin], platoonController.create);

/*
 router.get('/:id/butcher/:butcher_id', platoonController.getButcherInfo);

 router.get('/:id/users', platoonController.getPlatoonWithUsers);

 router.get('/:id/orders', platoonController.getPlatoonWithOrders);
*/
 module.exports = router;