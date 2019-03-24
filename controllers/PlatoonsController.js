/** Platoon Controller */

const Platoons = require('../db/models').Platoons;
const Butcher = require('../db/models').Butchers;
const Users = require('../db/models').Users;
const Orders = require('../db/models').Orders;
const Animal = require('../db/models').Animals;
const PlatoonImage = require('../db/models').PlatoonImage;

const utility = require('../lib/Utility');
const _ = require('lodash');

module.exports = {
    create(req, res){

        req.body.ref_no = utility.generatePlatoonRefNo();
        req.body.price_per_member = Math.ceil(req.body.price / req.body.no_of_member);

        Platoons.create(_.pick(req.body, ['ref_no', 
                                          'exp_date', 
                                          'price', 
                                          'description',
                                          'price_per_member',
                                          'no_of_member', 
                                          'is_completed', 
                                          'animal_id',
                                          'butcher_id'])
                        ).then(platoon => res.status(201).send(platoon))
                        .catch(err => res.status(401).send({msg: err.message}));
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
                .then(platoons => res.status(200).send(platoons))
                .catch(err => res.status(400).send({msg:err.message}));
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
                .catch(err => res.status(400).send({msg:err.message}));
    },
    updatePlatoon(req, res){
        Platoons
            .update(_.pick(req.body, 
                        [
                            'ref_no', 
                            'exp_date', 
                            'price', 
                            'description',
                            'price_per_member', 
                            'no_of_member', 
                            'is_completed'
                        ]), {where: {id: req.params.id}})
            .catch(err => res.status(400).send({msg:err.message}))
    },
    isPlatoonCompleted(req, res){
        Platoons.findById(req.params.id)
                .then(platoon => {
                    if(platoon.is_completed == true)
                        return res.status(201).send({msg:true});
                    res.status(201).send({msg:false});
                })
                .catch(err => res.status(400).send({msg:err.message}));
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

        Platoons.find({where: {ref_no: REF_NO}, 
                    include:[
                        {
                            model: Butcher,
                            as: 'butchers',
                            required: false,
                         },
                         {
                            model: Animal,
                            as: 'animals',
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
                            through: { attributes: [] }
                         }
                    ]
                })
                .then(platoon => utility.validateRes(platoon, res))
                .catch(err => res.status(400).send({msg:err.message}));
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

    destoryPlatoon(req, res){}
}