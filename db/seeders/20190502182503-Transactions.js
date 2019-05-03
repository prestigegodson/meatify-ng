'use strict';

const utility       = require('../../lib/Utility');
const seq           = require('../../db/models').sequelize;
const Users         = require("../../db/models").Users;
const Platoons      = require('../../db/models').Platoons;
const Orders        = require('../../db/models').Orders;
const Transactions  = require('../../db/models').Transactions;//UserPlatoon OrdersPlatoons
const UserPlatoon  = require('../../db/models').UserPlatoon;// OrdersPlatoons
const OrdersPlatoons  = require('../../db/models').OrdersPlatoons;// 
const uuid          = require('uuid/v4');
const _             = require("lodash");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const users = await queryInterface.sequelize.query(`SELECT id from users;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
    const addressBook = await queryInterface.sequelize.query(`SELECT id from addressbooks;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
    const platoons = await queryInterface.sequelize.query(`SELECT id from platoons;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
    // const platoons = await queryInterface.sequelize.query(`SELECT id from platoons;`, { type: queryInterface.sequelize.QueryTypes.SELECT});
        const payload = {
          "transaction_ref":"70d9d94e-f7a7-4cfb-ab43-d750c64f812a",
          "transaction_type":"card",
          "platoons":[  
            platoons[1].id
          ],
          "delivery":1,
          "address_book":addressBook[0].id,
          "pick_up":null,
          "total_amount":25000,
          "status":"success",
          "item_amount":25000.0,
          "delivery_amount":0
        }

        let platoonLists = [];

        const orders = await Orders.create({
            user_id:            users[0].id,
            order_no:           utility.generateOrderNo(),
            delivery_type:      payload.delivery == 1 ? 'STANDARD' : 'PICKUP',//x
            address_book_id:    payload.address_book,
            pick_up_id:         payload.pick_up,//<= add this to order
        });
        
        const trnx = await Transactions.create({
                transaction_ref:    payload.transaction_ref,
                transaction_type:   payload.transaction_type,
                total_charge:       payload.total_amount,
                items_amount:       payload.item_amount,
                delivery_charge:    payload.delivery_amount,
                payment_status:     'successful',
                order_id:           orders.id,

          });
                //send order mail
              function me(orders, loggedUsers){
                return new Promise(resolve => {
                payload.platoons.map( async (id, index) => {
                    //platoon add new user

                    const platoon = await Platoons.findOne({where:{id: id}});
                    
                    let users = await platoon.getUsers();
                    if(platoon.is_completed){
                        platoonLists.push({'platoon': platoon,'is_completed': true});
                        resolve(platoonLists);
                        //put it in pending state
                    }else if(_.isEqual(platoon.no_of_member, users.length)){
                      
                        await platoon.update({is_completed: true});
                        platoonLists.push({'platoon': platoon,'is_completed': true});
                        resolve(platoonLists);
                    }else{
                        await platoon.setUsers([loggedUsers[0].id]);
                        await orders.setPlatoons([platoon.id]);// platoon.setOrders([orders.id]);                                
                        platoonLists.push({'platoon': platoon,'is_completed': false});
                        resolve(platoonLists);
                    }

                    // if((payload.platoons.length - 1) == index){resolve();}
                });
                
              });
            }
            await me(orders, users);

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
