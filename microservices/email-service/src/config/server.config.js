const props = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8000,
  HOSTNAME: process.env.HOSTNAME || "localhost",
  AUTH_KEY: process.env.SERVICE_KEY || "sampleKey",
};

module.exports = { props };
