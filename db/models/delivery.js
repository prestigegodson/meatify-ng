'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    locality: DataTypes.STRING,
    cost: DataTypes.DECIMAL
  }, {
    underscored: true,
    tableName: 'delivery'
  });
  Delivery.associate = function(models) {
    // associations can be defined here
  };
  return Delivery;
};