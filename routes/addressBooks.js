/** Address Book Router */

var express = require('express');
var router = express.Router();

const AddressBookController = require('../controllers').AddressBooks;
const auth = require('../auth/auth');

/**
 * CRUD Address Books
 * GET User address books
 * 
 */

 router.post('/', auth.authenticate(), AddressBookController.create);

 router.get('/', auth.authenticate(), AddressBookController.getAddress);

 router.get('/:id', auth.authenticate(), AddressBookController.getUserAddresses);

 router.put('/:id', auth.authenticate(), AddressBookController.updateAddress);

 router.delete('/:id', auth.authenticate(), AddressBookController.deleteAddress);

//  router.delete('/:id/user/:userId', auth.authenticate(), AddressBookController.deleteAddressByIdAndUserId);

module.exports = router;