/** Admin Router */

const auth          = require('../auth/auth');
var express         = require('express');
var router          = express.Router();
const utility       = require('../lib/Utility');

const AdminController = require('../controllers').Admin;

//ADMIN ACTIVITIES
router.get('/dashboard', [auth.authenticate(), utility.verifyAdmin], AdminController.getDashboard);

/* List all system users. */
router.get('/users', [auth.authenticate(), utility.verifyAdmin], AdminController.listUsers);

/** View User profile */
router.get('/users/:id', [auth.authenticate(), utility.verifyAdmin], AdminController.manageUser);

/** Change User role */
router.put('/users/:id/roles', [auth.authenticate(), utility.verifyAdmin], AdminController.manageUserRole);

/** Add role ==> Move this to role section */
router.get('/roles', [auth.authenticate(), utility.verifyAdmin], AdminController.getAllRoles);

/** Create new role */
router.post('/roles', [auth.authenticate(), utility.verifyAdmin], AdminController.addNewRole);

/** Delete role */
router.delete('/roles/:id', [auth.authenticate(), utility.verifyAdmin], AdminController.destoryRoleById);

/** Disable User */
router.get('/users/:id/changeStatus', [auth.authenticate(), utility.verifyAdmin], AdminController.enableDisableUser);

module.exports = router;