/** Admin Router */

const admin         = require('../auth/auth');
var express         = require('express');
var router          = express.Router();
const utility       = require('../lib/Utility');

const AdminController = require('../controllers').Admin;

//ADMIN ACTIVITIES 
router.get('/dashboard', admin.authenticate(), AdminController.getDashboard);

/* List all system users. */
router.get('/users', admin.authenticate(), AdminController.listUsers);

/** View User profile */
router.get('/users/:uid', admin.authenticate(), AdminController.manageUser);

/** Disable User */
router.get('/users/:uid/changeStatus', admin.authenticate(), AdminController.enableDisableUser);

/** For admin model only */
/*
router.put('/users/:uid/roles', [auth.authenticate(), utility.verifyAdmin], AdminController.manageUserRole);
router.get('/roles', [auth.authenticate(), utility.verifyAdmin], AdminController.getAllRoles);
router.post('/roles', [auth.authenticate(), utility.verifyAdmin], AdminController.addNewRole);
router.delete('/roles/:uid', [auth.authenticate(), utility.verifyAdmin], AdminController.destoryRoleById);
*/
module.exports = router;