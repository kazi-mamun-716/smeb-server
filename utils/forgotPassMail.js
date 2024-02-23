const nodemailerMailOptions = require("./nodemailerMailOptions");
const transporter = require('./nodemailerTransporter');
module.exports=(mail, textAddress)=>{
    const subject = "Password Reset Link";
    const text = `
        Please Click on this link to Reset your password.
        ${textAddress}
    `;
    const mailOptions = nodemailerMailOptions("smebcommunity@gmail.com", mail, subject, text)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
}