'use strict';

const sequelizePaginate = require('sequelize-paginate');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Platoons = sequelize.define('Platoons', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },   
    ref_no: {
      type: DataTypes.STRING(40),
      allowNull:false,
      validate: {
        notEmpty: true
      }           
    },
    description:{
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true
      }       
    },
    exp_date: {
      type: DataTypes.DATE,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    price_per_member: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        notEmpty: true
      }
    },
    no_of_member:{
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }      
    },
    admin_charges: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        notEmpty: true
      }      
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notEmpty: true
      }
    },
    animal_profile:{
      type: DataTypes.STRING,
      allowNull:true 
    },    
    color: {
      type: DataTypes.STRING(50),
      allowNull:false,
      validate:{
        notEmpty:true
      }      
    },
    weight: {
      type: DataTypes.STRING(20),
      allowNull:false,
      validate:{
        notEmpty:true
      }       
    },
    breed: {
      type: DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:true
      }      
    }
  }, {
    underscored: true,
    tableName: 'platoons'
  });
  Platoons.associate = function(models) {
    // associations can be defined here
    Platoons.belongsTo(models.Butchers, {
      foreignKey: {name: 'butcher_id'},
      as: 'butcher',
      allowNull: false
    });

    Platoons.belongsTo(models.Animals, {
      foreignKey: {name: 'animal_type_id'},
      as: 'animal',
      allowNull: false
    });    

    Platoons.belongsToMany(models.Users, { 
      through: models.UserPlatoon,
      as: 'users', 
      foreignKey: {name: 'platoon_id'}
    });

    Platoons.belongsToMany(models.Orders, { 
      through: models.OrdersPlatoons,
      as: 'order', 
      foreignKey: {name: 'platoon_id'}
    });     

    Platoons.hasMany(models.Orders, {
      foreignKey: {name: 'platoon_id'},
      as: 'orders',
      onDelete: 'CASCADE',
      hooks: true
    });

    Platoons.hasMany(models.PlatoonImage, {
      foreignKey: {name: 'platoon_id'},
      as: 'images',
      onDelete: 'CASCADE',
      hooks: true
    }); 
    
  };

  sequelizePaginate.paginate(Platoons);

  return Platoons;
};