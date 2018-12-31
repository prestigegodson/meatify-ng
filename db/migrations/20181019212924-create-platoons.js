'use strict';

const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Platoons', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      ref_no: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      exp_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      price_per_member: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      butcher_id: {
        type: Sequelize.UUID,  
        allowNull: false,
        references: {
          model: 'Butchers',
          key: 'id'
        }        
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
    return queryInterface.dropTable('Platoons');
  }
};