/** Transaction Router */

const auth = require('../auth/auth');
var express = require('express');
var router = express.Router();

const TransController = require('../controllers').Transactions;

/**
 * GET Transaction record
 * GET Order transaction with OrderID
 * GET Transaction with transaction ref 
 * PUT update transaction status
 * POST payment webhook using transaction reference
 */

 router.get('/:id', auth.authenticate(), TransController.getTransaction);

 router.get('/:id/order/:orderId', TransController.getTransactionByOrderID);

 router.get('/:transac_ref', TransController.getTransactionByRef);

 router.get('/:id/status', TransController.getTransactionStatus);

 router.put('/:id/status', TransController.updateTranStatus);

 router.post('/', TransController.create);

module.exports = router;