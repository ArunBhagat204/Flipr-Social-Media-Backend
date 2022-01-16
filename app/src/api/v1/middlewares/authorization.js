const tokenManager = require("../helpers/token_manager");

/**
 * Authorizes the application user
 * @param {Object} req Request object of the HTTP request
 * @param {Object} res Response object of the HTTP request
 * @param {Function} next Function to invoke the next middleware
 * @returns Failure message in case of error
 */

const authorization = (req, res, next) => {
  let token;
  if (req.cookies.login_token) {
    token = req.cookies.login_token;
  } else if (req.headers["authorization"]) {
    token = req.headers["authorization"].split(" ")[1];
  }
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "User not logged in",
    });
  }
  try {
    const decoded = tokenManager.verify(token, process.env.JWT_TOKEN_SECRET);
    if (decoded.verified === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication",
      });
    }
    req.userId = decoded.content.username;
    return next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Authentication server error",
    });
  }
};

module.exports = authorization;
