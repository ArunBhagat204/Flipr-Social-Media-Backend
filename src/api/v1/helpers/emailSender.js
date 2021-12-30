const transporter = require("../../../config/emailConfig").transporter;

const send = (mail) => {
  transporter
    .sendMail({
      to: mail.address,
      from: '"Social Media App" <arun51628@gmail.com>',
      subject: mail.subject,
      html: mail.body,
    })
    .then(() => console.log("[Email Sender] : E-mail sent successfully!"))
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

module.exports = { send };
