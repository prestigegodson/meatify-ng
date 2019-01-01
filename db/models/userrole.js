'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
  }, {
    // underscored: true,
    timestamps: false,
    tableName: 'userrole'
  });
  // UserRole.associate = function(models) {
  //   // associations can be defined here
  //   UserRole.belongsTo(models.Users, {
  //     foreignKey: 'user_id',
  //     allowNull: false
  //   });
  //   UserRole.belongsTo(models.Roles, {
  //     foreignKey: 'role_id',
  //     allowNull: false
  //   });
  // };
  return UserRole;
};