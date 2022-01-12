const props = {
  SEND_ROUTE: "http://localhost:8000/email/send",
  API_KEY: process.env.EMAIL_SERVICE_KEY,
};

module.exports = { props };
