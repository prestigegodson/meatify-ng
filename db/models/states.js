'use strict';
module.exports = (sequelize, DataTypes) => {
  const States = sequelize.define('States', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,      
    },
    name: DataTypes.STRING
  }, {
    tableName: 'states',
    timestamps: false 
  });
  States.associate = function(models) {
    // associations can be defined here
    States.hasMany(models.Cities, {
      foreignKey: {name: 'state_id'},
      as: 'cities',
      hooks: true 
    });

    States.hasMany(models.AddressBooks, {
      foreignKey: {name: 'state_id'},
      as: 'state',
      hooks: true
    });

  };
  return States;
};