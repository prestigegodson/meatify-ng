'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPlatoon = sequelize.define('UserPlatoon', {}, {timestamps: false});
  UserPlatoon.associate = function(models) {
    // associations can be defined here
  };
  return UserPlatoon;
};