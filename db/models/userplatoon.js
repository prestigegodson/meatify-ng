'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPlatoon = sequelize.define('UserPlatoon', {}, {timestamps: false, tableName: 'user_platoon'});
  UserPlatoon.associate = function(models) {
    // associations can be defined here
  };
  return UserPlatoon;
};