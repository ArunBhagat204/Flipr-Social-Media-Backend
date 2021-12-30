const userModel = require("../models/user");
const userValidation = require("../validation/userValidation");
const emailSender = require("../helpers/emailSender");
const tokenManager = require("../helpers/tokenManager");
const bcrypt = require("bcrypt");

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
      process.env.EMAIL_TOKEN_SECRET,
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
  const decoded = tokenManager.verify(token, process.env.EMAIL_TOKEN_SECRET);
  if (decoded.verified === false) {
    return {
      status: 401,
      message: `Email verification failed - ${decoded.content}`,
    };
  }
  try {
    userModel.findOneAndUpdate(
      { username: decoded.content.username },
      { email_verified: true },
      null,
      (err, docs) => {
        if (err) {
          throw new Error(err);
        }
      }
    );
    userModel.findOne({ username: decoded.content.username }, (err, res) => {
      userModel.deleteMany(
        { email: res.email, email_verified: false },
        (err) => {
          if (err) {
            throw new Error(err);
          }
        }
      );
    });
  } catch (err) {
    return {
      status: 500,
      message: `Verification failed - ${err.message}`,
    };
  }
  return {
    status: 200,
    message: "Email verification successful!",
  };
};

const login = (req) => {
  const validation = userValidation.login(req);
  if (!validation.success) {
    return { success: false, message: validation.message };
  }
  const credMatch = (req, db) => {
    bcrypt.compare(req.password, db.hash, (err, match) => {
      if (err) {
        console.log(err);
      }
      if (!match) {
        throw new Error("Incorrect Password");
      }
    });
  };
  try {
    if ("username" in req) {
      userModel.findOne({ username: req.username }, (err, res) => {
        if (!res) {
          throw new Error("No such username exists");
        }
        credMatch(req, res);
      });
    } else {
      userModel.findOne({ email: req.email }, (err, res) => {
        if (!res) {
          throw new Error("No such email exists");
        }
        credMatch(req, res);
      });
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
  const loginToken = tokenManager.newToken(
    { username: req.username },
    process.env.AUTH_TOKEN_SECRET,
    "1h"
  );
  return {
    success: true,
    message: "User logged in successfully",
    token: loginToken,
  };
};

const logout = (req) => {
  return { success: true, message: "Successfully logged out" };
};

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

module.exports = { signup, email_verify, login, logout, forgotPassword };
