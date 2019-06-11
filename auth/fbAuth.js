var admin           = require("firebase-admin");
const _             = require('lodash');
const Utility       = require("../lib/Utility");
const serviceAccount  = require("../config/meatify-ng-firebase-adminsdk-m51nb-6b1b526e0b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://meatify-ng.firebaseio.com"
});


module.exports = {
   verifyToken(req, res, next) {

        let token = req.headers.authorization;

        admin.auth().verifyIdToken(token)
            .then(async user => {
                if(!_.isNull(user)){
                    let reqUser = await Users.findOne({where: {uid: user.user_id}});
                    req.body.user = _.assign(user, {id: reqUser.id});
                    return next();
                }else{
                    return res.status(401).send( Utility.errorResp("You are not authorized to access this resources", null) );//
                }                
            })
            .catch(err => res.status(401).send(Utility.errorResp(err.message, null)));
    }
}