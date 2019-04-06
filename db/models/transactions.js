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
      allowNull: false,
      unique: true,
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    items_amount: {
      type: DataTypes.DECIMAL,
      allowNull:false
    },
    total_charge: {
      type: DataTypes.DECIMAL,
      allowNull:false      
    },
    delivery_charge: {
      type: DataTypes.DECIMAL,
      allowNull:true      
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
      as: 'orders',
      allowNull: false,
    })
  };
  return Transactions;
};