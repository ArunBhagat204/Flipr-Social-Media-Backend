const { ValidationError } = require("express-validation");

const errorHandler = (err, res, statusCode = 500) => {
  if (err instanceof ValidationError) {
    return res.status(422).json(err);
  }
  return res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
