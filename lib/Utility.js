/** Utility Libriary for Meatify */

// const request = require("request");
const Sequelize     = require("../db/models").Sequelize;
const _             = require("lodash");

let createNewModel = (Model, Object, callback) => {
    Model.create(Object)
         .then(result => callback(null, result))
         .catch(Sequelize.ValidationError, err => callback(err.errors[0], null))
         .catch(err => callback(err, null));
};

let destroyModel = (Model, Object, callback) => {
    Model.destroy({where: Object})
         .then(result => callback(null, result))
         .catch(err => callback(err, null));    
}

let generatePhoneValidationToken = () => {
    var dateTime = new Date();
    return (Math.floor(dateTime.getTime()*90000) + 10000).toString().substring(8, 14);
}

let makeSyncRequest = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject(response.statusCode);
            }
            resolve(body);
        });
    });
};

let validateRes = (object, res) => {
    if(object == null) return res.status(400).send(errorResp('Resources not found', null));
    res.status(200).send(successResp(null, object));
};

let verifyAdmin = (req, res, next) => {
    if(!req.user.is_admin){//Admin
        return res.status(401).send(errorResp('You are not authorized to perform this operation!', null))
    }
    return next();
}

let generatePlatoonRefNo = () => {
    return Math.round((Math.random() * 36 ** 12)).toString(36).toUpperCase();
}

let generateOrderNo = () => {
    //return Alpha Numeric
    return Math.round((Math.random() * 36 ** 10)).toString(36).toLocaleUpperCase()
}

let errorResp = (msg, error) => {
    return {
        status: false,
        message: msg,
        data: null,
        errors: error
    }
}

let successResp = (msg, data) => {
    return {
        status: true,
        message: msg,
        data: data,
        error: null
    }    
}

module.exports = {
    createNewModel,
    makeSyncRequest,
    destroyModel,
    validateRes,
    verifyAdmin,
    generatePlatoonRefNo,
    generatePhoneValidationToken,
    generateOrderNo,
    errorResp,
    successResp
}