'use strict';

const AdminRole = require('../models').AdminRole;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  const admin = await queryInterface.sequelize.query(`SELECT id from admin;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
  const roles = await queryInterface.sequelize.query(`SELECT id from roles;`, { type: queryInterface.sequelize.QueryTypes.SELECT});

  await AdminRole.create({admin_id: admin[0].id, role_id:roles[0].id}).then(up => {});
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
