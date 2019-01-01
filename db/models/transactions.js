'use strict';

const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },
    transaction_ref: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull:false
    },
    payment_status: {
      type: DataTypes.ENUM,
      values: ['successful', 'failed', 'pending']
    }
  }, {
    underscored: true,
    tableName: 'transactions'
  });

  Transactions.associate = function(models) {
    // associations can be defined here
    Transactions.belongsTo(models.Orders, {
      foreignKey: {name: 'order_id'},
      allowNull: false,      
    })
  };
  return Transactions;
};