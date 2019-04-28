'use strict';

const uuid = require('uuid/v4');
const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const Animals = sequelize.define('Animals', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },    
    animal_type: {
      type:   DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate:{
        notEmpty: true
      }
    },
    animal_img:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:true
      }
    }
  }, {
    underscored: true,
    timestamps: false,
    tableName: 'animals'
  });
  Animals.associate = function(models) {
    // associations can be defined here

    Animals.hasMany(models.Platoons, {
      foreignKey: {name: 'animal_type_id'},
      as: 'platoons',
      hooks: true
    });    

  };
  
  sequelizePaginate.paginate(Animals);
  return Animals;
};