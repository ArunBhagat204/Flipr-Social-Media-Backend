const { Joi } = require("express-validation");

const interact = {
  body: Joi.object({
    username: Joi.string().required(),
  }),
};

module.exports = { interact };
