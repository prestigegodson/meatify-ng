const EventEmitter = require('events');
const querystring = require('querystring');
const request = require('request');

class BetaSmsMessenger extends EventEmitter{
    constructor(){
        super();
        this.on('SEND_SMS', this.sendSMS);
    }

    sendSMS(data){
        var queryParams = {
            username: 'oyewoleabayomi@gmail.com',
            password: 'adefioye',
            sender: 'Meatify.NG',
            mobiles: data.phone,
            message: 'Welcome to Meatify.NG, your activation token is '+data.token
        }

        var baseUrl = "http://login.betasms.com/api/";
        var query = querystring.stringify(queryParams);
        var url = baseUrl+"?"+query;
        request(url, (error, response, body) => console.log(body));
    }

}

module.exports = BetaSmsMessenger;