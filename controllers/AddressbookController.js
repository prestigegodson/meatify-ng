/** AddressBooks Controller */

const _ = require("lodash");
const AddressBooks = require("../db/models").AddressBooks;
const Utility = require("../lib/Utility");

module.exports = {
    create(req, res){
        req.body.user_id = req.user.id;
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
            if(err) return res.status(404).send({msg: err.message});
            res.status(200).send(addressBook);
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
                .update(toUpdate, {where: {id: req.params.id, user_id: req.user.id}})
                .then(result => res.status(201).send(result))
                .catch(err => res.status(401).send({msg: err.message}));
    },
    deleteAddress(req, res){
        let id = req.params.id;
        //check if the address is created by the user
        AddressBooks.destory({where: {id: id}})
                    .then(result => res.status(200).send({msg: 'Delete successfully!'}))
                    .catch(err => res.status(404).send({msg: err.message}));
    },
    getAddress(req, res){
        AddressBooks
                    .findAll({where: {user_id: req.user.id}})
                    .then(addressBook => res.status(201).send(addressBook))
                    .catch(err => res.status(401).send({msg: err.message}));
    },
    getAddressUserAddresses(req, res){
        AddressBooks
                    .findById(req.params.id)
                    .then(addressBooks => Utility.validateRes(addressBooks, req, res))
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