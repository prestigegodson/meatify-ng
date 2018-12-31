'use strict';

const Platoons = require('../models').Platoons;
const Users = require('../models').Users;
const UserPlatoon = require('../models').UserPlatoon;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
      const users = await queryInterface.sequelize.query(`SELECT id from users;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
      const platoons = await queryInterface.sequelize.query(`SELECT id from platoons;`, { type: queryInterface.sequelize.QueryTypes.SELECT});

      await UserPlatoon.create({platoon_id: platoons[0].id, user_id:users[0].id}).then(up => {});
      await UserPlatoon.create({platoon_id: platoons[0].id, user_id:users[1].id}).then(up => {});
      await UserPlatoon.create({platoon_id: platoons[2].id, user_id:users[2].id}).then(up => {});

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
