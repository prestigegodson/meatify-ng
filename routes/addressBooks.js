/** Address Book Router */

var express     = require('express');
var router      = express.Router();

const AddressBookController = require('../controllers').AddressBooks;
const auth          = require('../auth/auth');
const fbAuth        = require('../auth/fbAuth');


/**
 * CRUD Address Books
 * GET User address books
 * Authenticate all route
 */

 router.use(fbAuth.verifyToken);

 router.post('/', AddressBookController.create);

 router.get('/', AddressBookController.getAddress);

 router.get('/:uid', AddressBookController.getUserAddresses);

 router.put('/:uid', AddressBookController.updateAddress);

 router.delete('/:uid', AddressBookController.deleteAddress);

//  router.delete('/:id/user/:userId', auth.authenticate(), AddressBookController.deleteAddressByIdAndUserId);

module.exports = router;