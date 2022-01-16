const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const tokenManager = require("../helpers/token_manager");

/**
 * Authenticates a particular user
 * @param {Request object} req Contains login credentials
 * @returns Success/Failure response, along with a JWT token
 */
const login = async (req) => {
  try {
    const credMatch = (req, db) => {
      const match = bcrypt.compareSync(req.password, db.hash);
      if (!match) {
        return {
          success: false,
          message: "Incorrect Password",
          statusCode: 401,
        };
      }
    };
    if ("username" in req) {
      const user = await userModel.findOne({ username: req.username }).exec();
      if (!user) {
        return {
          success: false,
          message: "No such username exists",
          statusCode: 401,
        };
      }
      credMatch(req, user);
    } else {
      const user = await userModel.findOne({ email: req.email }).exec();
      if (!user) {
        return {
          success: false,
          message: "No such email exists",
          statusCode: 401,
        };
      }
      credMatch(req, user);
    }
  } catch (err) {
    return {
      success: false,
      statusCode: 500,
      message: err.message,
    };
  }
  const loginToken = tokenManager.newToken(
    { username: req.username },
    process.env.JWT_TOKEN_SECRET,
    "1h"
  );
  return {
    success: true,
    message: "User logged in successfully",
    token: loginToken,
  };
};

module.exports = { login };
