'use strict';

var request = require('request');

const uuid = require('uuid/v4');
const YOUR_API_KEY = "AIzaSyBlvDXdwRBnKaC50fH-MEZDh-Ge8noSCGc";

module.exports = (sequelize, DataTypes) => {
  const AddressBooks = sequelize.define('AddressBooks', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull:false,
      defaultValue: () => uuid()
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull:false,
      validate:{
        notEmpty:true
      }
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    address_ext: {
      type: DataTypes.STRING,
      allowNull:true,
      validate:{
        notEmpty:false
      }
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull:false
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull:false
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
    tableName: 'addressbooks'
  });
  AddressBooks.associate = function(models) {
    // associations can be defined here
    AddressBooks.belongsTo(models.Users, {
      foreignKey: {name: 'user_id'},
      allowNull: false
    })
  };

  //Hook
  AddressBooks.hook('beforeCreate', (addressBks, option) => {
    //get the lat and lng of the user.
    let address = addressBks.address+','+addressBks.city+','+addressBks.state;
    const reqUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address},+NG&key=${YOUR_API_KEY}`;

    // async.parallel([
    //   function(callback){
    //     request(reqUrl, function(err, response, body) {
    //       let obj = JSON.parse(body);
    //       callback(false, obj);
    //     });
    //   }
    // ], (err, resultObj) => {
    //   // let {lat, lng} = resultObj.results[0].geometry.location;
    //   console.log(resultObj[0].results[0].geometry.location);
    //   addressBks.lat = "1234";
    //   addressBks.lng = "12233";      
    // });
  

  });

  return AddressBooks;
};