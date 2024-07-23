const nodemailer = require("nodemailer");

require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendEmail(to, subject, text) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_NAME,
        to,
        subject,
        text
    })
}

module.exports = {
    sendEmail
}