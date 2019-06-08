var express     = require('express');
var router      = express.Router();
const auth      = require('../auth/auth');
const firebaseAuth      = require('../auth/fbAuth');

//Controller
const UsersController = require('../controllers').Users;
const DashboardController = require('../controllers').Dashboard;

/** Create a new User */
// router.post('/register', UsersController.create);

/** Change password */
// router.put('/password_reset', UsersController.changePassword);

/** Create or Update user through firebase */
router.post('/register', UsersController.firebaseUserUpdate);

/** User Activities */
router.get('/dashboard', firebaseAuth.verifyToken, DashboardController.getUserInfo);

router.post('/validatephone', UsersController.validatePhoneNumber);

/** User profile information */
router.get('/profile', firebaseAuth.verifyToken, UsersController.profile);

/** Upload images */
router.post('/upload', firebaseAuth.verifyToken, UsersController.upload);

module.exports = router;
