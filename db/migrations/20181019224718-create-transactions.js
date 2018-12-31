'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Orders',
          key: 'id'
        }        
      },
      transaction_ref: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transaction_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull:false
      },
      payment_status: {
        type: Sequelize.ENUM,
        values: ['successful', 'failed', 'pending']
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
    return queryInterface.dropTable('Transactions');
  }
};