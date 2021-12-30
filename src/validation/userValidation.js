const userModel = require("../models/user");

const signup = async (req) => {
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
    const userCheck = await userModel.exists({ username: req.username });
    const emailCheck = await userModel.exists({
      email: req.email,
      email_verified: true,
    });
    if (userCheck || emailCheck) {
      return {
        success: false,
        message: "Credentials already in use",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
  return {
    success: true,
    message: "Valid Request",
  };
};

const login = (req) => {
  if (!("username" in req || "email" in req) || !("password" in req)) {
    return { success: false, message: "Field missing" };
  }
  return { success: true, message: "Validation successful" };
};

module.exports = { signup, login };
