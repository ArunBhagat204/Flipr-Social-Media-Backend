const tokenManager = require("../helpers/tokenManager");

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
    const decoded = tokenManager.verify(token, process.env.AUTH_TOKEN_SECRET);
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
