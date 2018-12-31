/** Order Router */

var express = require('express');
var router = express.Router();

const OrdersController = require('../controllers').Orders;

/**
 * CRU Orders
 * GET User Orders
 * GET Order Address by AddressBookID
 * GET Platoon Information by PlatoonID
 * PUT Update order status
 */

router.post('/', OrdersController.create);

router.get('/', OrdersController.fetchOrders);

router.get('/:id', OrdersController.getOrderById);

router.get('/user/:userId', OrdersController.getAllOrderByUserID);

router.get('/:id/status', OrdersController.getOrderStatus);

router.put('/:id/status'. OrdersController.updateStatus);

router.get('/:id/user/:userId', OrdersController.getOrderByIdANDUserID);

router.get('/:id/platoon', OrdersController.getPlatoonInfo);

module.exports = router;