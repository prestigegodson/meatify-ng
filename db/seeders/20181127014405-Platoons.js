'use strict';

const moment = require('moment');
const uuid = require("uuid/v4");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //const butchers = await queryInterface.rawSelect('Butchers', {}, ['id']);
    //const animals = await queryInterface.rawSelect('Animals', {}, ['id']);

    /**
     * Got the information here
     * https://stackoverflow.com/questions/48732223/sequelize-seed-with-associations
     */

    const butchers = await queryInterface.sequelize.query(`SELECT id from butchers;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
    const animals = await queryInterface.sequelize.query(`SELECT id from animals;`, { type: queryInterface.sequelize.QueryTypes.SELECT});

    return queryInterface.bulkInsert('Platoons', [
    {
      id: uuid(),
      ref_no: '4930087234',
      exp_date: moment().add(1, 'days').format(),
      price: parseFloat('100000').toFixed(2),
      no_of_member: 4,
      price_per_member: parseFloat('100000') / 4,
      admin_charges: parseFloat('1000').toFixed(2),
      is_completed: false,
      animal_profile: 'https://livestock247.com/wp-content/uploads/cow2.jpg',
      color: 'dark grey',
      weight: '1,100 kg',
      breed: 'Red Bororo', 
      butcher_id: butchers[0].id,
      animal_type_id: animals[0].id,      
      created_at: moment().format(),
      updated_at: moment().format()
    },
    {
      id: uuid(),
      ref_no: '9300878901',
      exp_date: moment().add(2, 'days').format(),
      price: parseFloat('200000').toFixed(2),
      no_of_member: 4,
      price_per_member: parseFloat('200000') / 4,
      admin_charges: parseFloat('1500').toFixed(2),
      is_completed: false,
      animal_profile: 'https://livestock247.com/wp-content/uploads/SL1_1.jpg',
      color: 'grey',
      weight: '720 kg',
      breed: 'Zebu', 
      butcher_id: butchers[0].id,
      animal_type_id: animals[0].id,      
      created_at: moment().format(),
      updated_at: moment().format()      
    },
    {
      id: uuid(),
      ref_no: '4828985010',
      exp_date: moment().add(2, 'days').format(),
      price: parseFloat('21000').toFixed(2),
      no_of_member: 4,
      price_per_member: parseFloat('21000') / 4,
      admin_charges: parseFloat('500').toFixed(2),
      is_completed: false,
      animal_profile: 'https://fossilrim.org/wp-content/uploads/2017/01/RS21193_IMG_7994.jpg',
      color: 'grey',
      weight: '220 kg',
      breed: 'American LaMancha Goat', 
      butcher_id: butchers[0].id,
      animal_type_id: animals[1].id,      
      created_at: moment().format(),
      updated_at: moment().format()
    },
    {
      id: uuid(),
      ref_no: '4673209300',
      exp_date: moment().add(3, 'days').format(),
      price: parseFloat('4000').toFixed(2),
      no_of_member: 1,
      price_per_member: parseFloat('4000') / 1,
      admin_charges: parseFloat('500').toFixed(2),
      is_completed: false,
      animal_profile: 'https://chickenaddictsanonymous.weebly.com/uploads/1/3/8/9/13899886/472335.jpg',
      color: 'brown',
      weight: '120 kg',
      breed: 'Guinea fowl', 
      butcher_id: butchers[0].id,
      animal_type_id: animals[2].id,      
      created_at: moment().format(),
      updated_at: moment().format()      
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
