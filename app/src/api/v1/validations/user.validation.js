const { Joi } = require("express-validation");

const createAccount = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(64),
  }),
};

const login = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(8).max(64),
  }),
};

const forgotPassword = {
  body: Joi.object({
    username: Joi.string().required(),
  }),
};

const deleteAccount = {
  body: Joi.object({
    password: Joi.string().required().min(8).max(64),
  }),
};

const editProfile = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
    city: Joi.string().required(),
    organization: Joi.string().required(),
    accepting_friends: Joi.boolean().required(),
  }),
};

module.exports = {
  createAccount,
  login,
  forgotPassword,
  deleteAccount,
  editProfile,
};
