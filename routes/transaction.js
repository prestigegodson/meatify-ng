/** Transaction Router */

const auth      = require('../auth/auth');
var express     = require('express');
var router      = express.Router();
const utility   = require('../lib/Utility');

const TransController = require('../controllers').Transactions;

/**
 * GET Transaction record
 * GET Order transaction with OrderID
 * GET Transaction with transaction ref 
 * PUT update transaction status
 * POST payment webhook using transaction reference
 */
 
 router.post('/new-access-code', auth.authenticate(), TransController.getNewAccessCode);

 router.get('/verify/:reference', auth.authenticate(), TransController.getReference);

 router.post('/process-payment', auth.authenticate(), TransController.processPayment);

 router.get('/', [auth.authenticate(), utility.verifyAdmin], TransController.getAllTransactions);

 router.get('/:id', auth.authenticate(), TransController.getTransByID);

 router.get('/trnx_ref/:ref', auth.authenticate(), TransController.getTransactionByRef);

/*

 router.get('/:id/order/:orderId', TransController.getTransactionByOrderID);

 router.get('/:transac_ref', TransController.getTransactionByRef);

 router.get('/:id/status', TransController.getTransactionStatus);

 router.put('/:id/status', TransController.updateTranStatus);

 router.post('/', TransController.create);
*/
module.exports = router;