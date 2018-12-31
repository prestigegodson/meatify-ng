/** Admin Controller */
'use strict'

//Models
const Users = require('../db/models').Users;
const Roles = require("../db/models").Roles;
const Orders = require("../db/models").Orders;
const AddressBooks = require("../db/models").AddressBooks;

let sequelize = require('../db/models').sequelize;

module.exports = {
    listUsers(req, res){
        //User must have Administrative role
        const { Op } = sequelize;

        const options = {
            attributes: ['id', 
                        'email', 
                        'is_admin', 
                        'last_login_date', 
                        'last_login_ip', 
                        'created_at'
                    ],
            page: 1,
            paginate: 25,
            order: [['created_at', 'DESC']]
            // where: { name: { [Op.like]: `%elliot%` } }
          }

        Users.paginate(options)
             .then((docs, pages, total) => {
                res.status(201).send({docs, pages, total});
            }).catch(err => {
                res.status(401).send({msg: err.message});
            });
    },
    manageUser(req, res){
        const userId = req.params.id;
        Users.find({where: {id: userId}, 
                include:[
                    {model: Roles}, 
                    {model: Orders}, 
                    {model: AddressBooks}                    
                ]})
             .then(user => res.status(201).send(user))
             .catch(err => res.status(401).send({msg:err.message}));
    },
    manageUserRole(req, res){
        const USERID = req.params.userId;
        const {id, role} = req.body;

        Users.find({where: {id: USERID}})
             .then(user => {
                 if(!user) return res.status(404).send({msg: 'Invalid user ID'});
                 Roles.find({where: {id: id}}).then(role => {
                    if(!role) return res.status(404).send({msg: 'Role does not exists'});
                    user.addRoles([role]);
                    res.status(201).send({msg: 'Roles added successfully!'});
                 });
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
             .then(result => res.status(201).send(result))
             .catch(err => res.status(401).send({msg: err.message}));
    },
    enableDisableUser(req, res){
        const USERID = req.body.userId;
        Users.findById(USERID).then(user => {
            Users
                .update(
                    {is_disabled: !user.is_disabled},
                    {where: {id: user.id}})
                .then(result => res.status(200).send(result));
        }).catch(err => res.status(404).send({msg: err.message}));

    },
    destoryRoleById(req, res){
        const ROLE_ID = req.params.roleId;

        Roles.destroy({where: {id: ROLE_ID}})
             .then(result => res.status(200).send({msg: 'Delete successfully!'}))
             .catch(err => res.status(404).send({msg: err.message}));
    }
}