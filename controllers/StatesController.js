/** Controller for state */

const _ = require("lodash");
const States = require("../db/models").States;
const Cities = require("../db/models").Cities;

module.exports = {
    getStates(req, res){
        States.findAll()
        .then(states => res.status(201).send(states))
        .catch(err => res.status(400).send({msg:err.message}))
    },
    getStateById(req, res){
        States.findAll({
            include:[
                {
                    model: Cities,
                    as: 'cities',
                    required: false,
                    attributes: ['id','name']
                }
            ],
            where: {id:req.params.id},
        })
        .then(states => res.status(201).send(states))
        .catch(err => res.status(400).send({msg:err.message}))
    },
} 