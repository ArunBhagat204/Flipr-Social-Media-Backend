const tokenManager = require("../helpers/tokenManager");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const emailSender = require("../helpers/emailSender");

const forgotPassword = (req) => {
  if (req.query.token) {
    const decoded = tokenManager.verify(
      req.query.token,
      process.env.PASS_TOKEN_SECRET
    );
    if (decoded.verified === false) {
      return {
        success: false,
        message: "Invalid password change token",
      };
    }
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      userModel.findOneAndUpdate(
        { username: decoded.content.username },
        { hash: hashedPassword },
        null,
        (err, docs) => {
          if (err) {
            throw new Error(err);
          }
        }
      );
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: true,
      message: "Password changed successfully",
    };
  } else {
    try {
      const verificationToken = tokenManager.newToken(
        { username: req.body.username },
        process.env.PASS_TOKEN_SECRET,
        "1h"
      );
      userModel.findOne({ username: req.body.username }, (err, res) => {
        if (err) {
          console.log(err);
        }
        const mail = {
          address: res.email,
          subject: "Password Change Request - Social-Media-App",
          body: `Hey ${res.username}!<br><br>
                    We recieved the request to change your account password.<br>
                    Click on the link to change your account: 
                    http://localhost:3000/users/forgot_password?token=${verificationToken}<br><br>
                    Team Social-Media-App`,
        };
        emailSender.send(mail);
      });
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: true,
      message: `Password change email sent to '${req.body.username}'`,
    };
  }
};

const deleteAccount = (req) => {
  try {
    userModel.findOne({ username: req.userId }, (err, res) => {
      if (err) {
        throw new Error(err.message);
      }
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

module.exports = { forgotPassword, deleteAccount };
