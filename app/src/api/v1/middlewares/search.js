/**
 * Converts request queries into regex entries and attaches them to request body
 * @param {Object} req Request object of the HTTP request
 * @param {Object} res Response object of the HTTP request
 * @param {Function} next Function to invoke the next middleware
 * @returns Failure message in case of error
 */

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
