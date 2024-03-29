'use strict';

const uuid = require("uuid/v4");
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('butchers', [
      {
        uid: uuid(),
        name: 'Nigeria army abattoir, Ashanti',
        city: 'Ashanti',
        state: 'Lagos State',
        phone_number: '(+234) 806-331-7344',
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },
      {
        uid: uuid(),
        name: 'Eko meat van (Eko oni baje)',
        city: 'Lagos',
        state: 'Lagos State',
        phone_number: '(+234) 806-331-0001',
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
  }
};
