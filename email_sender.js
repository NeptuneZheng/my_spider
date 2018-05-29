var config = require('./config'),
    nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: config.email_setting.service,
    auth:{
        user: config.email_setting.server_name,
        pass: config.email_setting.pasword
    }
});
var sendEmail = function(recivers,subject,body){
    transporter.sendMail({
        from: config.email_setting.server_name,
        to: config.reciver_info.to,
        cc: config.reciver_info.cc,
        subject: subject,
        html: body
    },function (err,res) {
        if(err){
            console.log(err)
        }else{
            console.log('email send success.')
        }
    });
};

module.exports.sendEmail = sendEmail;