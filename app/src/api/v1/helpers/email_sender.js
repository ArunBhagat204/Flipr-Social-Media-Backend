const axios = require("axios");
const axiosConfig = require("../../../config/axios.config");
const emailService = require("../../../config/email.config");

/**
 * Invokes the email microservice to send an email
 * @param {Object} mail Contains the email content
 */

const send = (mail) => {
  axios
    .post(
      emailService.props.SEND_ROUTE,
      mail,
      axiosConfig.props(emailService.props.API_KEY)
    )
    .then((res) => {
      console.log("[EMAIL SENDER]: ", res.data);
    })
    .catch((err) => {
      console.log("[EMAIL SENDER]: ", err.message);
    });
};

module.exports = { send };
