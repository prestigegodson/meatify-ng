'use strict';

const sequelizePaginate = require('sequelize-paginate');
const bcrypt  = require('bcrypt');
const uuid    = require("uuid/v4");
const ip      = require('ip');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id:{
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull:false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate:{
        isEmail: true,
        notEmpty: true
      }
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull:true
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue: false
    },
    last_login_ip: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    last_login_date: { //lastSeen
      type: 'TIMESTAMP',
      allowNull:true
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
    Users.belongsToMany(models.Roles, { through: models.UserRole, as: 'roles' });
    Users.belongsToMany(models.Platoons, { 
      through: models.UserPlatoon,
      as: 'platoons',
      foreignKey: {name: 'user_id'}
    });    
  };

  //Hook
  /*
  Users.hook('beforeCreate', (user, option) => {
    const salt          = bcrypt.genSaltSync(10);
    user.password       = bcrypt.hashSync(user.password, salt);
    user.last_login_ip  = ip.address();
  });
  
  //Compare password checker
  Users.isPassword = (encodedPassword, password) => {
    return bcrypt.compareSync(password, encodedPassword);
  }
  */

  sequelizePaginate.paginate(Users);
    
  return Users;
};