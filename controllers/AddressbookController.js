/** AddressBooks Controller */

const _ = require("lodash");
const AddressBooks = require("../db/models").AddressBooks;
const States = require("../db/models").States;
const Cities = require("../db/models").Cities;

const Utility = require("../lib/Utility");

module.exports = {
    create(req, res){
        req.body.user_id = req.user.uid;
        const toSave = _.pick(req.body, 
                        [
                            'user_id', 
                            'name', 
                            'address', 
                            'address_ext',
                            'is_default',
                            'phone_number',
                            'state_id',
                            'city_id'
                        ]);
        Utility.createNewModel(AddressBooks, toSave, (err, addressBook) => {
            if(err) return res.status(404).send(Utility.errorResp(err.message, null));
            res.status(200).send(Utility.successResp("", addressBook));
        });
    },
    updateAddress(req, res){
        const toUpdate = _.pick(req.body, 
            [ 
                'name', 
                'address', 
                'address_ext',
                'is_default',
                'city_id',
                'state_id',
                'phone_number'
            ]);        
        AddressBooks
                .update(toUpdate, {where: {id: req.params.id, user_id: req.user.uid}})
                .then(result => res.status(201).send(Utility.successResp("Update Successful", result)))
                .catch(err => res.status(401).send(Utility.errorResp(err.message, null)));
    },
    deleteAddress(req, res){
        const ID = req.params.id;
        const USERID = req.user.uid;
        //check if the address is created by the user
        AddressBooks.findOne({where: {id: ID}}).then(addressBook => {
            if(_.isNull(addressBook)) return res.status(404).send(Utility.errorResp("Address not Found in AddressBook", null));
            addressBook.getOrders().then(associatedOrders => {
                if(_.isEmpty(associatedOrders)){
                    AddressBooks.destroy({where: {id: ID, user_id: USERID}})
                                .then(result => res.status(200)
                                    .send(Utility.successResp("Delete successful!", null)))           
                }else{
                    res.status(400).send(Utility.successResp("You can't delete Address, Address is associated to one or more Orders", null));
                }
            })
        });
    },
    getAddress(req, res){
        AddressBooks
                    .findAll({
                        include: [
                            {
                                model: Cities,
                                as: 'city',
                                required: false,
                            },
                            {
                                model: States,
                                as: 'state',
                                required: false,
                            }
                        ], where: {user_id: req.user.uid}})
                        .then(addressBook => res.status(200).send(Utility.successResp("", addressBook)))
                        .catch(err => res.status(400).send(Utility.errorResp(err.message, null)));
    },
    getUserAddresses(req, res){
        AddressBooks
                    .find({
                        include: [
                            {
                                model: Cities,
                                as: 'city',
                                required: false,
                            },
                            {
                                model: States,
                                as: 'state',
                                required: false,
                            }
                        ],
                        where: {id: req.params.id}})
                    .then(addressBooks => Utility.validateRes(addressBooks, res))
                    .catch(err => res.status(401).send({msg: err.message}));
    },
    deleteAddressByIdAndUserId(req, res){
        let id = req.params.id;
        let USERID = req.params.userId;
        //check if the address is created by the user
        AddressBooks
                    .destory({where: {id: id, user_id: USERID}})
                    .then(result => res.status(200).send({msg: 'Delete successfully!'}))
                    .catch(err => res.status(404).send({msg: err.message}));        
    },
}