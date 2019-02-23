'use strict';
let fs = require('fs');
const path = require('path');

const States = require('../models').States;
const Cities = require('../models').Cities;

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const state = await queryInterface.sequelize.query(`SELECT id from states;`, { type: queryInterface.sequelize.QueryTypes.SELECT });
    
    if (state.length > 0) {
      console.log('States and Cities seeded');
    } else {

      let reqPath = path.join(__dirname, '../../states-and-cities.json');
      let data = fs.readFileSync(reqPath);
      let parsedData = JSON.parse(data);

      for (let i = 0; i < parsedData.length; i++) {

        let state = await States.create({ name: parsedData[i].state.name });
        let lgt = parsedData[i].state.locals;

        for (let i = 0; i < lgt.length; i++) {
          await Cities.create({ name: lgt[i].name, state_id: state.id }).then(up => { });
        }

      };

    }
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
