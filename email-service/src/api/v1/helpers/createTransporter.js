const nodemailer = require("nodemailer");

const transporter = (service, userid, password) => {
  const response = nodemailer.createTransport({
    service: service,
    auth: {
      user: userid,
      pass: password,
    },
  });
  return response;
};

module.exports = { transporter };
