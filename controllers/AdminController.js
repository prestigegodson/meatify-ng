/** Admin Controller */
'use strict'

//Models
const Platoons      = require('../db/models').Platoons;
const Butcher       = require('../db/models').Butchers;
const Users         = require('../db/models').Users;
const Orders        = require('../db/models').Orders;
const Animals       = require('../db/models').Animals;
const Transactions  = require('../db/models').Transactions;
const Roles         = require('../db/models').Roles;
const AddressBooks  = require('../db/models').AddressBooks;
const _             = require("lodash");

const utility       = require('../lib/Utility');

const sequelize = require("../db/models").sequelize;

module.exports = {
    async getDashboard(req, res){
        /**
         * List Platoons
         * List Meaters (Users)
         * Orders
         * Butchers
         * Animals
         * Transactions
         */
   
        const users = await Users.find({
            attributes: [
                [sequelize.literal('(SELECT COUNT(*) FROM Users WHERE Users.verified = 1)'), 'active'],
                [sequelize.literal('(SELECT COUNT(*) FROM Users WHERE Users.verified = 0)'), 'inactive']
            ]
        });
        
        const platoons = await Platoons.find({
            attributes: [
                [sequelize.literal('(SELECT COUNT(*) FROM Platoons WHERE Platoons.is_completed = 1)'), 'completed'],
                [sequelize.literal('(SELECT COUNT(*) FROM Platoons WHERE Platoons.is_completed = 0)'), 'uncompleted']
            ]            
        })

        const completed_orders  = await Orders.count({where: {status: 'COMPLETED'}}); //completed orders
        const process_orders    = await Orders.count({where: {status: 'PROCESSING'}}); //pending orders

        const animals   = await Animals.findAll({
            attributes: [
                'id',
                'animal_type',
                'animal_img',
                //https://github.com/sequelize/sequelize/issues/222
                [sequelize.literal('(SELECT COUNT(*) FROM Platoons WHERE Platoons.animal_type_id = Animals.id)'), 'count']
            ],
            include: [{
                model: Platoons,
                as: 'platoons',
                attributes: [],
            }],                             
            order: [[sequelize.literal('count'), 'DESC']]
        });

        return res.status(200).send(utility.successResp(null, {
            platoons,
            users,
            orders:{
                completed: completed_orders,
                processing: process_orders
            },
            animals,
        }));

    },
    listUsers(req, res){
        //User must have Administrative role
        const { Op } = sequelize;

        const options = {
            attributes: ['id', 
                        'email',
                        'last_login_date', 
                        'last_login_ip', 
                        'created_at'
                    ],
            page: 1,
            paginate: 25,
            order: [['created_at', 'DESC']],
            include: [
                {model: Roles, as: 'roles', attributes: ['id', 'role'], through: {attributes:[]}}
            ]
            // where: { name: { [Op.like]: `%elliot%` } }
          }

        Users.paginate(options)
             .then((docs, pages, total) => {
                res.status(200).send({docs, pages, total});
            }).catch(err => {
                res.status(400).send({msg: err.message});
            });
    },
    manageUser(req, res){
        const userId = req.params.id;
        Users.findOne({where: {id: userId}, 
                include:[
                    {
                        model: Roles, 
                        as: 'roles', 
                        required: false, 
                        attributes:['id', 'role'],
                        through: {attributes:[]}
                    }, 
                    {model: Orders}, 
                    {model: AddressBooks}                   
                ]})
             .then(user => res.status(200).send(utility.successResp(user)))
             .catch(err => res.status(400).send({msg:err.message}));
    },
    manageUserRole(req, res){
        const USERID = req.params.id;
        const {role_id} = req.body;

        Users.findOne({where: {id: USERID}})
             .then(async user => {
                 if(!user) return res.status(404).send({msg: 'Invalid user ID'});
                 await user.setRoles([role_id]);
                res.status(201).send({msg: 'Roles added successfully!'});
             });
    },

    getAllRoles(req, res){
        Roles.findAll()
             .then(roles => res.status(201).send(roles))
             .catch(err => res.status(401).send({msg:err.message}));
    },
    addNewRole(req, res){
        const roleName = req.body.role;
        Roles.create({role: roleName})
             .then(result => res.status(200).send(utility.successResp("Role created", result)))
             .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },
    enableDisableUser(req, res){
        const USERID = req.params.id;
        console.log(USERID);
        Users.findOne({where: {id: USERID}}).then(user => {
            if(_.isNull(user)) return res.status(404).send(utility.errorResp("User not found!", null));
            Users
                .update(
                    {is_disabled: !user.is_disabled},
                    {where: {id: user.id}})
                .then(result => res.status(200).send(utility.successResp("User status change", result)));
        }).catch(err => res.status(400).send(utility.errorResp(err.message, null)));

    },
    destoryRoleById(req, res){
        const ROLE_ID = req.params.id;

        Roles.destroy({where: {id: ROLE_ID}})
             .then(result => res.status(200).send(utility.successResp('Delete successfully!', result)))
             .catch(err => res.status(400).send(utility.errorResp(err.message, null)));
    },

}