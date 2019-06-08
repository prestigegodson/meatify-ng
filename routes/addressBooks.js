/** Address Book Router */

var express     = require('express');
var router      = express.Router();

const AddressBookController = require('../controllers').AddressBooks;
const auth      = require('../auth/auth');
const admin     = require('../auth/fbAuth');


/**
 * CRUD Address Books
 * GET User address books
 * Authenticate all route
 */

 router.use(admin.verifyToken);

 router.post('/', AddressBookController.create);

 router.get('/', AddressBookController.getAddress);

 router.get('/:id', AddressBookController.getUserAddresses);

 router.put('/:id', AddressBookController.updateAddress);

 router.delete('/:id', AddressBookController.deleteAddress);

//  router.delete('/:id/user/:userId', auth.authenticate(), AddressBookController.deleteAddressByIdAndUserId);

module.exports = router;