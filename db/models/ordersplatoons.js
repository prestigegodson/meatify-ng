'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrdersPlatoons = sequelize.define('OrdersPlatoons', {}, {timestamps: false, tableName: 'order_platoon'});
  OrdersPlatoons.associate = function(models) {
    // associations can be defined here
  };
  return OrdersPlatoons;
};