const emailConfig = require("./email.config");

const props = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    authorization: `bearer ${emailConfig.props.API_KEY}`,
  },
};

module.exports = { props };
