'use strict';

const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

    return queryInterface.bulkInsert('pickup_stations', [
      {
        id: uuid(),
        address: "8 Abiodun Aina,Street, Abule Tailor B/stop, Abule Egba",
        landmark: "Abule Tailor",
        phone: "09063057476, 09037775481",
        workinghours: "Mon-Fri, 8am-8pm; Saturday, 9am-5pm; Public Holidays, 9am-5pm",
        state_id: 25,
        city_id: 497
      },
      {
        id: uuid(),
        address: "19 Association Rd, Veora Estate, Arepo, Ogun State",
        landmark: "Punch Newspaper",
        phone: "07063317344, 09037775481",
        workinghours: "Mon-Fri, 8am-8pm; Saturday, 9am-5pm; Public Holidays, 9am-5pm",
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
