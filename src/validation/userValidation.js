const userModel = require("../models/user");

const signup = (req) => {
  if (!("username" in req && "password" in req && "email" in req)) {
    return { success: false, message: "Field missing" };
  }
  if (
    req.username.length > 50 ||
    req.password.length > 50 ||
    req.password.length < 6
  ) {
    return {
      success: false,
      message: "Username/Password of inappropriate length",
    };
  }
  const reEmail = /^\S+@\S+\.\S+$/;
  if (!reEmail.test(req.email)) {
    return {
      success: false,
      message: "Invalid E-mail syntax",
    };
  }
  try {
    if (
      userModel.exists({ username: req.username }, (err, res) => {
        if (res) {
          throw new Error("Username already exists");
        }
      })
    );
    if (
      userModel.exists(
        { email: req.email, email_verified: true },
        (err, res) => {
          if (res) {
            throw new Error("Email already used");
          }
        }
      )
    );
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
  return {
    success: true,
    message: "Valid Request",
  };
};

module.exports = { signup };
