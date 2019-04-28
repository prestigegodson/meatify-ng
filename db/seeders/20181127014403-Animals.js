'use strict';

const uuid = require("uuid/v4");
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('animals', [
      {
        id: uuid(),
        animal_type: 'COW',
        animal_img: 'http://pngimg.com/uploads/cow/cow_PNG50577.png'
      },
      {
        id: uuid(),
        animal_type: 'GOAT',
        animal_img: 'https://banner2.kisspng.com/20180322/lpw/kisspng-golden-guernsey-sheep-clip-art-goat-5ab3ee61c109e5.1081196115217414097907.jpg'
      },
      {
        id: uuid(),
        animal_type: 'CHICKEN',
        animal_img: 'https://banner2.kisspng.com/20171220/twe/chicken-png-image-5a3afb75b27880.1805766415138149017319956.jpg'
      },
      {
        id: uuid(),
        animal_type: 'PIG',
        animal_img: 'https://africabusinessclassroom.com/wp-content/uploads/2015/03/pig-eating-300x200.jpg'
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
