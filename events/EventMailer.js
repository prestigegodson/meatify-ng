const EventEmitter      = require('events');
const nodemailer        = require('nodemailer');
var EmailTemplate       = require('email-templates').EmailTemplate

//Fetch HTML
// var htmlstream = fs.createReadStream('mail/welcome_mail.html');

class EventSmsMessenger extends EventEmitter{
    constructor(){
        super();
        this.on('SEND_WELCOME_MAIL', this.sendMail);
        this.on('SEND_ORDER_MAIL', this.sendOrderMail);
    }
    sendMail(data){
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: 'xxxxxx@gmail.com',
                pass: 'xxxxxxx.'
            }
        });

        let mailSender = transporter.templateSender(new EmailTemplate("mail/template/welcome"), {from: 'no-reply@meatify.ng'});     

        mailSender(
            {to: '"Meatify.NG 👻" <bitcert@gmail.com>', subject: 'Welcome to Meatify.ng'},
            { //context
                username: data.email,
                last_login_ip: data.last_login_ip,
                activationUrl: `https://www.meatify.ng/user/activate/${data.activationUrl}`
            }, function(err, info){
                if(err){
                    console.log(err);
                }else{
                    console.log(info);
                }
            });

    };

    sendOrderMail(data){
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: 'bitcert@gmail.com',
                pass: 'Adefioye1.'
            }
        });

        let mailSender = transporter.templateSender(new EmailTemplate("mail/template/order"), {from: 'no-reply@meatify.ng'});             
        mailSender(
            {to: '"Meatify.NG 👻" <bitcert@gmail.com>', subject: 'Order Meatify.ng'},
            {

            },
            (err, info) => {

            }
        )
    }
}

module.exports = EventSmsMessenger;