/**
 * Converts user search queries into regex entries and attaches them to request body
 * @param {Object} req Request object of the HTTP request
 * @param {Object} res Response object of the HTTP request
 * @param {Function} next Function to invoke the next middleware
 * @returns Failure message in case of error
 */

const userSearch = (req, res, next) => {
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
      message: err.message,
    });
  }
};

/**
 * Converts post search queries into regex entries and attaches them to request body
 * @param {Object} req Request object of the HTTP request
 * @param {Object} res Response object of the HTTP request
 * @param {Function} next Function to invoke the next middleware
 * @returns Failure message in case of error
 */

const postSearch = (req, res, next) => {
  try {
    const queries = {
      userQuery: req.query.username + ".*",
      titleQuery: req.query.title + ".*",
      hashtagQuery: req.query.hashtag + ".*",
      pageQuery: req.query.page,
    };
    req.body.queries = queries;
    return next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Converts comment search queries to request body
 * @param {Object} req Request object of the HTTP request
 * @param {Object} res Response object of the HTTP request
 * @param {Function} next Function to invoke the next middleware
 * @returns Failure message in case of error
 */

const commentSearch = (req, res, next) => {
  try {
    const queries = {
      postId: req.query.postId,
      pageQuery: req.query.page,
    };
    req.body.queries = queries;
    return next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { userSearch, postSearch, commentSearch };
