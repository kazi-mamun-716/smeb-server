const nodemailerMailOptions = require("./nodemailerMailOptions");
const transporter = require('./nodemailerTransporter');
module.exports=(mail, code)=>{
    const subject = "SMEB Verification Code";
    const text = `
        Your Verification code is: ${code}
        This code is validate only for this session.
        if session expired you need to regenerate this code
    `;
    const mailOptions = nodemailerMailOptions("smebcommunity@gmail.com", mail, subject, text)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
}