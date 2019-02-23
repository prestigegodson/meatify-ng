'use strict';

const sequelizePaginate = require('sequelize-paginate');
const bcrypt  = require('bcrypt');
const uuid    = require("uuid/v4");
const ip      = require('ip');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate:{
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    validation_token: {
      type: DataTypes.INTEGER(10),
      allowNull:true
    },
    profile_pic_url:{
      type: DataTypes.STRING(150),
      allowNull:true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue: false
    },
    last_login_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue:null
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    last_login_date: {
      type: DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue: false
    }
  }, {
    underscored: true,
    timestamps: true,
    tableName: 'users'
  });
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.Orders);
    Users.hasMany(models.AddressBooks);
    // Users.hasMany(models.Coupon);
    Users.belongsToMany(models.Roles, { through: models.UserRole });
    Users.belongsToMany(models.Platoons, { 
      through: models.UserPlatoon,
      as: 'platoons',
      foreignKey: {name: 'user_id'}
    });    
  };

  //Hook
  Users.hook('beforeCreate', (user, option) => {
    const salt          = bcrypt.genSaltSync(10);
    user.password       = bcrypt.hashSync(user.password, salt);
    user.last_login_ip  = ip.address();
  });
  
  //Compare password checker
  Users.isPassword = (encodedPassword, password) => {
    return bcrypt.compareSync(password, encodedPassword);
  }

  sequelizePaginate.paginate(Users);
    
  return Users;
};