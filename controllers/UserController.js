'use strict'

const Users = require("../db/models").Users;
const Roles = require("../db/models").Roles;
const Orders = require("../db/models").Orders;
const AddressBooks = require("../db/models").AddressBooks;
const EventMailer = require("../events/EventMailer");
const Mailer = new EventMailer();
const uuid = require('uuid/v4');

const Sequelize = require("../db/models").Sequelize;
const _ = require("lodash");
const bcrypt = require('bcrypt');

const Joi = require('joi');

//User validation
const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    is_admin: Joi.boolean().required()
});

module.exports = {
    /** Create new user */
    create(req, res){
        const {error, value} = Joi.validate(req.body, schema);

        if(error){
            return res.status(401).send({msg: 'One of the field(s) is empty, check and try again!'});
        }

        Users
            .create(_.pick(req.body, ['email', 'password', 'is_admin']))
            .then(user => {
                Mailer.emit('SEND_WELCOME_MAIL', 
                            {
                                email:user.email, 
                                last_login_ip:user.last_login_ip,
                                activationUrl: uuid()
                            });
                res.status(201).send(user);
            })
            .catch(Sequelize.ValidationError, err => {
                res.status(401).send({msg: err.errors[0].message});
            })
            .catch(err => res.status(401).send({msg: err.message}))
    },

    /** Change password */
    changePassword(req, res){
        let {old_password, new_password} = req.body;
        if(old_password == new_password) return res.status(401).send({msg: 'New password and old password are the same, please check and try again'});

        Users.findOne({where: {email: req.user.email}}).then(user => {
            const check = Users.isPassword(user.password, old_password);
            if(check){ //means the password is correct
                
                const salt         = bcrypt.genSaltSync(10);
                new_password       = bcrypt.hashSync(new_password, salt);

                Users.update({password: new_password}, {where: {email: req.user.email}})
                    .then(instance => res.status(201).send({msg: 'Password update successful!'}))
                    .catch(err => res.status(401).send({msg: err.message}));
            }else{
                res.status(401).send({msg: 'Something went wrong, incorrect credentials'});
            }
        });
    },

    /** User profile information */ 
    profile(req, res){
        Users
            .find({where: {id: req.user.id}, 
                include: 
                [//You can add more relationship here, this will be use to populate dashboard
                    {model: Roles}, 
                    {model: Orders}, 
                    {model: AddressBooks}
                ] })
            .then(user => res.status(201).send(user))
            .catch(err => res.status(401).send({msg: err.message}));
    },
    
    /** Upload User's profile */
    upload(req, res){
        let imageFile = req.files.file;
        let USERID = req.user.id;

        imageFile.mv(`${__dirname}/public/images/${USERID}.jpg`, (err) => {
            if(err){
                return res.status(500).send({msg: err.message});
            }else{
                res.status(201).json({file: `${USERID}.jpg`});
            }
        })
    }
}