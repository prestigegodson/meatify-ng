/** Butchers Controller */

/** Libs */
const _ = require('lodash');
const Sequelize = require("../db/models").Sequelize;

/** Models */
const Platoons =  require('../db/models').Platoons;
const Animals =  require('../db/models').Animals;
const PlatoonImage =  require('../db/models').PlatoonImage;
const Users =  require('../db/models').Users;

module.exports = {
    index(req, res){
        Animals.findAll({include: [
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
        .then(animals => res.status(201).send(animals))
        .catch(err => res.status(401).send({msg:err.message}));
    }
}