'use strict';

const sequelizePaginate = require('sequelize-paginate');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },
    status: {
      type:   DataTypes.ENUM,
      values: ['PROCESSING', 'COMPLETED'],
      defaultValue: 'PROCESSING'
    }
  }, {
    underscored: true
  });
  Orders.associate = function(models) {
    // associations can be defined here
    Orders.belongsTo(models.Users, {
      foreignKey: {name: 'user_id'},
      allowNull: false
    });

    Orders.belongsTo(models.Delivery, {
      foreignKey: {name: 'delivery_id'},
      allowNull: false
    });    

    Orders.belongsTo(models.AddressBooks, {
      foreignKey: {name: 'address_book_id'},
      allowNull: false
    });

    Orders.belongsTo(models.Platoons, {
      foreignKey: {name: 'platoon_id'},
      allowNull: false
    })
  };

  //check if platoon is completed
  Orders.isPlatoonCompleted = (platoon) => {
    let check = false;
    sequelize.Platoons.find({where: {id: platoon}})
                      .then(platoon => {
                        if(platoon){ check = platoon.is_completed }
                      });
    return check;
  }

  sequelizePaginate.paginate(Orders);

  return Orders;
};