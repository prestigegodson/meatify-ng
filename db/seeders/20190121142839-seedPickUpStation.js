'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    return queryInterface.bulkInsert('pickup_stations', [{
      address: "8 Abiodun Aina,Street, Abule Tailor B/stop, Abule Egba",
      landmark: "Abule Tailor",
      phone: "09063057476, 09037775481",
      workinghours: "Victoria Island",
      state_id: 25,
      city_id: 497
    }], {});
    
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
