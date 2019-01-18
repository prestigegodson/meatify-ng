'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlatoonImage = sequelize.define('PlatoonImage', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()      
    },
    // platoon_id: {
    //   type: DataTypes.STRING(100),
    //   allowNull:false,
    //   validate:{
    //     notEmpty:true
    //   }
    // },
    image_path: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    underscored: true,
    tableName: 'platoon_image'    
  });
  PlatoonImage.associate = function(models) {
    // associations can be defined here
    PlatoonImage.belongsTo(models.Platoons, {
      foreignKey: {name: 'platoon_id'},
      as: 'platoons',
      allowNull: false      
    })
  };
  return PlatoonImage;
};