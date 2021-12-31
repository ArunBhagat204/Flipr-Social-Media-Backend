const axios = require("axios");
const axiosConfig = require("../../../config/axios_config");
const emailService = require("../../../config/email_config");

const send = (mail) => {
  const data = {
    mail: mail,
    auth: emailService.props.API_KEY,
  };
  axios
    .post(emailService.props.SEND_ROUTE, data, axiosConfig.props)
    .then((res) => {
      console.log("[EMAIL SENDER]: ", res.data);
    })
    .catch((err) => {
      console.log("[EMAIL SENDER]: ", err.message);
    });
};

module.exports = { send };
