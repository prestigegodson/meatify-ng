'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cities = sequelize.define('Cities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,      
    },
    name: DataTypes.STRING
  }, {
    tableName: 'cities',
    timestamps: false
  });
  Cities.associate = function(models) {
    // associations can be defined here
    Cities.belongsTo(models.States, {
      foreignKey: {name: 'state_id'},
      as: 'state',
      allowNull: false
    })

  };
  return Cities;
};