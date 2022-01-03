const createTransporter = require("../helpers/createTransporter");
const emailProps = require("../../../config/email_config").props;
const transporter = createTransporter.transporter(
  emailProps.SERVICE,
  emailProps.USERID,
  emailProps.PASS
);

/**
 * Send email to specified address
 * @param {Object} mail Object containing email address and content
 * @returns Success/Failure response along with associated message
 */

const send = async (mail) => {
  try {
    const response = await transporter.sendMail({
      to: mail.address,
      from: `"Social Media App" <${emailProps.USERID}>`,
      subject: mail.subject,
      html: mail.body,
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
