const tokenManager = require("../helpers/token_manager");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const axiosConfig = require("../../../config/axios_config");

const forgotPassword = (token, body) => {
  if (token) {
    const decoded = tokenManager.verify(token, process.env.JWT_TOKEN_SECRET);
    if (decoded.verified === false) {
      return {
        success: false,
        message: "Invalid password change token",
      };
    }
    try {
      const hashedPassword = bcrypt.hashSync(body.password, 10);
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
        { username: body.username },
        process.env.JWT_TOKEN_SECRET,
        "1h"
      );
      userModel.findOne({ username: body.username }, (err, res) => {
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
        axios
          .post("http://localhost:8000/email/send", mail, axiosConfig.props)
          .then((res) => {
            console.log("[AXIOS]: ", res.data);
          })
          .catch((err) => {
            console.log("[AXIOS]: ", err.message);
          });
      });
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: true,
      message: `Password change email sent to '${body.username}'`,
    };
  }
};

const deleteAccount = async (userId, password) => {
  try {
    const res = await userModel.findOne({ username: userId }).exec();
    const match = bcrypt.compareSync(password, res.hash);
    if (!match) {
      throw new Error("Password Incorrect");
    }
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
  userModel.findOneAndDelete({ username: userId }, (err, res) => {
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
