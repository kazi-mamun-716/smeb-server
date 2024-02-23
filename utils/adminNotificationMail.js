const nodemailerMailOptions = require("./nodemailerMailOptions");
const transporter = require('./nodemailerTransporter');
module.exports=(mail, text)=>{
    const subject = "Member Approval Information for SMEB";    
    const mailOptions = nodemailerMailOptions("smebcommunity@gmail.com", mail, subject, text)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
}