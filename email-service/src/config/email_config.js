const props = {
  USERID: process.env.EMAIL_USER || "development",
  PASS: process.env.EMAIL_PASS || 8000,
  SERVICE: "gmail",
};

module.exports = { props };
