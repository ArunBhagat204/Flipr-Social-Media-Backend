const userModel = require("../models/user");
const imageManager = require("../helpers/image_manager");
const bcrypt = require("bcrypt");

/**
 * Searches for a user account according to username and email
 * @param {string} username Username to be searched for
 * @param {string} email Email to be searched for
 * @returns Success/Failure response along with associated message
 */
const userSearch = async (username, email) => {
  try {
    let users = await userModel
      .find(
        {
          username: { $regex: username },
          email: { $regex: email },
        },
        "username email email_verified"
      )
      .limit(100)
      .exec();
    if (users.length > 100) {
      users = users.slice(0, 100);
    }
    return {
      success: true,
      users: users,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

/**
 * Fetches the profile of a specified user
 * @param {string} userId ID of the user whose profile is requested
 * @returns Success/Failure response along with associated message
 */
const getProfile = async (userId) => {
  try {
    const user = await userModel.findById(userId).exec();
    if (!user) {
      throw new Error("User not found");
    }
    return {
      username: user.username,
      email: user.email,
      email_verfied: user.email_verified,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

/**
 * Edits the profile of the logged in user
 * @param {string} userId ID of the user whose profile is to be updated
 * @param {Request body} body Contains the updated profile info
 * @param {string} authId Username of the logged in user
 * @returns Success/Failure response along with associated message
 */
const editProfile = async (userId, body, authId) => {
  try {
    const user = await userModel.findById(userId).exec();
    if (!user) {
      throw new Error("User not found");
    }
    if (authId != user.username) {
      throw new Error("Cannot edit other user's profile");
    }
    const updated = await userModel
      .findOneAndUpdate(
        { username: authId },
        {
          username: body.username,
          email: body.email,
          hash: bcrypt.hashSync(body.password, 10),
        }
      )
      .exec();
    return {
      username: body.username,
      email: body.email,
      password: body.password,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

/**
 * Uploads a profile picture for the logged in user
 * @param {Buffer object} image Object containing the image buffer
 * @param {string} userId Username of the logged in user
 * @returns Success/Failure response along with associated message
 */

const uploadPfp = async (image, userId) => {
  try {
    const uploadRes = await imageManager.uploadImage(image);
    if (!uploadRes.success) {
      throw new Error(`${uploadRes.message}`);
    }
    const updated = await userModel
      .findOneAndUpdate(
        { username: userId },
        {
          profile_pic: uploadRes.message,
        }
      )
      .exec();
    return {
      success: true,
      message: "Profile picture uploaded successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

/**
 * Removed the profile picture of the logged in user
 * @param {string} userId Username of the logged in user
 * @returns Success/Failure response along with associated message
 */

const deletePfp = async (userId) => {
  try {
    const user = await userModel.findOne({ username: userId });
    const deleteRes = await imageManager.deleteImage(user.profile_pic);
    if (!deleteRes.success) {
      throw new Error(`${deleteRes.message}`);
    }
    const updated = await userModel
      .findOneAndUpdate(
        { username: userId },
        {
          profile_pic: "NaN",
        }
      )
      .exec();
    return {
      success: true,
      message: "Profile picture removed successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = { userSearch, getProfile, editProfile, uploadPfp, deletePfp };
