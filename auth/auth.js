'use strict'

const config    = require('config');
const Users     = require('../db/models').Users;
const Roles     = require("../db/models").Roles;

const jwt       = require("jwt-simple");
const _         = require('lodash');
const adminSdk  = require('./fbAuth');

const passport  = require('passport');
const passportJWT = require('passport-jwt');
const Strategy  = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

    const params = {
        secretOrKey : config.get("secretOrKey"),
        jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme("bearer"),
        // issuer: 'accounts.examplesoft.com',
        // audience: 'yoursite.net'
    }

    const strategy = new Strategy(params, (payload, done) => {
        console.log(payload);
        Users.find({where: {id: payload.id}})
                .then(user => {
                    if(user){
                        return done(null, _.assign(user, {is_admin: payload.is_admin}));
                    }
                    return done(null, false, { message: 'Incorrect login credentials.' });
                }).catch(err => {
                    return done(err, null);
                })
    });
    
    passport.use(strategy);

    module.exports = {
        initialize: ()      => passport.initialize(),
        authenticate: ()    => passport.authenticate('jwt', {session: false}),
    }