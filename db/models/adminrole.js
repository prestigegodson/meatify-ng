'use strict';
module.exports = (sequelize, DataTypes) => {
  const AdminRole = sequelize.define('AdminRole', {
  }, {
    // underscored: true,
    timestamps: false,
    tableName: 'adminrole'
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
  return AdminRole;
};