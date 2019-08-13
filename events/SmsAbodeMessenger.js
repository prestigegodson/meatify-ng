const EventEmitter = require('events');
const querystring = require('querystring');
const request = require('request');

class SmsAbodeMessenger extends EventEmitter{
    constructor(){
        super();
        this.on('SEND_DND_SMS', this.sendDND);
        this.on('SEND_SMS', this.sendSMS);
    }

    sendDND(data){
        var queryParams = {
            username: 'xxxxxx@meatify.ng',
            password: 'xxxxxx',
            sender: 'Meatify.NG',
            recipient: data.phone,
            message: 'Welcome to Meatify.NG, your activation code is '+data.token
        }

        var baseUrl = "http://smsabode.com/api/sms/dnd-route";
        var query = querystring.stringify(queryParams);
        var url = baseUrl+"?"+query;
        request(url, (error, response, body) => console.log(body));
    }

    sendSMS(data){
        var queryParams = {
            username: 'xxxxx@meatify.ng',
            password: 'xxxxxx',
            sender: 'Meatify.NG',
            recipient: data.phone,
            message: 'Welcome to Meatify.NG, your activation code is '+data.token
        }

        let baseUrl = "http://smsabode.com/api/sms/sendsms";
        var query = querystring.stringify(queryParams);
        var url = baseUrl+"?"+query;
        request(url, (error, response, body) => console.log(body));
    }

}

module.exports = SmsAbodeMessenger;