'use strict';

const uuid = require("uuid/v4");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
   const platoons = await queryInterface.sequelize.query(`SELECT id from platoons;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
    // console.log(platoons);
      return queryInterface.bulkInsert('platoon_image', [
        {
          id: uuid(),
          image_path: 'http://i.imgur.com/IF2QsVa.jpg',
          platoon_id: platoons[1].id
        }, {
          id: uuid(),
          image_path: 'https://nnimgt-a.akamaihd.net/transform/v1/crop/frm/3AYKBMnFjcWGESVJQNBfejj/612ed40e-9fe7-4dda-97e3-64b82aabd227.JPG/r731_0_3872_2590_w1200_h678_fmax.jpg',
          platoon_id: platoons[1].id
        },{
          id: uuid(),
          image_path: 'http://i.imgur.com/IF2QsVa.jpg',
          platoon_id: platoons[1].id
        },
        {
          id: uuid(),
          image_path: 'https://nnimgt-a.akamaihd.net/transform/v1/crop/frm/3AYKBMnFjcWGESVJQNBfejj/612ed40e-9fe7-4dda-97e3-64b82aabd227.JPG/r731_0_3872_2590_w1200_h678_fmax.jpg',
          platoon_id: platoons[2].id
        }], {});
    
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
