/** Order Controller */
const Orders            = require('../db/models').Orders;
const Platoons          = require('../db/models').Platoons;
const Transactions      = require('../db/models').Transactions;
const AddressBooks      = require('../db/models').AddressBooks;
const PickUpStations    = require('../db/models').PickUpStations;
const States            = require('../db/models').States;
const Cities            = require('../db/models').Cities;
const Users             = require('../db/models').Users;
const PlatoonImage      = require('../db/models').PlatoonImage;

const utility           = require('../lib/Utility');
const _                 = require('lodash');

module.exports = {
    create(req, res){
        let check = Orders.isPlatoonCompleted() ? true : false;
        if(check == true)
            return res.status(401).send({msg: 'Platoon already completed, hold on for the next platoon'});
        
        Orders.create(_.pick(req.body, 
                            [
                                'user_id', 
                                'address_book_id', 
                                'platoon_id', 
                                'status'
                            ]))
                            .then(order => utility.validateRes(order, res) )
                            .catch(err => res.status(400).send({msg:err.message}));
    },
    fetchOrders(req, res){
        Orders.findAll({include: [
            {
                model : Platoons,
                as: 'platoons',
                through: { attributes: [] }
            },
            {
                model: Transactions,
                require: false
            },
            {
                model: AddressBooks,
                'as' : 'address',
                require: false,
                include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
            },
            {
                model: PickUpStations,
                require: false,
                include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
            }
        ]})
        .then(orders => res.status(200).send(utility.successResp("", orders)))
        .catch(err => res.status(400).send(utility.errorResp(err.message, "")));
    },
    getOrderByRef(req, res){
        let order = Orders.find(
                {where: {id: req.params.id}, 
            include: [
                {
                    model : Platoons,
                    as: 'platoons',
                    through: { attributes: [] },
                    include:[
                        {
                            model: PlatoonImage,
                            as: 'images',
                            required: false
                        },{
                            model: Users,
                            as: 'users',
                            required: false,
                            attributes: ['id', 'email', 'profile_pic_url'],                            
                        }
                    ]
                },
                {
                    model: Transactions,
                    require: false
                },
                {
                    model: AddressBooks,
                    'as' : 'address',
                    require: false,
                    include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
                },
                {
                    model: PickUpStations,
                    require: false,
                    include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
                }
                ]})
                .then(order => res.status(200).send(utility.successResp("", order)))
                .catch(err => res.status(400).send(utility.errorResp(err.message, "")))
    },
    updateOrderStatus(req, res){
        const ORDERID   = req.params.id;
        const STATUS    = req.body.status;

        Orders.update({status: STATUS}, {where:{id:ORDERID}}).then(order => {
            res.status(200).send(utility.successResp("Update successful", order));
        }).catch(err => res.status(400).send(utility.errorResp(err.message, "")));
    },

    getUserOrders(req, res){
        let USERID = req.user.id;
        Orders.findAll({where: {user_id: USERID}, include: [
            {
                model : Platoons,
                as: 'platoons',
                through: { attributes: [] }
            },
            {
                model: Transactions,
                require: false
            },
            {
                model: AddressBooks,
                'as' : 'address',
                require: false,
                include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
            },
            {
                model: PickUpStations,
                require: false,
                include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
            }
        ]})
        .then(orders => res.status(200).send(utility.successResp("", orders)))
        .catch(err => res.status(400).send(utility.errorResp(err.message, "")));        
    },
    getPlatoonInfo(req, res){
        const ORDERID = req.params.id;
        Orders.findOne({where:{id: ORDERID}}).then(order => {
            if(_.isNull(order)) return res.status(404).send(utility.errorResp("Order Not Found"));
            order.getPlatoons().then(associatedPlatoons => {
                res.status(200).send(utility.successResp("", associatedPlatoons));
            });
        }).catch(err => res.status(400).send(utility.errorResp(err.message, "")));
    },
    getOrderByOrderNo(req, res){
        let ORDERNO = req.params.order_no;
        Orders.findOne({where: {order_no: ORDERNO}, include: [
            {
                model : Platoons,
                as: 'platoons',
                through: { attributes: [] }
            },
            {
                model: Transactions,
                require: false
            },
            {
                model: AddressBooks,
                'as' : 'address',
                require: false,
                include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
            },
            {
                model: PickUpStations,
                require: false,
                include: [{model: States, as: 'state'},{model: Cities, as: 'city'}]
            }
        ]})
        .then(order => {
            if(_.isNull(order)) return res.status(404).send(utility.errorResp("Order Not Found", order));
            res.status(200).send(utility.successResp("", order));
        })
        .catch(err => res.status(400).send(utility.errorResp(err.message, "")));        
    }
}