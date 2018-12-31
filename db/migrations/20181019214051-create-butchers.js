'use strict';

const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Butchers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuid()
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      butcher_info: {
        type: Sequelize.STRING(200),
        allowNull:false
      },
      city: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      state: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Butchers');
  }
};