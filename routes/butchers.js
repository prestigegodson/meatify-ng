/** Butchers routes */

var express = require('express');
var router = express.Router();

const ButchersController = require('../controllers').Butchers;
const auth = require('../auth/auth');
const utility =  require('../lib/Utility');

/**
 * CRUD butchers
 * GET Butcher's platoon
 * GET Search butcher
 */

 router.post('/', [auth.authenticate(), utility.verifyAdmin], ButchersController.create);

 router.get('/', ButchersController.getAllButchers);

 router.get('/:id', ButchersController.getButcherById);

 router.put('/:id', [auth.authenticate(), utility.verifyAdmin], ButchersController.updateButcher);

 router.delete('/:id', [auth.authenticate(), utility.verifyAdmin], ButchersController.deleteButcher);

 router.get('/:id/platoons', ButchersController.getButcherPlatoon);

//  router.get('/search', ButchersController.searchButcher);

module.exports = router;