/** Platoon Controller */

const Platoons      = require('../db/models').Platoons;
const Butcher       = require('../db/models').Butchers;
const Users         = require('../db/models').Users;
const Orders        = require('../db/models').Orders;
const Animal        = require('../db/models').Animals;
const PlatoonImage  = require('../db/models').PlatoonImage;
const moment        = require('moment');

const utility = require('../lib/Utility');
const _ = require('lodash');

module.exports = {
    create(req, res){

        req.body.ref_no = utility.generatePlatoonRefNo();
        req.body.price_per_member = Math.ceil(req.body.price / req.body.no_of_member);
        req.body.exp_date = moment(req.body.exp_date);

        Platoons.create(_.pick(req.body, ['ref_no', 
                                          'exp_date', 
                                          'price', 
                                          'breed',
                                          'color',
                                          'weight',
                                          'description',
                                          'price_per_member',
                                          'admin_charges',
                                          'animal_profile',
                                          'no_of_member', 
                                          'is_completed', 
                                          'animal_type_id', 
                                          'butcher_id'])
                        ).then(platoon => res.status(200).send(utility.successResp(platoon)))
                        .catch(err => res.status(400).send(utility.errorResp(err.message)));
    },
    getPlatoons(req, res){
        var isComp = req.query.is_completed || 'false';
        var b = isComp === 'true' ? true : false;       
        
        Platoons
                .findAll({include: [
                           {
                               model: Butcher,
                               as: 'butcher',
                               required: false,
                            }, 
                            {
                                model: Animal,
                                as: 'animal',
                                required: false,
                             }, 
                           {
                               model: Users,
                               as: 'users',
                               required: false,
                               attributes: ['id', 'email', 'profile_pic_url'],
                               through: {attributes:[]}
                            }, 
                           {
                               model: Orders,
                               as: 'orders',
                               required: false,
                            },
                            {
                                model: PlatoonImage,
                                as: 'images',
                                required: false
                            }
                        ] })
                .then(platoons => res.status(200).send(utility.successResp(platoons)))
                .catch(err => res.status(400).send(utility.errorResp(err.message)));
    },
    getPlatoonById(req, res){
        Platoons.find({
                include:[
                    {
                        model: Butcher,
                        as: 'butcher',
                        required: false,
                     }, 
                     {
                        model: Animal,
                        as: 'animal',
                        required: false,
                     },                      
                    {
                        model: Users,
                        as: 'users',
                        required: false,
                     }, 
                    {
                        model: Orders,
                        as: 'orders',
                        required: false,
                        // through: { attributes: [] }
                     },
                     {
                        model: PlatoonImage,
                        as: 'images',
                        attributes: ['id', 'image_path'],
                        required: false
                     }
                    ], where: {id: req.params.id}})
                .then(platoon => utility.validateRes(platoon, res))
                .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },
    updatePlatoon(req, res){
        req.body.price_per_member   = Math.ceil(req.body.price / req.body.no_of_member);
        req.body.exp_date           = moment(req.body.exp_date);

        Platoons
            .update(_.pick(req.body, 
                            ['exp_date', 
                            'price', 
                            'breed',
                            'color',
                            'weight',
                            'description',
                            'price_per_member',
                            'admin_charges',
                            'animal_profile',
                            'no_of_member', 
                            'is_completed', 
                            'animal_id',  
                            'butcher_id']), {where: {id: req.params.id}})
            .then(platoon => res.status(200).send(utility.successResp("Platoon update successfully!", platoon)))
            .catch(err => res.status(400).send(utility.errorResp(err.message, null)))
    },
    isPlatoonCompleted(req, res){
        Platoons.findById(req.params.id)
                .then(platoon => {
                    if(platoon.is_completed == true)
                        return res.status(200).send(utility.successResp("Not completed", {msg:true}));
                    res.status(200).send(utility.successResp("Completed", {msg:false}));
                })
                .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },
    getButcherInfo(req, res){
        const PLATOONS_ID = req.params.id;
        const BUTCHER_ID = req.params.butcher_id;

        Platoons
                .find({where: {id: PLATOONS_ID, butcher_id:BUTCHER_ID}, include: [{model: Butcher, as:'butchers'}]})
                .then(platoon => utility.validateRes(platoon, res))
                .catch(err => res.status(400).send({msg:err.message}));
    },
    getPlatoonByRefNo(req, res){
        
        const REF_NO = req.params.ref_no;
        Platoons.findOne({where: {ref_no: REF_NO}, 
                    include:[
                        {
                            model: Butcher,
                            as: 'butcher',
                            required: false,
                         },
                         {
                            model: Animal,
                            as: 'animal',
                            required: false,
                         },                          
                        {
                            model: Users,
                            as: 'users',
                            required: false,
                         }, 
                        {
                            model: Orders,
                            as: 'orders',
                            required: false,
                            // through: { attributes: [] }
                         }
                    ]
                })
                .then(platoon => utility.validateRes(platoon, res))
                .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },
    getPlatoonWithUsers(req, res){
        const PLATOON_ID = req.params.id;
        Platoons.find({include: [{
            model: Users,
            as: 'users',
            required: false,
            through: { attributes: [] }
        }], 
            where: {id: PLATOON_ID}
        }).then(platoon => {
            if(platoon)
                return res.status(201).send({msg:platoon.users})
            res.status(401).send({msg: 'Resources not found'})
        }).catch(err => res.status(400).send({msg:err.message}));    
    },
    getPlatoonWithOrders(req, res){
        const PLATOON_ID = req.params.id;
        Platoons.find({
            include:[
                {
                    model: Orders,
                    as: 'orders',
                    required: false
                }
            ], 
            where: {platoon_id: PLATOON_ID}
        })
        .then(platoon => utility.validateRes(platoon, res))
        .catch(err => res.status(400).send({msg:err.message}))
    },

    destoryPlatoon(req, res){
        Platoons.findOne({where: {id: req.params.id}}).then(platoon => {
            if(_.isNull(platoon)) return res.status(404).send(utility.errorResp("Platoon Not Found!", null));
            platoon.getUsers(associatedUser => {
                if(_.isEmpty(associatedUser)){
                    Platoons.destroy({ where: {id: req.params.id}}).then(deletedPlatoons => {
                        res.status(200).send(utility.successResp("Delete successfully!", deletedPlatoons));
                    })
                }else{
                    res.status(200).send(utility.successResp("Can't delete Platoon, is associated with one or more Users", platoon));
                }
            })
        });
    }
}