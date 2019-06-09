'use strict'

const config        = require('config');
const Users         = require("../db/models").Users;
const Roles         = require("../db/models").Roles;
const Orders        = require("../db/models").Orders;
const AddressBooks  = require("../db/models").AddressBooks;
const EventMailer   = require("../events/EventMailer");
const SmsAbodeMessenger  = require("../events/SmsAbodeMessenger");
const BetaSmsMessenger = require('../events/BetaSmsMessenger');

//Initialize events
const Mailer        = new EventMailer();
const SmsAbode      = new SmsAbodeMessenger();
const BetaSms       = new BetaSmsMessenger();

const uuid          = require('uuid/v4');
const Utility       = require('../lib/Utility');
const jwt           = require("jwt-simple");

const Sequelize     = require("../db/models").Sequelize;
const _             = require("lodash");
const bcrypt        = require('bcrypt');

const Joi           = require('joi');
const phoneUtil     = require('google-libphonenumber').PhoneNumberUtil.getInstance();

//User validation
const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }),
    phone_number: Joi.string().optional(),
    password: Joi.string().required(),
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    is_admin: Joi.boolean().optional()
});

module.exports = {
    /* FireBase User, create OR Update */
    firebaseUserUpdate(req, res){
        //extract payload
        const payload = _.pick(req.body, [
            'id', 
            'email', 
            'photoUrl', 
            'phoneNumber', 
            'displayName',
            'lastSeen',
            'isEmailVerified',
            'lastLoginIp'
        ]);

        let formatNumber = '';

        //check availability of phone Number;
        if(payload.phoneNumber != ""){
            let number = phoneUtil.parseAndKeepRawInput(payload.phoneNumber, 'NG');
            formatNumber = phoneUtil.format(number, PNF.E164);
        }

        Users.findOne({where:{id: payload.ud}}).then(user => {
            if(_.isNull(user)){
                Users.create({
                    id: payload.id,
                    email: payload.email, 
                    photo_url: payload.photoUrl, 
                    phone_number : formatNumber,//payload.phoneNumber, 
                    display_name : payload.displayName, 
                    last_login_date : payload.lastSeen,
                    is_email_verified: payload.isEmailVerified,
                    last_login_ip: payload.lastLoginIp        
                }).then(user => {
                    //send mail silently.
                    Mailer.emit(
                        'SEND_WELCOME_MAIL', 
                        {   email: payload.email, 
                            displayName: payload.displayName,
                            lastLoginIp: payload.lastLoginIp,
                            isEmailVerified: payload.isEmailVerified  
                        });
                    res.status(200).send(Utility.successResp("User created successful!", user));
                }).catch(err => res.status(401).send(Utility.errorResp(err.message, err)))
            }else{
                user.update({
                    email: payload.email, 
                    photoUrl: payload.photoUrl, 
                    phoneNumber : payload.phoneNumber, 
                    displayName : payload.displayName, 
                    lastLoginDate : payload.lastSeen,
                    isEmailVerified: payload.isEmailVerified     
                },{ where: { id: payload.id } }).then(user => {
                    res.status(200).send(Utility.successResp("User updated successful!", user));
                }).catch(err => res.status(401).send(Utility.errorResp(err.message, err)))
            }
        });
    },
    /** Create new user */
    create(req, res) {
        const { error, value } = Joi.validate(req.body, schema);
        console.log(error);
        if (error) {
            return res.status(400).send(Utility.errorResp('One of the field(s) is empty, check and try again!'));
        }
        //should return 
        Users
            .create(_.pick(req.body, ['email', 'password', 'phone_number']))
            .then(async user => {
                if (user.phone_number != undefined) {
                    const role = await Roles.findOne({where: {role: 'user'}});
                    if(role) { await user.setRoles([role.id]); }
                    //generate phone number validation token, 5 digit
                    var _token = Utility.generatePhoneValidationToken();
                    Users.update({ validation_token: _token },
                        { where: { email: user.email } }).then(user => { console.log(user) });
                    
                        BetaSms.emit('SEND_SMS', { token: _token, phone: user.phone_number});

                } else {
                    Mailer.emit('SEND_WELCOME_MAIL', { email: user.email, last_login_ip: user.last_login_ip, activationUrl: uuid() });
                }
                const role = await Roles.findOne({where: {role: 'user'}});
                if(!_.isNull(role)){ await user.setRoles([role.id]) }; //set roles to user

                res.status(200).send(Utility.successResp("User created successfully!", user));
            })
            .catch(Sequelize.ValidationError, err => {
                res.status(400).send(Utility.errorResp(err.errors[0].message, err));
            })
            .catch(err => res.status(401).send(Utility.errorResp(err.message, err)))
    },

    /** Change password */
    changePassword(req, res) {
        let { email, password, password_confirmation } = req.body;
        if (password == password_confirmation) 
            return res.status(400).send(Utility.errorResp('password and password confirmation are the same, try again!'));

        Users.findOne({ where: { email: email } }).then(user => {
            //check if user is none
            if(user == null){
                return res.status(400).send(Utility.successResp('Something went wrong, unable to find User'));
            }
            const check = Users.isPassword(user.password, password);
            if (check) { //means the password is correct

                const salt = bcrypt.genSaltSync(10);
                password_confirmation = bcrypt.hashSync(password_confirmation, salt);

                Users.update({ password: password_confirmation }, { where: { email: email } })
                    .then(instance => res.status(200).send(Utility.successResp("Password update successfully!", "")))
                    .catch(err => res.status(400).send(Utility.errorResp(err.message, err)));
            } else {
                res.status(400).send(Utility.errorResp('Something went wrong, incorrect credentials', ""));
            }
        });
    },

    /** User profile information */
    profile(req, res) {
        Users
            .find({
                where: { id: req.user.id },
                include:
                    [//You can add more relationship here, this will be use to populate dashboard
                        { model: Roles },
                        { model: Orders },
                        { model: AddressBooks }
                    ]
            })
            .then(user => res.status(200).send(user))
            .catch(err => res.status(400).send({ msg: err.message }));
    },

    /** Upload User's profile */
    upload(req, res) {
        let imageFile = req.files.file;
        let USERID = req.user.id;

        imageFile.mv(`${__dirname}/public/images/${USERID}.jpg`, (err) => {
            if (err) {
                return res.status(500).send({ msg: err.message });
            } else {
                res.status(201).json({ file: `${USERID}.jpg` });
            }
        })
    },

    /** Validate User's phone number */
    validatePhoneNumber(req, res) {
        const { email, otp, phone } = req.body;

        Users.findOne({ where: { phone_number: phone } }).then(user => {
            //if found
            if (user.validation_token == otp) {
                //validation succeed! 
                Users.update({ verified: true, validation_token: null }, {
                    where: {
                        email: user.email
                    }
                }).then(new_user => {
                    const payload   = _.pick(user, ['id', 'email', 'phone_number', 'is_admin']);
                    const _token    = jwt.encode(payload, config.get("secretOrKey"));

                    var resposeObject = {
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
                    }
                    res.status(200).json(resposeObject);
                });
            } else {
                res.status(401).send(Utility.errorResp('Incorrect token, kindly, check and try again', null));
            }
        }).catch(err => {
            res.status(401).send(Utility.errorResp(err.message, null));
        });
    }
}