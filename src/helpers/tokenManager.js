const jwt = require("jsonwebtoken");

const newToken = (content, expiry) => {
  console.log("[Token Manager]: Creating Token...");
  return jwt.sign(content, process.env.EMAIL_TOKEN_SECRET, {
    expiresIn: expiry,
  });
};

module.exports = { newToken };
