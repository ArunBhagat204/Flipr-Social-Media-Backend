const transporter = require("../../../config/email_config").transporter;

const send = (mail) => {
  transporter
    .sendMail({
      to: mail.address,
      from: '"Social Media App" <arun51628@gmail.com>',
      subject: mail.subject,
      html: mail.body,
    })
    .then(() => console.log("[Email Sender] : New email sent"))
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

module.exports = { send };
