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
        console.log(toSave);
        PickUpStations.create(toSave)
            .then(stations => res.status(201).send({msg:"Pick Up station created successfully", data: stations}))
            .catch(err => res.status(401).send({msg: err.message}));
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
            .then(stations => res.status(201).send(stations))
            .catch(err => res.status(401).send({ msg: err.message }));
    }

}