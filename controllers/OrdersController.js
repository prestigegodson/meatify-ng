/** Order Controller */
const Orders = require('../db/models').Orders;

const utility = require('../lib/Utility');
const _ = require('lodash');

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
    getOrderByID(req, res){},
    getAllOrderByUserID(req, res){},
    getOrderStatus(req, res){},
    updateStatus(req, res){},
    getOrderByIdANDUserID(req, res){},
    getPlatoonInfo(req, res){}
}