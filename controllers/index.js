'use strict'

const Users = require('./UserController');
const Admin = require('./AdminController');
const Token = require('./TokenController');
const Platoons = require('./PlatoonsController');
const Orders = require('./OrdersController');
const Butchers = require('./ButchersController');
const Transactions = require('./TransactionController');
const AddressBooks = require('./AddressbookController');
const Animal = require('./AnimalController');
const PickUpStations = require('./PickUpStationsController');
const States = require('./StatesController');
const UserDashboard = require('./UserDashboard');

module.exports = {
    Users,
    Token,
    Admin,
    Orders,
    Platoons,
    Butchers,
    Transactions,
    AddressBooks,
    Animal,
    PickUpStations,
    States,
    UserDashboard
}