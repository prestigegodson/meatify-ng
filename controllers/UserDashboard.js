'use strict'

/**
 * User Dashboard Activities
 */

const config        = require('config');
const Users         = require("../db/models").Users;
const Roles         = require("../db/models").Roles;
const Orders        = require("../db/models").Orders;
const Platoons      = require("../db/models").Platoons;
const AddressBooks  = require("../db/models").AddressBooks;
const Delivery      = require("../db/models").Delivery;

const EventMailer   = require("../events/EventMailer");
const Mailer        = new EventMailer();
const uuid          = require('uuid/v4');
const Utility       = require('../lib/Utility');

const Sequelize     = require("../db/models").Sequelize;
const _             = require("lodash");
const bcrypt        = require('bcrypt');

module.exports = {
    /**
     * Things to load on dashboard
     * 0. User Information
     * 1. Orders
     * 2. Addresses
     * 3. Coupons
     * 4. Activities
     * 5. Saved Card Information
     * 6. 
     */
 
    getUserInfo(req, res) {
        // console.log('dashboard');
        Users.findOne({ 
            where: { id: req.user.id }, 
            include: [
                {model: Roles},
                {
                    model: Platoons,
                    as: 'platoons'
                },
                {
                    model: Orders,
                    required: false
                },
                {model: AddressBooks},
                // {model: Coupons},
                // {model: Activities},
                // {model: CardInfo},
            ] 
        })
            .then(response => res.status(201).send(Utility.successResp("", response)))
            .catch();
    }

}