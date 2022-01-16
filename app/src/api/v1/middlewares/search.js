const search = (req, res, next) => {
  try {
    const queries = {
      userQuery: req.query.username + ".*",
      emailQuery: req.query.email + ".*",
      cityQuery: req.query.city + ".*",
      orgQuery: req.query.org + ".*",
    };
    req.body.queries = queries;
    return next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

module.exports = search;
