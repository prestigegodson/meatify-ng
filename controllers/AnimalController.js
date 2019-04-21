/** Butchers Controller */
'use strict'

/** Libs */
const _ = require('lodash');
const Sequelize = require("../db/models").Sequelize;
const sequelize = require("../db/models").sequelize;

/** Models */
const Platoons      =  require('../db/models').Platoons;
const Animals       =  require('../db/models').Animals;
const PlatoonImage  =  require('../db/models').PlatoonImage;
const Users         =  require('../db/models').Users;
const utility       = require('../lib/Utility');
 
module.exports = {
    getMeatify(req, res){
        Animals.findAll({       
            include: [
            {
                model: Platoons,
                as: 'platoons',
                required: true,
                duplicating: false,
                attributes: [
                    'id',
                    'ref_no',
                    'exp_date',
                    'price',
                    'description',
                    'price_per_member',
                    'no_of_member',
                    'admin_charges',
                    'is_completed',
                    'animal_profile', 'color', 
                    'breed',
                    'weight', 'created_at',
                    'updated_at'
                ],
                include: [
                    {
                        model: Users, 
                        as: 'users', 
                        through:{attributes:[]},
                        duplicating: false,
                        attributes: [
                            'id',
                            'email',
                            'profile_pic_url',
                            'is_admin',
                            'verified',
                            'is_disabled'
                        ]
                    },
                    {
                        model: PlatoonImage,
                        as: 'images',
                        duplicating: false,
                        attributes: ['id', 'image_path', 'is_default']
                    }
                ]
            }
        ],
        attributes: ['id', 'animal_type'], 
        order: [
            ['id', 'DESC']
        ]})
        .then(animals => res.status(200).send(utility.successResp(null, animals)))
        .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },

    index(req, res){
        Animals.findAll(
            {
                attributes: [
                    'id',
                    'animal_type',
                    [sequelize.literal('(SELECT COUNT(*) FROM platoons WHERE platoons.animal_type_id = animals.id)'), 'platoonCount']
                ],
                include: [
                {
                    model: Platoons,
                    as: 'platoons',
                    required: false,
                    // attributes: [],
                    duplicating: false               
                }
            ],
            order: [[sequelize.literal('platoonCount'), 'DESC']]
        }
        )
        .then(animals => res.status(200).send(utility.successResp(null, animals)))
        .catch(err => res.status(400).send(utility.errorResp(err.message, "")));
    },

    createAnimal(req, res){
        Animals
            .findOne({where: {animal_type: req.body.animal_type}})
            .then(animal => {
                if(animal == null){
                    Animals.create(_.pick(req.body, ['animal_type']))
                           .then(a => res.status(200).send(utility.successResp("Animal create successfully!", a)))
                           .catch(err => res.status(400).send(utility.errorResp(err.message, null)))
                }else{
                    res.status(200).send(utility.successResp("Animal create successfully!", animal));
                }
            });
    },

    updateAnimal(req, res){
        Animals.update(_.pick(req.body, ['animal_type']), {where: {id: req.params.id}})
               .then(animal => res.status(200).send(utility.successResp("Update successsfully!", animal)))
               .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },

    deleteAnimal(req, res){
        //check if any platoon is associated
        Animals.findOne({where: {id: req.params.id}}).then(animal => {
            
            if(_.isNull(animal)) return res.status(404).send(utility.errorResp("Animal Not Found!", null));

            animal.getPlatoons().then(associatedPlatoons => {
                if(_.isEmpty(associatedPlatoons)){
                    Animals.destroy({where: {id: req.params.id}}).then(deletedAnimal => {
                        res.status(200).send(utility.successResp("Delete successfully!", deletedAnimal));
                    })
                }else{
                    res.status(200).send(utility.successResp("Can't delete Animal, is associated with platoons", animal));
                }
            }).catch(err => res.status(400).send(utility.errorResp(err.message, null)))
        });
    }

}