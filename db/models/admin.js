'use strict';

const sequelizePaginate = require('sequelize-paginate');
const bcrypt  = require('bcrypt');
const uuid    = require("uuid/v4");
const ip      = require('ip');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Users', {
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
    last_login_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue:null
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
    tableName: 'admin'
  });
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsToMany(models.Roles, { through: models.AdminRole, as: 'roles' });    
  };

  //Hook
  Admin.hook('beforeCreate', (user, option) => {
    const salt          = bcrypt.genSaltSync(10);
    user.password       = bcrypt.hashSync(user.password, salt);
    user.last_login_ip  = ip.address();
  });
  
  //Compare password checker
  Admin.isPassword = (encodedPassword, password) => {
    return bcrypt.compareSync(password, encodedPassword);
  }

  sequelizePaginate.paginate(Users);
    
  return Admin;
};