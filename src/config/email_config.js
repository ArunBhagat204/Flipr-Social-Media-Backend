const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_AUTH_ID,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

module.exports = { transporter };
