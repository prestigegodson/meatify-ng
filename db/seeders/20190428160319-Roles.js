'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

      return queryInterface.bulkInsert('Roles', 
      [
        {role: 'admin'},
        {role: 'super-admin'},
        {role: 'butcher'},
        {role: 'user'},
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
      return queryInterface.bulkDelete('Person', null, {});
  }
};
