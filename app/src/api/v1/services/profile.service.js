const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const checkRelation = require("../helpers/check_relation");
const imageManager = require("../helpers/image_manager");
const bcrypt = require("bcrypt");

/**
 * Searches for a user account according to username and email
 * @param {string} curUser Username of the logged in user
 * @param {Object} queries Search queries in regex format
 * @returns Success/Failure response along with associated message
 */

const userSearch = async (curUser, queries) => {
  try {
    let users = await userModel
      .find(
        {
          username: { $regex: queries.userQuery },
          email: { $regex: queries.emailQuery },
          city: { $regex: queries.cityQuery },
          organization: { $regex: queries.orgQuery },
        },
        "username email email_verified profile_pic"
      )
      .limit(100)
      .exec();
    const results = users.filter(async (user) => {
      const isBlocked = await checkRelation.block(user.username, curUser);
      return !isBlocked;
    });
    return {
      success: true,
      users: results,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

/**
 * Fetches the profile of a specified user
 * @param {string} userId ID of the user whose profile is requested
 * @returns Success/Failure response along with associated message
 */

const getProfile = async (userId, curUser) => {
  try {
    const user = await userModel.findById(userId).exec();
    if (!user) {
      return {
        success: false,
        message: "User not found",
        statusCode: 400,
      };
    }
    const isBlocked = await checkRelation.block(user.username, curUser);
    if (isBlocked) {
      return {
        success: false,
        message: "User has blocked you",
        statusCode: 403,
      };
    }
    if (user.private_profile && !checkRelation.friend(user.username, curUser)) {
      return {
        success: false,
        message: "User has a private profile",
        statusCode: 403,
      };
    }
    await userModel.findByIdAndUpdate(userId, {
      $inc: { profile_views_monthly: 1 },
    });
    return {
      username: user.username,
      email: user.email,
      email_verfied: user.email_verified,
      city: user.city,
      organization: user.organization,
      accepting_friends: user.accepting_friends,
      followers: user.followers,
      following: user.following,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
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
      return {
        success: false,
        message: "User not found",
        statusCode: 400,
      };
    }
    if (authId != user.username) {
      return {
        success: false,
        message: "Cannot edit other user's profile",
        statusCode: 403,
      };
    }
    const updated = await userModel
      .findOneAndUpdate(
        { username: authId },
        {
          username: body.username,
          email: body.email,
          hash: bcrypt.hashSync(body.password, 10),
          city: body.city,
          organization: body.organization,
          accepting_friends: body.accepting_friends,
          notifications: body.notifications,
          private_profile: body.private_profile,
        }
      )
      .exec();
    return {
      username: body.username,
      email: body.email,
      password: body.password,
      city: body.city,
      organization: body.organization,
      accepting_friends: body.accepting_friends,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
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
      throw new Error(uploadRes.message);
    }
    const user = await userModel.findOne({ username: userId });
    if (user.profile_pic != null) {
      await deletePfp(userId);
    }
    await userModel.findOneAndUpdate(
      { username: userId },
      {
        profile_pic: uploadRes.message,
      }
    );
    return {
      success: true,
      message: "Profile picture uploaded successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

/**
 * Remove the profile picture of the logged in user
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
          profile_pic: null,
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
      statusCode: 500,
    };
  }
};

/**
 * Get metrics relating to user's account
 * @param {String} curUser Username of the logged in user
 * @returns Metrics relating to user's account
 */

const getMetrics = async (curUser) => {
  try {
    const user = await userModel.find({ username: curUser });
    let metrics = {};
    const curDate = new Date();
    const oneMonthAgo = new Date(curDate).setMonth(now.getMonth() - 1);
    const mostLiked = await postModel
      .find({ author: curUser })
      .sort({ like_count: "desc" })
      .limit(10);

    metrics.profile["Views_this_month"] = user.profile_views_monthly;
    metrics.profile["Views_this_year"] = user.profile_views_yearly;

    metrics.posts["Created_total"] = await postModel.count({ author: curUser });
    metrics.posts["Created_this_month"] = await postModel.count({
      author: curUser,
      timestamps: { createdAt: { $gte: { oneMonthAgo } } },
    });
    metrics.posts["Most_liked_posts"] = mostLiked;

    metrics.comments["Created_total"] = await commentModel.count({
      author: curUser,
    });
    metrics.comments["Created_this_month"] = await commentModel.count({
      author: curUser,
      timestamps: { createdAt: { $gte: { oneMonthAgo } } },
    });
    return {
      success: true,
      content: metrics,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      statusCode: 500,
    };
  }
};

module.exports = {
  userSearch,
  getProfile,
  editProfile,
  uploadPfp,
  deletePfp,
  getMetrics,
};
