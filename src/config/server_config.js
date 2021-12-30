const props = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  HOSTNAME: process.env.HOSTNAME || "localhost",
};

module.exports = { props };
