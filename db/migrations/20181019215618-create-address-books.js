'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AddressBooks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuid()
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'cascade'
        }
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull:false
      },
      address: {
        type: Sequelize.STRING(200),
        allowNull:false
      },
      address_ext: {
        type: Sequelize.STRING,
        allowNull:true
      },
      city: {
        type: Sequelize.STRING(20),
        allowNull:true
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull:true
      },
      lat: {
        type: Sequelize.STRING(45),
        allowNull:true
      },
      lng: {
        type: Sequelize.STRING(45),
        allowNull:true
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
    return queryInterface.dropTable('AddressBooks');
  }
};