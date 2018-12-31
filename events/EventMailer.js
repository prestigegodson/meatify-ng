const EventEmitter = require('events');
const nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate

//Fetch HTML
// var htmlstream = fs.createReadStream('mail/welcome_mail.html');

class EventMailer extends EventEmitter{
    constructor(){
        super();
        this.on('SEND_WELCOME_MAIL', this.sendMail);
    }
    sendMail(data){
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: 'oyewoleabayomi@gmail.com',
                pass: 'adefioye1984'
            }
        });

        let mailSender = transporter.templateSender(new EmailTemplate("mail/template/welcome"), {from: 'no-reply@meatify.ng'});     

        mailSender(
            {to: '"Meatify.NG 👻" <oyewoleabayomi@gmail.com>', subject: 'Welcome to Meatify.ng'},
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

    }
}

module.exports = EventMailer;