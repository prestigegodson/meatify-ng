'use strict';

const uuid = require("uuid/v4");
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   const users = await queryInterface.sequelize.query(`SELECT id from users;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
    // console.log(users);
    return queryInterface.bulkInsert('addressbooks', 
    [{
      id: uuid(),
      name : "Oyewole Abayomi Samuel", 
      address : "6B, Crown Court Estate, Orisa Sanya Street", 
      address_ext : "Oniru Estate",
      is_default : true,
      phone_number : "07063317344",
      city : "Victoria Island",
      state : "Lagos State",
      user_id: users[0].id,
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
    },
    {
      id: uuid(),
      name : "Adekunle O. Oludayo", 
      address : "Ora Ekpen Cres", 
      address_ext : "Oniru Estate",
      is_default: false,
      phone_number : "08034902177",
      city : "Gbagada",
      state : "Lagos State",
      user_id: users[0].id,
      created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
      updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
    }
  ], {});
    
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
