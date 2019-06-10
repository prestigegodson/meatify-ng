'use strict'
const paystack      = require('paystack')('sk_test_6ed45c1a82ead85b4134cc0eb30301957e11adbd');
const utility       = require('../lib/Utility');
const Users         = require("../db/models").Users;
const Platoons      = require('../db/models').Platoons;
const Orders        = require('../db/models').Orders;
const Transactions  = require('../db/models').Transactions;
const uuid          = require('uuid/v4');
const _             = require("lodash");
const sequelize     = require("../db/models").sequelize;
const seq           = require('../db/models').sequelize;

const EventMailer   = require("../events/EventMailer");
const Mailer        = new EventMailer();

module.exports = {

    async getNewAccessCode(req, res) {
        /**
         * 
         */
        const { platoons, deliverId, addressId, pickUpId } = req.body;
        const LOGGED_IN_USER_ID = req.user.uid;

        const customer        = await Users.findById(LOGGED_IN_USER_ID);
        const customFields    = [];
        const platoonObjRep   = [];
        var amount            = 0;
        
        function me(){
            return new Promise(resolve => {
                platoons.map(async (id, index) => {
                    //platoon add new user
                    const platoon = await Platoons.findOne({where:{id: id}, include:[]});
                    const users   = await platoon.getUsers();

                    if(platoon.is_completed){
                        
                        platoonObjRep.push({'platoon': platoon, 'completed': true});

                    }else if(_.isEqual(platoon.no_of_member, users.length)){
                        
                        await Platoons.update({is_completed: true});
                        platoonObjRep.push({'platoon': platoon, 'completed': true});

                    }else{
                        customFields.push({
                            "display_name": customer.email,
                            "variable_name": platoon.ref_no,
                            "value": {amount: platoon.price_per_member, customer: customer.id}
                        });
                        //platoonObjRep.push({'platoon': platoon, 'completed': false});
                    }
                    amount = _.add(amount, platoon.price_per_member);  
                    if((platoons.length - 1) == index){resolve(amount);}
                    
                });

            })
        }

        await me();

        try {
            paystack.transaction.initialize({
                email: customer.email,
                amount: amount,
                reference: uuid(),
                channels: ['card'],
                metadata: {
                    custom_fields: customFields
                }
            }, function (error, body) {
                if (error) {
                    res.send(utility.errorResp(error, null));
                    return;
                }
                res.send(utility.successResp("", {
                    data: body.data,
                    'platoons': _.isEmpty(platoonObjRep) ? null : platoonObjRep
                }));
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
            res.send(utility.successResp("", body));
        });
    },

    async processPayment(req, res) {
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
        const userId    = req.user.uid;
        let orderInfo   = {};
        
        seq.transaction(t => {

            let platoonLists = [];

            return Orders.create({
                user_id:            userId,
                order_no:           utility.generateOrderNo(),
                delivery_type:      payload.delivery == 1 ? 'STANDARD' : 'PICKUP',//x
                address_book_id:    payload.address_book,
                pick_up_id:         payload.pick_up,//<= add this to order
            },{transaction: t}).then(orders => {

                orderInfo = orders;
                                
                return Transactions.create({
                    transaction_ref:    payload.transaction_ref,
                    transaction_type:   payload.transaction_type,
                    total_charge:       payload.total_amount,
                    items_amount:       payload.item_amount,
                    delivery_charge:    payload.delivery_amount,
                    payment_status:     'successful',
                    order_id:           orders.id,

                }, {transaction: t}).then(trnx => {
                    //send order mail

                    payload.platoons.map((id, index) => {
                        //platoon add new user
                        return Platoons.findOne({where:{id: id}}).then( async function(platoon) {
                            //
                            let users = await platoon.getUsers();
                            if(platoon.is_completed){
                                platoonLists.push({'platoon': platoon,'is_completed': true});
                                //put it in pending state

                            }else if(_.isEqual(platoon.no_of_member, users.length)){
                                
                                await Platoons.update({is_completed: true});
                                platoonLists.push({'platoon': platoon,'is_completed': true});
                                //put in a pending state
                            }else{
                                
                                await platoon.setUsers([userId]);
                                await orders.setPlatoons([platoon.id]);                                
                                platoonLists.push({'platoon': platoon,'is_completed': false});
                            }

                        });
                    });

                    Mailer.emit('SEND_ORDER_MAIL', 
                                { 
                                    orders: orders, 
                                    platoon: platoonLists, 
                                    tranx: trnx 
                                });
                });
            })     

        })
            .then(result => res.status(200).send({msg: "Your order has been placed", data: orderInfo}))
            .catch(err => res.status(400).send(err.message));
    },
    getAllTransactions(req, res){
        const { Op } = sequelize;
        const options = {
            page: 1,
            paginate: 25,
            order: [['created_at', 'DESC']],
        }        
        Transactions.paginate(options)
                    .then((docs, pages, total) => res.status(200).send(utility.successResp("", {docs, pages, total})))
                    .catch(err => res.status(400).send(utility.errorResp(err.message, "")));
    },
    getTransByID(req, res){
        const TRANSACTION_ID = req.params.id;
        Transactions
                    .findOne({where:{id:TRANSACTION_ID}, 
                        include:[
                            {
                                model:Orders, 
                                as: 'order',
                                include: [
                                    {model:Platoons, as: 'platoons'},
                                    {model:Users, as: 'user', attributes:['id','email','profile_pic_url']}
                                ]
                            }
                        ]
                    })
                    .then(transaction => res.status(200).send(utility.successResp("", transaction)))
                    .catch(err => res.status(400).send(utility.errorResp(err.message,"")));
    },
    
    getTransactionByRef(req, res){
        const REF_ID = req.params.ref;
        Transactions
                    .findOne({where:{transaction_ref:REF_ID}, 
                        include:[
                            {
                                model:Orders, 
                                as: 'order',
                                include: [
                                    {model:Platoons, as: 'platoons'},
                                    {model:Users, as: 'user', attributes:['id','email','profile_pic_url']}
                                ]
                            }
                        ]
                    })
                    .then(transaction => res.status(200).send(utility.successResp("", transaction)))
                    .catch(err => res.status(400).send(utility.errorResp(err.message,"")));        
    }
}