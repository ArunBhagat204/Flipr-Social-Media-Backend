const serverConfig = require("../../../config/server.config");

const authorization = (req, res, next) => {
  const authToken = req.headers["authorization"].split(" ")[1];
  try {
    if (serverConfig.props.AUTH_KEY === authToken) {
      return next();
    }
    res.status(401).json({
      success: false,
      message: "Authentication Key Invalid",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Authorization Server Error - ${err.message}`,
    });
  }
};

module.exports = authorization;
