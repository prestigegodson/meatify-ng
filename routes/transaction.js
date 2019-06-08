/** Transaction Router */

const auth          = require('../auth/auth');
const firebaseAuth  = require('../auth/fbAuth');
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

 router.get('/:id', firebaseAuth.verifyToken, TransController.getTransByID);

 router.post('/new-access-code', firebaseAuth.verifyToken, TransController.getNewAccessCode);

 router.get('/verify/:reference', firebaseAuth.verifyToken, TransController.getReference);

 router.post('/process-payment', firebaseAuth.verifyToken, TransController.processPayment);

 router.get('/trnx_ref/:ref', firebaseAuth.verifyToken, TransController.getTransactionByRef);

 router.get('/', [auth.authenticate(), utility.verifyAdmin], TransController.getAllTransactions);

/*

 router.get('/:id/order/:orderId', TransController.getTransactionByOrderID);

 router.get('/:transac_ref', TransController.getTransactionByRef);

 router.get('/:id/status', TransController.getTransactionStatus);

 router.put('/:id/status', TransController.updateTranStatus);

 router.post('/', TransController.create);
*/
module.exports = router;