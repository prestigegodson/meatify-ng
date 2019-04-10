'use strict'
const paystack      = require('paystack')('sk_test_6ed45c1a82ead85b4134cc0eb30301957e11adbd');
const utility       = require('../lib/Utility');
const Users         = require("../db/models").Users;
const Platoons      = require('../db/models').Platoons;
const Orders        = require('../db/models').Orders;
const Transactions  = require('../db/models').Transactions;
const uuid          = require('uuid/v4');
const _             = require("lodash");
const seq           = require('../db/models').sequelize;

const EventMailer   = require("../events/EventMailer");
const Mailer        = new EventMailer();

module.exports = {

    async getNewAccessCode(req, res) {
        const customerId = req.query.customerid;
        const platoonId = req.query.cartid;
        // const deliveryType  = req.query.deliverid;
        // const addressID     = req.query.addressid;
        // const pickUpID      = req.query.pickupid;

        var customer = await Users.findById(customerId);
        var platoon = await Platoons.findById(platoonId);
        var amount = platoon.price_per_member;

        try {
            paystack.transaction.initialize({
                email: customer.email,
                amount: amount,
                reference: uuid(),
                channels: ['bank'],
                metadata: {
                    custom_fields: [
                        {
                            "display_name": "Started From",
                            "variable_name": "started_from",
                            "value": "sample charge card backend"
                        },
                    ]
                }
            }, function (error, body) {
                if (error) {
                    res.send({ error: error });
                    return;
                }
                res.send({ access_code: body.data.access_code });
            });

        } catch (err) { console.log(err) }
    },

    getReference(req, res) {
        var reference = req.params.reference;
        paystack.transaction.verify(reference, function (error, body) {
            if (error) {
                res.send({ error: error });
                return;
            }
            if (body.data.success) {
                // save authorization
                var auth = body.authorization;
                console.log(auth);
            }
            res.send(body);
        });
    },

    processPayment(req, res) {
        /**
         * Expected parameters
         * String transactionRef
         * String transactionType
         * List platoons
         * int delivery
         * String addressBook
         * String pickUp
         * long total_amount
         * long delivery_amount
         * long item_amount
         */
        const payload   = req.body;
        const userId    = req.user.id;
        
        seq.transaction(t => {

            let platoonLists = [];

            return Orders.create({
                user_id:            userId,
                order_no:           utility.generateOrderNo(),
                delivery_type:      payload.delivery == 1 ? 'STANDARD' : 'PICKUP',//x
                address_book_id:    payload.address_book,
                pick_up_id:         payload.pick_up,//<= add this to order
            },{transaction: t}).then(orders => {
                
                payload.platoons.map((id, index) => {
                    //platoon add new user
                    Platoons.findById(id).then(platoon => {
                        platoon.setUsers([userId]);
                        orders.setPlatoons([platoon.id]);
                        platoonLists.push(platoon);
                    });
                });
                
                return Transactions.create({
                    transaction_ref:    payload.transaction_ref,
                    transaction_type:   payload.transaction_type,
                    total_charge:       payload.total_amount,
                    items_amount:       payload.item_amount,
                    delivery_charge:    payload.delivery_amount,
                    payment_status:     payload.status,
                    order_id:           orders.id,

                }, {transaction: t}).then(trnx => {
                    //send order mail
                    Mailer.emit('SEND_ORDER_MAIL', 
                                { 
                                    orders: orders, 
                                    platoon: platoonLists, 
                                    tranx: trnx 
                                });
                });
            })     

        })
            .then(result => res.status(200).send({msg: "Your order has been placed", data: result}))
            .catch(err => res.status(400).send(err));
    }

    /*
    getTransaction(req, res){},
    getTransactionByOrderID(req, res){},
    getTransactionByRef(req, res){},
    getTransactionStatus(req, res){},
    updateTranStatus(req, res){},
    create(req, res){}
    */
}