/** Order Router */

const express   = require('express');
const router    = express.Router();

const auth      = require('../auth/auth');
const utility   = require('../lib/Utility');
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

router.get('/user', auth.authenticate(), OrdersController.getUserOrders);

router.get('/:id', auth.authenticate(), OrdersController.getOrderByRef);

router.patch('/:id', [auth.authenticate(), utility.verifyAdmin], OrdersController.updateOrderStatus);

router.get('/:id/platoons', auth.authenticate(), OrdersController.getPlatoonInfo);

router.get('/order_no/:order_no', auth.authenticate(), OrdersController.getOrderByOrderNo);

module.exports = router;