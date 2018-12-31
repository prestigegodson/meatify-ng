var express = require('express');
var router = express.Router();
const auth = require('../auth/auth');

//Controller
const UsersController = require('../controllers').Users;

/** Create a new User */
router.post('/', UsersController.create);

/** Change password */
router.put('/changePassword', auth.authenticate(), UsersController.changePassword);

/** User profile information */
router.get('/profile',  auth.authenticate(), UsersController.profile);

/** Upload images */
router.post('/upload',  auth.authenticate(), UsersController.upload);

module.exports = router;
