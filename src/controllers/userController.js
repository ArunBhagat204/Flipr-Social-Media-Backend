const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const deleteAccount = (req) => {
  try {
    userModel.findOne({ username: req.userId }, (err, res) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log(res);
      if (
        bcrypt.compare(req.body.password, res.hash, (err, match) => {
          if (!match) {
            throw new Error("Password Incorrect");
          }
        })
      );
    });
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
  userModel.findOneAndDelete({ username: req.userId }, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
  return {
    success: true,
    message: "Account deleted successfully",
  };
};

module.exports = { deleteAccount };
