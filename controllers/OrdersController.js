/** Order Controller */
const Orders            = require('../db/models').Orders;
const Platoons          = require('../db/models').Platoons;
const Transactions      = require('../db/models').Transactions;
const AddressBooks      = require('../db/models').AddressBooks;
const PickUpStations    = require('../db/models').PickUpStations;
const States            = require('../db/models').States;
const Cities            = require('../db/models').Cities;

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
        let userId = req.user.id;
        Orders.findAll({where: {user_id: userId}, include: [
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
        ]});
    },
    getOrderByRef(req, res){
        
        let order = Orders.find(
                {where: {order_no: req.params.order_no}, 
            include: [
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
                .then(order => res.status(200).send({order: order}))
                .catch(err => res.status(400).send({msg: err.message}))
    },

    getAllOrderByUserID(req, res){
        Orders.findAll(
            {
                where: {user_id: req.params.userId},
                include: [
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
                ]
            }
            ).then(orders => res.status(200).send(orders))
            .catch(err => res.status(400).send({msg: err.message}))
    },
    getOrderStatus(req, res){},
    updateStatus(req, res){},
    getOrderByIdANDUserID(req, res){},
    getPlatoonInfo(req, res){}
}