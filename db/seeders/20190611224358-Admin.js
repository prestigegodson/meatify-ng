'use strict';

const uuid    = require('uuid/v4');
const bcrypt  = require('bcrypt');
const ip      = require('ip');
const moment  = require('moment');
const faker   = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('admin', [{
      uid: uuid(),
      email: 'admin@meatify.ng',
      password: 'admin123',
      last_login_ip: ip.address(),
      is_disabled: false,
      last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
    }], {});   
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admin', [
      {email: 'admin@meatify.ng'},
     ], {});    
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
