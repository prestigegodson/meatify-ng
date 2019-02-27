var express = require('express');
var router = express.Router();
const auth = require('../auth/auth');

//Controller
const UsersController = require('../controllers').Users;
const DashboardController = require('../controllers').Dashboard;

/** Create a new User */
router.post('/', UsersController.create);

router.get('/dashboard', auth.authenticate(), DashboardController.getUserInfo)

/** Change password */
router.put('/changePassword', auth.authenticate(), UsersController.changePassword);

/** User profile information */
router.get('/profile',  auth.authenticate(), UsersController.profile);

/** Upload images */
router.post('/upload',  auth.authenticate(), UsersController.upload);

router.post('/validatephone', UsersController.validatePhoneNumber);

module.exports = router;
