const tokenManager = require("../helpers/token_manager");
const friendService = require("../services/friend.service");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");

/**
 * Change password/Initiate password reset process
 * @param {string} token JWT verification token for password change
 * @param {Request body} body Req body with the new password
 * @returns Success/Failure response along with associated message
 */
const forgotPassword = (token, body) => {
  if (token) {
    const decoded = tokenManager.verify(token, process.env.JWT_TOKEN_SECRET);
    if (decoded.verified === false) {
      return {
        success: false,
        message: "Invalid password change token",
        statusCode: 403,
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
        statusCode: 500,
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
        emailSender.send(mail);
      });
    } catch (err) {
      return {
        success: false,
        message: err.message,
        statusCode: 500,
      };
    }
    return {
      success: true,
      message: `Password change email sent to '${body.username}'`,
    };
  }
};

/**
 * Delete account of specified user
 * @param {string} userId Username of the account to be deleted
 * @param {string} password Account Password for additional confirmation
 * @returns Success/Failure response along with associated message
 */
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
      statusCode: 401,
    };
  }
  const user = await userModel.findOne({ username: userId });
  user.followers.map(async (itr) => {
    await friendService.removeFriend(itr, userId);
    await friendService.unfollowUser(itr, userId);
  });
  await userModel.findOneAndDelete({ username: userId });
  return {
    success: true,
    message: "Account deleted successfully",
  };
};

module.exports = { forgotPassword, deleteAccount };
