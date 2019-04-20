'use strict'

const config    = require('config');
const jwt       = require("jwt-simple");
const _         = require('lodash');
const Joi       = require('joi');
const utility   = require('../lib/Utility'); 

const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');

const Users = require("../db/models").Users;

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
            Users.findOne({where: {email: email}})
                .then(user => {
                    if(user == null){
                        res.status(400).send(utility.errorResp('Email address or password not found, check and try again!', null));
                    }else if(Users.isPassword(user.password, password)){
                        const payload = _.pick(user, ['id', 'email', 'phone_number', 'is_admin']);
                        const _token = jwt.encode(payload, config.get("secretOrKey"));
                        res.json({
                            token: _token,
                            user: {
                                id:             user.id,
                                email:          user.email,
                                phone_number:   user.phone_number,
                                is_admin:       user.is_admin,
                                verified:       user.verified,
                                is_disabled:    user.is_disabled,
                                auth_token:     _token
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