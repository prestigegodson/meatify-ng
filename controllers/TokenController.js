'use strict'

const config    = require('config');
const jwt       = require("jwt-simple");
const _         = require('lodash');
const Joi       = require('joi');
const utility   = require('../lib/Utility'); 

const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');

const Admin = require("../db/models").Admin;
const Roles = require("../db/models").Roles;

const loginSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().required(),
    // password:  Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
});

module.exports = {
    login(req, res){
        
        const {error, value} = Joi.validate(req.body, loginSchema);
        console.log(error);
        if(error == null){
            const {email, password} = req.body;
            Admin.findOne(
                {
                    where: {email: email}, 
                    include:[
                        {
                            model: Roles,
                            as: 'roles', 
                            required: false,
                            attributes:['id', 'role'],
                            through: {attributes:[]}
                        } //UserRole
                    ]
                })
                .then(admin => {
                    if(admin == null){
                        res.status(400).send(utility.errorResp('Email address or password not found, check and try again!', null));
                    }else if(Admin.isPassword(admin.password, password)){
                        // const isAdmin = _.find(admin.roles, {role:'admin'}) == undefined ? false : true;
                        const payload = {
                            id:         admin.id,
                            uid:        admin.uid,
                            email:      admin.email,
                            is_disabled: admin.is_disabled,
                            roles:      admin.roles
                        };
                        const _token = jwt.encode(payload, config.get("secretOrKey"));

                        res.json({
                            token: _token,
                            user: {
                                id:             admin.id,
                                uid:            admin.uid,
                                email:          admin.email,
                                is_disabled:    admin.is_disabled,
                                roles:          admin.roles
                            }
                        })
                    }else{
                        res.status(400).send(utility.errorResp('Incorrect login credentials, check and try again!', null));
                    }
                }).catch(error => res.status(400).json(utility.errorResp(error.message, null)));
        }else{
            res.status(400).send(utility.errorResp(error.message, null));
        }
    },    
}