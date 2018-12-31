/** Admin Router */

const auth = require('../auth/auth');
var express = require('express');
var router = express.Router();

const AdminController = require('../controllers').Admin;

//ADMIN ACTIVITIES

/* List all system users. */
router.get('/users', auth.authenticate(), AdminController.listUsers);

/** View User profile */
router.get('/users/:userId', auth.authenticate(), AdminController.manageUser);

/** Change User role */
router.put('/users/:userId/roles', auth.authenticate(), AdminController.manageUserRole);

/** Add role ==> Move this to role section */
router.get('/roles', auth.authenticate(), AdminController.getAllRoles);

/** Create new role */
router.post('/roles', auth.authenticate(), AdminController.addNewRole);

/** Delete role */
router.delete('/roles/:roleId', auth.authenticate(), AdminController.destoryRoleById);

/** Disable User */
router.get('users/:userId/changeStatus', auth.authenticate(), AdminController.enableDisableUser);

module.exports = router;