const search = (req, res, next) => {
  try {
    req.body.userQuery = req.query.username + ".*";
    req.body.emailQuery = req.query.email + ".*";
    return next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

module.exports = search;
