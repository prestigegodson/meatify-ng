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
    order_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type:   DataTypes.ENUM,
      values: ['PROCESSING', 'COMPLETED'],
      defaultValue: 'PROCESSING'
    },
    delivery_type: {
      type: DataTypes.ENUM,
      values: ['STANDARD', 'PICKUP'],
      defaultValue: 'STANDARD'
    }
  }, {
    underscored: true,
    tableName: 'orders'
  });
  Orders.associate = function(models) {
    // associations can be defined here
    Orders.belongsTo(models.Users, {
      foreignKey: {name: 'user_id'},
      as: 'user',
      allowNull: false
    });

    Orders.hasOne(models.Transactions);
    
    /*
    Orders.belongsTo(models.Delivery, {
      foreignKey: {name: 'delivery_id'},
      allowNull: false
    });
    */   

    Orders.belongsTo(models.AddressBooks, {
      foreignKey: {name: 'address_book_id'},
      as: 'address',
      allowNull: true
    });

    // Orders.belongsTo(models.Platoons, {
    //   foreignKey: {name: 'platoon_id'},
    //   allowNull: false
    // });

    Orders.belongsTo(models.PickUpStations, {
      foreignKey: {name: 'pick_up_id'},
      allowNull: true
    });

    Orders.belongsToMany(models.Platoons, { 
      through: models.OrdersPlatoons,
      as: 'platoons', 
      foreignKey: {name: 'order_id'}
    });    

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