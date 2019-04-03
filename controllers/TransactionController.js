'use strict'
const paystack = require('paystack')('sk_test_6ed45c1a82ead85b4134cc0eb30301957e11adbd');
const utility = require('../lib/Utility');
const Users = require("../db/models").Users;
const Platoons = require('../db/models').Platoons;
const uuid = require('uuid/v4');

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
            res.send(body.data.gateway_response);
        });
    },

    /*
    getTransaction(req, res){},
    getTransactionByOrderID(req, res){},
    getTransactionByRef(req, res){},
    getTransactionStatus(req, res){},
    updateTranStatus(req, res){},
    create(req, res){}
    */
}