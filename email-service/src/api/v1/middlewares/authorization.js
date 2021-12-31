const serverConfig = require("../../../config/server_config");

const authorization = (req, res, next) => {
  try {
    if ("auth" in req.body) {
      if (serverConfig.props.AUTH_KEY === req.body.auth) {
        return next();
      }
    }
    res.status(500).json({
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
