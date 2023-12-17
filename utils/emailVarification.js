const nodemailerMailOptions = require("./nodemailerMailOptions");
const transporter = require('./nodemailerTransporter');
module.exports=(mail, textAddress)=>{
    const subject = "Verify Email Address";
    const text = `
        Please Click on this link to verify your email address.
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