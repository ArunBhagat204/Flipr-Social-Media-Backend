const register = require("../services/register.service");
const accountServices = require("../services/account.service");
const auth = require("../services/auth.service");
const errorHandler = require("../helpers/error_handler");

const signup = async (req, res) => {
  const result = await register.registerUser(req.body);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const email_verify = (req, res) => {
  const result = register.emailVerify(req.query.token);
  res.status(result.statusCode).send(`<h4>${result.message}</h4>`);
};

const login = async (req, res) => {
  const result = await auth.login(req.body);
  res
    .cookie("login_token", result.token, {
      httpOnly: true,
    })
    .status(result.success === false ? 403 : 200)
    .json(result);
};

const logout = (req, res) => {
  res.clearCookie("login_token").status(200).json({
    success: true,
    message: "User successfully logged out",
  });
};

const forgotPassword = async (req, res) => {
  const result = await accountServices.forgotPassword(
    req.query.token,
    req.body
  );
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

module.exports = { signup, email_verify, login, logout, forgotPassword };
