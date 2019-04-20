/**
 * Controller to manage
 * Select A pickup station
 */

const _ = require("lodash");
const PickUpStations = require("../db/models").PickUpStations;
const States =  require('../db/models').States;
const Cities =  require('../db/models').Cities;
const Utility = require("../lib/Utility");

module.exports = {
    //CRUD
    create(req, res) {
        const toSave = _.pick(req.body, [
            'address',
            'landmark',
            'phone',
            'workinghours',
            'state_id',
            'city_id'
        ]);
        PickUpStations.create(toSave)
            .then(stations => res.status(200).send(Utility.successResp("Pick Up station created successful!", stations)))
            .catch(err => res.status(401).send(Utility.errorResp(err.message, null)));
    },

    getPickUpStations(req, res) {
        PickUpStations
            .findAll({include: [
                {
                    model: States,
                    as: 'state',
                    required: true,
                    duplicating: false,
                    attributes: [
                        'id',
                        'name'
                    ]
                },
                {
                    model: Cities,
                    as: 'city',
                    required: true,
                    duplicating: false,
                    attributes: [
                        'id',
                        'name'
                    ]
                }                
            ],
            attributes: ['id', 'address', 'landmark', 'phone', 'workinghours']})
            .then(stations => res.status(200).send(Utility.successResp("", stations)))
            .catch(err => res.status(401).send(Utility.errorResp(err.message, null)));
    },
    getPickUpStationsByID(req, res){
        const STATION_ID = req.params.id;
        PickUpStations.findOne({where:{id:STATION_ID}}).then(stations => {
            if(_.isNull(stations)) return res.status(404).send(Utility.errorResp("PickUp Station not found", ""));
            res.status(200).send(Utility.successResp("", stations));
        }).catch(err => res.status(400).send(Utility.errorResp(err.message, "")));
    },
    updatePickUpStations(req, res){
        const toUpdate = _.pick(req.body, [
            'address',
            'landmark',
            'phone',
            'workinghours',
            'state_id',
            'city_id'
        ]); 
        PickUpStations.update(toUpdate, {where: {id:req.params.id}}).then(pickUp => {
            res.status(200).send(Utility.successResp("Update Successful!", pickUp));
        }).catch(err => res.status(Utility.errorResp(err.message, "")));
    },

    deletePickUpStations(req, res){
        const STATION_ID = req.params.id;
        PickUpStations.findOne({where:{id:STATION_ID}}).then(stations => {
            if(_.isNull(stations)) return res.status(404).send(Utility.errorResp("PickUp Station not found", ""));
            stations.getOrders().then(associatedOrder => {
                if(_.isEmpty(associatedOrder)){
                    PickUpStations.destroy({where: {id: STATION_ID}}).then(pickUp => {
                        res.status(200).send(Utility.successResp("PickUp Deleted!", pickUp));
                    })
                }else{
                    res.status(400).send(Utility.errorResp("Pick Up Station is attached to one or more Order, can't delete", stations));
                }
                
            })
        });        
    }

}