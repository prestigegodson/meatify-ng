var express = require('express');
var router = express.Router();
const auth = require('../auth/auth');

//Controller
const UsersController = require('../controllers').Users;
const DashboardController = require('../controllers').Dashboard;

/** Create a new User */
router.post('/register', UsersController.create);

/** Change password */
router.put('/password_reset', UsersController.changePassword);

/** User Activities */
router.get('/dashboard', auth.authenticate(), DashboardController.getUserInfo);

router.post('/validatephone', UsersController.validatePhoneNumber);

/** User profile information */
router.get('/profile', auth.authenticate(), UsersController.profile);

/** Upload images */
router.post('/upload', auth.authenticate(), UsersController.upload);

module.exports = router;
