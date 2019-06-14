'use strict';

const sequelizePaginate = require('sequelize-paginate');
const uuid = require("uuid/v4");

module.exports = (sequelize, DataTypes) => {
  const Butchers = sequelize.define('Butchers', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },    
    uid:{
      type: DataTypes.UUID,
      allowNull:false,
      defaultValue: () => uuid()
    },    
    name: {
      type: DataTypes.STRING(50),
      allowNull:false,
      unique: true,
      validate:{
        notEmpty: true
      }
    },
    butcher_info: {
      type: DataTypes.STRING(200),
      allowNull:true
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull:false
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull:false
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull:false,
      unique: true,
      validate:{
        notEmpty:true
      }
    },
  }, {
    underscored: true,
    tableName: 'butchers'
  });
  Butchers.associate = function(models) {
    // associations can be defined here
    Butchers.hasMany(models.Platoons);
  };

  sequelizePaginate.paginate(Butchers);
  
  return Butchers;
};