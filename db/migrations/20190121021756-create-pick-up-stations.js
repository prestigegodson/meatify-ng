'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PickUpStations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      state_id: {
        type: Sequelize.STRING
      },
      city_id: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      landmark: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      workinghours: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PickUpStations');
  }
};