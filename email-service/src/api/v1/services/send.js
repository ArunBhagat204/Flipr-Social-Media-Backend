const createTransporter = require("../helpers/createTransporter");
const emailProps = require("../../../config/email_config").props;
const transporter = createTransporter.transporter(
  emailProps.SERVICE,
  emailProps.USERID,
  emailProps.PASS
);

const send = async (data) => {
  try {
    const response = await transporter.sendMail({
      to: data.mail.address,
      from: `"Social Media App" <${emailProps.USERID}>`,
      subject: data.mail.subject,
      html: data.mail.body,
    });
    return {
      success: true,
      message: "[EMAIL SERVICE]: Email sent successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: `[EMAIL SERVICE]: Email sending failed ${err.message}`,
    };
  }
};

module.exports = { send };
