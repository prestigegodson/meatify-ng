'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const PickUpStations = sequelize.define('PickUpStations', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },
    address: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }      
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull:false,
      validate: {
        notEmpty: true
      }      
    },
    workinghours: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }      
    }
  }, {
    tableName: 'pickup_stations',
    timestamps: false
  });
  PickUpStations.associate = function(models) {
    // associations can be defined here
    PickUpStations.belongsTo(models.States, {
      foreignKey: {name: 'state_id'},
      as: 'state',
      allowNull: false
    })

    PickUpStations.belongsTo(models.Cities, {
      foreignKey: {name: 'city_id'},
      as: 'city',
      allowNull: false
    })

    PickUpStations.hasMany(models.Orders, {
      foreignKey: {name: 'pick_up_id'},
      as: 'orders',
      hooks: true
    });

  };
  return PickUpStations;
};