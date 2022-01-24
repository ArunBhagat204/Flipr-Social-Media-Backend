const { Joi } = require("express-validation");

const userInteract = {
  body: Joi.object({
    username: Joi.string().required(),
  }),
};

const contentInteract = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = { userInteract, contentInteract };
