/** Butchers Controller */

/** Libs */
const _ = require('lodash');
const Sequelize = require("../db/models").Sequelize;

/** Models */
const Butchers = require('../db/models').Butchers;
const Platoons =  require('../db/models').Platoons;

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
            ).then(butcher => res.status(201).send(butcher))
            .catch(Sequelize.ValidationError, err => {
                res.status(400).send({msg: err.errors[0].message});
            })
            .catch(err => res.status(404).send({msg: err.message}));
    },
    getAllButchers(req, res){
        //Butchers must have Administrative role
        const { Op } = sequelize;
        const queryParams = req.query['name'] ? req.query['name'] : '';
        console.log(queryParams);
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
            where: { name: { [Op.like]: `%queryParams%` } }
          }

        Butchers.paginate(options)
             .then((docs, pages, total) => res.status(201).send({docs, pages, total}))
             .catch(err => res.status(401).send({msg: err.message}));
    },
    getButcherById(req, res){
        const USERID = req.params.id;
        Butchers
            .find({where: {id: USERID}})
            .then(butcher => {
                if(!butcher) return res.status(404).send({msg: 'Resource not found'});
                res.status(200).send(butcher);
            })
            .catch(err => res.status(400).send({msg: err.message}));
    },
    updateButcher(req, res){
        const USERID = req.params.id;
        Butchers
                .update(_.pick(req.body, 
                        [
                            'name', 
                            'butcher_info', 
                            'city', 
                            'state', 
                            'phone_number'
                        ]), 
                        {where: {id: USERID}})
                .then(result => res.status(200).send(result))
                .catch(Sequelize.ValidationError, err => {
                    res.status(400).send({msg: err.errors[0].message});
                })                
                .catch(err => res.status(400).send({msg: err.message}));
    },
    deleteButcher(req, res){
        const USER_ID = req.params.id;
        Butchers
            .destroy({where: {id: USER_ID}})
            .then(result => res.status(200).send({msg: 'Delete successfully!'}))
            .catch(err => res.status(404).send({msg: err.message}))
    },
    getButcherPlatoon(req, res){
        Butchers
            .find({where: {id:req.params.id}, include: [{model: Platoons}]})
            .then(butcher => {
                if(!butcher) return res.status(404).send({msg: 'Resources not found'});
                res.status(200).send(butcher);
            })
            .catch(err => res.status(404).send({msg:err.message}));
    }
}