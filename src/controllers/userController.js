const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const userSearch = async (req) => {
  try {
    let users = await userModel
      .find(
        {
          username: { $regex: req.userQuery },
          email: { $regex: req.emailQuery },
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

const getProfile = async (req) => {
  try {
    const user = await userModel.findById(req.params.id).exec();
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

const editProfile = async (req) => {
  try {
    const user = await userModel.findById(req.params.id).exec();
    if (!user) {
      throw new Error("User not found");
    }
    if (req.userId != user.username) {
      throw new Error("Cannot edit other user's profile");
    }
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
      username: req.body.username,
      email: req.body.email,
      hash: bcrypt.hashSync(req.body.password, 10),
    });
    return {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
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

module.exports = { deleteAccount, getProfile, editProfile, userSearch };
