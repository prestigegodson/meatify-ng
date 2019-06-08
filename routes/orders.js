/** Order Router */

const express   = require('express');
const router    = express.Router();

const auth          = require('../auth/auth');
const firebaseAuth  = require('../auth/fbAuth');
const utility       = require('../lib/Utility');
const OrdersController = require('../controllers').Orders;

/**
 * CRU Orders
 * GET User Orders
 * GET Order Address by AddressBookID
 * GET Platoon Information by PlatoonID
 * PUT Update order status
 */

// router.post('/', OrdersController.create); 

router.get('/', [auth.authenticate(), utility.verifyAdmin], OrdersController.fetchOrders);

router.patch('/:id', [auth.authenticate(), utility.verifyAdmin], OrdersController.updateOrderStatus);


router.get('/user', firebaseAuth.verifyToken, OrdersController.getUserOrders);

router.get('/:id', firebaseAuth.verifyToken, OrdersController.getOrderByRef);

router.get('/:id/platoons', firebaseAuth.verifyToken, OrdersController.getPlatoonInfo);

router.get('/order_no/:order_no', firebaseAuth.verifyToken, OrdersController.getOrderByOrderNo);

module.exports = router;