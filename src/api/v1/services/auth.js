const validation = require("./validation");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const tokenManager = require("../helpers/token_manager");

const login = async (req) => {
  const validationRes = validation.login(req);
  if (!validationRes.success) {
    return { success: false, message: validationRes.message };
  }
  const credMatch = (req, db) => {
    const match = bcrypt.compareSync(req.password, db.hash);
    if (!match) {
      throw new Error("Incorrect Password");
    }
  };
  try {
    if ("username" in req) {
      const user = await userModel.findOne({ username: req.username }).exec();
      if (!user) {
        throw new Error("No such username exists");
      }
      credMatch(req, user);
    } else {
      const user = await userModel.findOne({ email: req.email }).exec();
      if (!user) {
        throw new Error("No such email exists");
      }
      credMatch(req, user);
    }
  } catch (err) {
    return { success: false, message: err.message };
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
