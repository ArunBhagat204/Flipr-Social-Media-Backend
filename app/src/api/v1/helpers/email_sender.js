const axios = require("axios");
const axiosConfig = require("../../../config/axios_config");
const emailService = require("../../../config/email_config");

const send = (mail) => {
  axios
    .post(emailService.props.SEND_ROUTE, mail, axiosConfig.props)
    .then((res) => {
      console.log("[EMAIL SENDER]: ", res.data);
    })
    .catch((err) => {
      console.log("[EMAIL SENDER]: ", err.message);
    });
};

module.exports = { send };