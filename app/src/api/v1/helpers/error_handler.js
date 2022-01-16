const { ValidationError } = require("express-validation");

const errorHandler = (err, res) => {
  if (err instanceof ValidationError) {
    return res.status(422).json(err);
  }
  return res.status(500).json(err);
};

module.exports = errorHandler;
