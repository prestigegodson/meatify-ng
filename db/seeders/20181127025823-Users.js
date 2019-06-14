'use strict';
 
const uuid    = require('uuid/v4');
const bcrypt  = require('bcrypt');
const ip      = require('ip');
const moment  = require('moment');
const faker   = require('faker');

const salt    = bcrypt.genSaltSync(10);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      { 
        uid: uuid(),
        email: 'osinubi.oyinkansola@gmail.com',
        phone_number: '07063317344',
        display_name: 'Osinubi Oyinkansola',
        is_email_verified: true,
        last_login_ip: ip.address(),
        is_disabled: false,
        last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
        photo_url: 'https://randomuser.me/api/portraits/men/65.jpg',
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('Users', [
     {email: 'oyewoleabayomi@gmail.com'},
     {email: 'samsoft@gmail.com'},
     {email: 'osinubi.oyinkansola@gmail.com'},
     {email: 'oyin4real@yahoo.com'},
     {email: 'cryptodev@gmail.com'},
    ], {});
  }
};
