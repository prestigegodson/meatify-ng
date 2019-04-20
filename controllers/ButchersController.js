/** Butchers Controller */

/** Libs */
const _ = require('lodash');
const sequelize = require("../db/models").sequelize;

/** Models */
const Butchers = require('../db/models').Butchers;
const Platoons = require('../db/models').Platoons;
const utility  = require('../lib/Utility');

module.exports = {
    create(req, res){
        Butchers
            .create(
                _.pick(req.body, 
                    [
                        'name', 
                        'butcher_info', 
                        'city', 
                        'state', 
                        'phone_number'
                    ])
            ).then(butcher => res.status(200).send(utility.successResp("New Butcher create successfully!", butcher)))
            .catch(Sequelize.ValidationError, err => {
                res.status(400).send(utility.errorResp(err.errors[0].message, ""));
            })
            .catch(err => res.status(404).send(utility.errorResp(err.message, null)));
    }, 
    getAllButchers(req, res){
        //Butchers must have Administrative role
        const { Op } = sequelize;
        // const queryParams = req.query['name'] ? req.query['name'] : '';
        // console.log(queryParams);
        const options = {
            attributes: ['id', 
                        'name', 
                        'butcher_info', 
                        'city', 
                        'state',
                        'phone_number',
                        'created_at'
                    ],
            page: 1,
            paginate: 25,
            order: [['created_at', 'DESC']],
            // where: { name: { [Op.like]: `%queryParams%` } }
          }

        Butchers.paginate(options)
             .then((docs, pages, total) => res.status(201).send(utility.successResp("", docs)))
             .catch(err => res.status(401).send(utility.errorResp(err.message, null)));
    },
    getButcherById(req, res){
        const BUTCHER_ID = req.params.id;
        Butchers
            .find({where: {id: BUTCHER_ID}})
            .then(butcher => {
                if(!butcher) return res.status(404).send(utility.errorResp('Resource not found', null));
                res.status(200).send(utility.successResp("", butcher));
            })
            .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },
    updateButcher(req, res){
        const BUTCHER_ID = req.params.id;
        console.log(BUTCHER_ID);
        Butchers
                .update(_.pick(req.body, 
                        [
                            'name', 
                            'butcher_info', 
                            'city', 
                            'state', 
                            'phone_number'
                        ]), 
                        {where: {id: BUTCHER_ID}})
                .then(result => res.status(200).send(utility.successResp("Update Successful!", result)))
                .catch(sequelize.ValidationError, err => {
                    res.status(400).send(utility.errorResp(err.errors[0].message, ""));
                })                
                .catch(err => res.status(400).send(utility.errorResp(err.message, "")));
    },
    deleteButcher(req, res){
        const BUTCHER_ID = req.params.id;
        
        Butchers.findOne({where: {id: BUTCHER_ID}}).then(butcher => {
            
            if(_.isNull(butcher)) return res.status(404).send(utility.errorResp("Butcher Not Found!", null));
            
            butcher.getPlatoons().then(associatedPlatoons => {
                if(_.isEmpty(associatedPlatoons)){
                    Butchers.destroy({where: {id: BUTCHER_ID}}).then(deletedButcher => {
                        res.status(200).send(utility.successResp("Delete successfully!", deletedButcher));
                    });
                }else{
                    res.status(400).send(utility.errorResp("You can't delete Bucther, is associated with one or more Platoons", null))
                }                
            })
        });
    },
    getButcherPlatoon(req, res){
        Butchers
            .find({where: {id:req.params.id}, include: [{model: Platoons}]})
            .then(butcher => {
                if(!butcher) return res.status(404).send(utility.errorResp('Resources not found', null));
                res.status(200).send(utility.successResp("", butcher));
            })
            .catch(err => res.status(404).send(utility.errorResp(err.message, "")));
    }
}