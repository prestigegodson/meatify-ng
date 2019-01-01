'use strict';
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, { 
    timestamps: false,
    underscored: true,
    tableName: 'roles'
  });
  Roles.associate = function(models) {
    // associations can be defined here
    Roles.belongsToMany(models.Users, { through: models.UserRole });
  };
  return Roles;
};