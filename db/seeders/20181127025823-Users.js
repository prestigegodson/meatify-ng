'use strict';

const uuid = require('uuid/v4');
const bcrypt  = require('bcrypt');
const ip = require('ip');
const moment = require('moment');
const faker = require('faker');

const salt = bcrypt.genSaltSync(10);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      id: uuid(),
      email: 'oyewoleabayomi@gmail.com',
      password: bcrypt.hashSync('adefioye', salt),
      is_admin: true,
      last_login_ip: ip.address(),
      last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
      profile_pic_url: 'https://randomuser.me/api/portraits/men/65.jpg',
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
    }, {
      id: uuid(),
      email: 'samsoft@gmail.com',
      password: bcrypt.hashSync('adefioye1', salt),
      is_admin: false,
      last_login_ip: ip.address(),
      last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
      profile_pic_url: 'https://randomuser.me/api/portraits/men/7.jpg',
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')      
    }, {
      id: uuid(),
      email: 'osinubi.oyinkansola@gmail.com',
      password: bcrypt.hashSync('adefioye2', salt),
      is_admin: false,
      last_login_ip: ip.address(),
      last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')       
    }, {
      id: uuid(),
      email: 'oyin4real@yahoo.com',
      password: bcrypt.hashSync('adefioye3', salt),
      is_admin: false,
      last_login_ip: ip.address(),
      last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
      profile_pic_url: 'https://randomuser.me/api/portraits/men/51.jpg',
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')         
    }, {
      id: uuid(),
      email: 'cryptodev@gmail.com',
      password: bcrypt.hashSync('adefioye4', salt),
      is_admin: false,
      last_login_ip: ip.address(),
      last_login_date: moment().format('YYYY:MM:DD HH:mm:ss'),
      profile_pic_url: 'https://randomuser.me/api/portraits/men/56.jpg',
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')       
    }], {});
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
