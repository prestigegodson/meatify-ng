/** Animal Routes */

const auth      = require('../auth/auth');
var express     = require('express');
var router      = express.Router();
const utility   = require('../lib/Utility');

const AnimalController = require('../controllers').Animal;

router.get('/', AnimalController.index);

router.get('/meatify', AnimalController.getMeatify);

router.post('/', [auth.authenticate(), utility.verifyAdmin], AnimalController.createAnimal);

router.put('/:id', [auth.authenticate(), utility.verifyAdmin], AnimalController.updateAnimal);

router.delete('/:id', [auth.authenticate(), utility.verifyAdmin], AnimalController.deleteAnimal);

module.exports = router;