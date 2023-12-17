const nodemailer = require('nodemailer');

// Create a transporter using Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smebcommunity@gmail.com',
        pass: process.env.GMAIL_PASS
    }
});

module.exports = transporter;