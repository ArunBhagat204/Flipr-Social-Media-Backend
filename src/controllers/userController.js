const userModel = require("../models/user");
const userValidation = require("../validation/userValidation");
const emailSender = require("../helpers/emailSender");
const tokenManager = require("../helpers/tokenManager");
const jwt = require("jsonwebtoken");

const signup = (req) => {
  const validationRes = userValidation.signup(req);
  if (validationRes.success === false) {
    return validationRes;
  }
  const user = new userModel({
    username: req.username,
    hash: req.password,
    email: req.email,
  });
  try {
    user.save();
    const verificationToken = tokenManager.newToken(
      { username: req.username },
      "1h"
    );
    const mail = {
      address: req.email,
      subject: "Verify your account - Social-Media-App",
      body: `Hey ${req.username}!<br><br>
            Thank you for creating an account at Social Media App.<br>
            Click on the link to verify your account: 
            http://localhost:3000/users/email_verify?token=${verificationToken}<br><br>
            Team Social-Media-App`,
    };
    emailSender.send(mail);
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
  return {
    success: true,
    message: `Account created for '${req.username}'. Verification e-mail sent...`,
  };
};

const email_verify = (token) => {
  try {
    jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, (err, decoded) => {
      console.log(decoded.username);
      userModel.findOneAndUpdate(
        { username: decoded.username },
        { email_verified: true },
        null,
        (err, docs) => {
          if (err) {
            console.log(err);
          }
        }
      );
      userModel.findOne({ username: decoded.username }, (err, res) => {
        userModel.deleteMany(
          { email: res.email, email_verified: false },
          (err) => {
            console.log(err);
          }
        );
      });
    });
  } catch {
    return "<h3>E-mail verifification failed!</h3>";
  }
  return "<h3>E-mail verification successful!</h3>";
};

module.exports = { signup, email_verify };
