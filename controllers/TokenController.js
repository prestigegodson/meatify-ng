'use strict'

const config = require('config');
const jwt = require("jwt-simple");
const _ = require('lodash');
const Joi = require('joi');

const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');

const Users = require("../db/models").Users;

const loginSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
});

module.exports = {
    login(req, res){
        const {error, value} = Joi.validate(req.body, loginSchema);
        if(error == null){
            const {email, password} = req.body;
            
            Users.findOne({where: {email: email}})
                .then(user => {
                    if(Users.isPassword(user.password, password)){
                        const payload = _.pick(user, ['id', 'email', 'is_admin']);
                        res.json({
                            token: jwt.encode(payload, config.get("secretOrKey"))
                        })
                    }else{
                        res.status(401).send({msg: 'Incorrect login credentials, check and try again'});
                    }
                }).catch(error => res.status(401).json({msg: error.message}));
        }else{
            res.status(401).send({msg:error.message});
        }
    },    
}