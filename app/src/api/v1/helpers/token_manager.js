const jwt = require("jsonwebtoken");

/**
 * Issues a new JWT token
 * @param {String} content The content to be embedded in the token
 * @param {String} secret The secret-key for parsing the token
 * @param {String} expiry String representation of the token's expiry duration
 * @returns The newly generated JWT token
 */

const newToken = (content, secret, expiry) => {
  console.log("[Token Manager]: New token issued");
  return jwt.sign(content, secret, {
    expiresIn: expiry,
  });
};

/**
 * Verifies a JWT token and returns it's content
 * @param {String} token
 * @param {String} secret
 * @returns String embedded in the token
 */

const verify = (token, secret) => {
  try {
    const info = jwt.verify(token, secret);
    return {
      verified: true,
      content: info,
    };
  } catch (err) {
    return {
      verified: false,
      content: err.message,
    };
  }
};

module.exports = { newToken, verify };
