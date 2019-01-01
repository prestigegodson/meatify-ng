'use strict';

const uuid = require("uuid/v4");
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('animals', [
      {
        id: uuid(),
        animal_type: 'COW'
      },
      {
        id: uuid(),
        animal_type: 'GOAT'
      },
      {
        id: uuid(),
        animal_type: 'OTHERS'
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
