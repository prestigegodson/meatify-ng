'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
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
          key: 'id'
        }
      },
      address_book_id: {
        type: Sequelize.UUID,
        references: {
          model: 'AddressBooks',
          key: 'id'
        }
      },
      platoon_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Platoons',
          key: 'id'
        }
      },      
      status: {
        type: Sequelize.ENUM,
        values: ['INITIALIZED', 'PROCESSING', 'COMPLETED'],
        defaultValue: 'INITIALIZED'
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
    return queryInterface.dropTable('Orders');
  }
};