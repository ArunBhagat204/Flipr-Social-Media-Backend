const userModel = require("../models/user");

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

const editProfile = async (userId, body) => {
  try {
    const user = await userModel.findById(userId).exec();
    if (!user) {
      throw new Error("User not found");
    }
    if (req.userId != user.username) {
      throw new Error("Cannot edit other user's profile");
    }
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

module.exports = { userSearch, getProfile, editProfile };
