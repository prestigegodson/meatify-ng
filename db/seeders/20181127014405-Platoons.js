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
     * 
     * http://dagris.info/countries/350/breeds
     */

    const butchers = await queryInterface.sequelize.query(`SELECT id from butchers;`, { type: queryInterface.sequelize.QueryTypes.SELECT });
    const animals = await queryInterface.sequelize.query(`SELECT id from animals;`, { type: queryInterface.sequelize.QueryTypes.SELECT });

    return queryInterface.bulkInsert('platoons', [
      {
        uid: uuid(),
        ref_no: '4930087234',
        exp_date: moment().add(4, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('300000').toFixed(2),
        no_of_member: 4,
        description: "Contains high quality beef also with less fat, it has a highly developed and dilated internal organs than most breed, it produces a higher amount of offal :large intestine(Shaki), small intestine(Abodi),liver (Edo) etc.",
        price_per_member: parseFloat('300000') / 4,
        admin_charges: parseFloat('1000').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/8238-800x800.jpg',
        color: 'dark grey',
        weight: '480kg',
        breed: 'Red Bororo',
        butcher_id: butchers[0].id,
        animal_type_id: animals[0].id,
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },
      {
        uid: uuid(),
        ref_no: '9300878901',
        exp_date: moment().add(15, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('250000').toFixed(2),
        no_of_member: 4,
        description: "Contains high quality lean Beef with less fat, it produces more beef than other breeds, beef from this breed is hard and require more cooking time. Its Meat tend to become Bigger after cooking, an average 450kg of this breed can produce up to 5400 pieces of meat",
        price_per_member: parseFloat('250000') / 4,
        admin_charges: parseFloat('1500').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/cow2.jpg',
        color: 'grey',
        weight: '450kg',
        breed: 'Mbororo',
        butcher_id: butchers[0].id,
        animal_type_id: animals[0].id,
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },
      {
        uid: uuid(),
        ref_no: '9300878492',
        exp_date: moment().add(8, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('350000').toFixed(2),
        no_of_member: 4,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        price_per_member: parseFloat('350000') / 4,
        admin_charges: parseFloat('2500').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/dama-cattle.jpg',
        color: 'grey',
        weight: '720 kg',
        breed: 'Red Fulani',
        butcher_id: butchers[0].id,
        animal_type_id: animals[0].id,
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },      
      {
        uid: uuid(),
        ref_no: '4828985010',
        exp_date: moment().add(7, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('21000').toFixed(2),
        no_of_member: 4,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        price_per_member: parseFloat('21000') / 4,
        admin_charges: parseFloat('500').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/goat-meat.jpg',
        color: 'grey',
        weight: '220 kg',
        breed: 'American LaMancha Goat',
        butcher_id: butchers[0].id,
        animal_type_id: animals[1].id,
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },
      
      {
        uid: uuid(),
        ref_no: '4828986331',
        exp_date: moment().add(7, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('17000').toFixed(2),
        no_of_member: 2,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        price_per_member: parseFloat('17000') / 2,
        admin_charges: parseFloat('500').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/IMG_20161110_144919-300x204.jpg',
        color: 'grey',
        weight: '220 kg',
        breed: 'American LaMancha Goat',
        butcher_id: butchers[0].id,
        animal_type_id: animals[1].id,
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },      
      {
        uid: uuid(),
        ref_no: '4673209300',
        exp_date: moment().add(5, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('4000').toFixed(2),
        no_of_member: 1,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        price_per_member: parseFloat('4000') / 1,
        admin_charges: parseFloat('500').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/472335.jpg',
        color: 'brown',
        weight: '120 kg',
        breed: 'Guinea fowl',
        butcher_id: butchers[0].id,
        animal_type_id: animals[2].id,
        created_at: moment().format('YYYY:MM:DD HH:mm:ss'),
        updated_at: moment().format('YYYY:MM:DD HH:mm:ss')
      },
      {
        uid: uuid(),
        ref_no: '4673207344',
        exp_date: moment().add(10, 'days').format('YYYY:MM:DD HH:mm:ss'),
        price: parseFloat('4500').toFixed(2),
        no_of_member: 2,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        price_per_member: parseFloat('4500') / 2,
        admin_charges: parseFloat('500').toFixed(2),
        is_completed: false,
        animal_profile: 'https://api.meatify.ng/images/kuroiler-chicken-in-zimbabwe-with-know-the-right-type-of-to-rear-for-profit.jpg',
        color: 'brown',
        weight: '120 kg',
        breed: 'Kuroiler Chicken',
        butcher_id: butchers[0].id,
        animal_type_id: animals[2].id,
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
