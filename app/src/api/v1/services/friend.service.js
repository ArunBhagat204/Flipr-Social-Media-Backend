const userModel = require("../models/user");
const emailSender = require("../helpers/email_sender");
const checkRelation = require("../helpers/check_relation");

/**
 * Fetches the friend list of a particular user
 * @param {String} curUser Username of the logged in user
 * @returns Success/Failure message along with appropriate content
 */

const getFriends = async (curUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    return {
      success: true,
      content: user.friends,
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
 * Sends a friend request to a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the target user
 * @returns Success/Failure message along with appropriate message
 */

const sendRequest = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkRelation.block(targetUser, curUser);
    if (isBlocked) {
      return {
        success: false,
        message: "User has blocked you",
        statusCode: 403,
      };
    }
    const newRequest = {
      from: curUser,
      recievedAt: new Date().toLocaleString(),
    };
    const recipient = await userModel.findOne({ username: targetUser });
    if (recipient.accepting_friends === false) {
      return {
        success: false,
        message: "User not accepting new friend requests",
        statusCode: 403,
      };
    }
    recipient.friend_requests.map((fr) => {
      if (fr.from === curUser) {
        return {
          success: false,
          message: "Request already exists",
          statusCode: 409,
        };
      }
    });
    if (recipient.notifations) {
      const mail = {
        address: recipient.email,
        subject: `New Friend Request from ${curUser}`,
        body: `Hey ${recipient.username}!<br><br>
              You have a new friend request from user ${curUser}!<br>
              View all your pending requests here: 
              http://${process.env.HOSTNAME}:${process.env.PORT}/users/friends/requests
              <br><br>
              Team Social-Media-App`,
      };
      emailSender.send(mail);
    }
    await userModel.findOneAndUpdate(
      { username: targetUser },
      { $push: { friend_requests: newRequest } }
    );
    return {
      success: true,
      message: "Request sent successfully",
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
 * Removes a user as friend
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the target user
 * @returns Success/Failure message along with appropriate message
 */

const removeFriend = async (curUser, targetUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    let exists = false;
    user.friends.map(async (fr) => {
      if (fr === targetUser) {
        exists = true;
      }
    });
    if (!exists) {
      return {
        success: false,
        message: "No such friend found",
        statusCode: 400,
      };
    }
    await userModel.findOneAndUpdate(
      { username: curUser },
      { $pull: { friends: targetUser } }
    );
    return {
      success: true,
      message: "Friend removed successfully",
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
 * Fetches the followers of the logged in user
 * @param {String} curUser Username of the logged in user
 * @returns Success/Failure message along with appropriate content
 */

const getFollowers = async (curUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    return {
      success: true,
      content: {
        followers: user.followers,
        following: user.following,
      },
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
 * Follows a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the target user
 * @returns Success/Failure message along with appropriate message
 */

const followUser = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkRelation.block(targetUser, curUser);
    if (isBlocked) {
      return {
        success: false,
        message: "User has blocked you",
        statusCode: 403,
      };
    }
    const target = await userModel.findOne({ username: targetUser });
    if (!target) {
      return {
        success: false,
        message: "No such user exists",
        statusCode: 400,
      };
    }
    const user = await userModel.findOne({ username: curUser });
    user.following.map((followed) => {
      if (followed === targetUser) {
        return {
          success: false,
          message: "User already being followed",
          statusCode: 409,
        };
      }
    });
    await userModel.findOneAndUpdate(
      { username: curUser },
      {
        $push: { following: targetUser },
      }
    );
    await userModel.findOneAndUpdate(
      { username: targetUser },
      {
        $push: { followers: curUser },
      }
    );
    return {
      success: true,
      message: "User followed successfully",
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
 * Unfollows a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the target user
 * @returns Success/Failure message along with appropriate message
 */

const unfollowUser = async (curUser, targetUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    let exists = false;
    user.following.map(async (fr) => {
      if (fr === targetUser) {
        exists = true;
      }
    });
    if (!exists) {
      return {
        success: false,
        message: "No such follower found",
        statusCode: 400,
      };
    }
    await userModel.findOneAndUpdate(
      { username: curUser },
      { $pull: { following: targetUser } }
    );
    await userModel.findOneAndUpdate(
      { username: targetUser },
      { $pull: { followers: curUser } }
    );
    return {
      success: true,
      message: "Follower removed successfully",
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
 * Fetches the friend requests of the logged in user
 * @param {String} curUser sername of the logged in user
 * @returns Success/Failure message along with appropriate content
 */

const getRequests = async (curUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    return {
      success: true,
      content: {
        friend_requests: user.friend_requests,
      },
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
 * Accepts the request of a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the target user
 * @returns Success/Failure message along with appropriate message
 */

const acceptRequest = async (curUser, targetUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    let exists = false;
    user.friend_requests.map((fr) => {
      if (fr.from === targetUser) {
        exists = true;
      }
    });
    if (!exists) {
      return {
        success: false,
        message: "No such request exists",
        statusCode: 400,
      };
    }
    await userModel.findOneAndUpdate(
      { username: curUser },
      {
        $push: {
          friends: targetUser,
          followers: targetUser,
          following: targetUser,
        },
      }
    );
    await userModel.findOneAndUpdate(
      { username: targetUser },
      { $push: { friends: curUser, followers: curUser, following: curUser } }
    );
    await userModel.findOneAndUpdate(
      { username: curUser },
      { $pull: { friend_requests: { from: targetUser } } }
    );
    const sender = await userModel.findOne({ username: targetUser });
    if (sender.notifations) {
      const mail = {
        address: sender.email,
        subject: `${curUser} accepted your friend request!`,
        body: `Hey ${sender.username}!<br><br>
              Your friend request to the user ${curUser} has been accepted!<br>
              View their profile here: 
              http://${process.env.HOSTNAME}:${process.env.PORT}/users/${user._id}
              <br><br>
              Team Social-Media-App`,
      };
      emailSender.send(mail);
    }
    return {
      success: true,
      message: "Request accepted",
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
 * Deletes the request of a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the target user
 * @returns Success/Failure message along with appropriate message
 */

const deleteRequest = async (curUser, targetUser) => {
  try {
    const user = await userModel.findOne({ username: curUser });
    let exists = false;
    user.friend_requests.map((fr) => {
      if (fr.from === targetUser) {
        exists = true;
      }
    });
    if (!exists) {
      return {
        success: false,
        message: "No such request exists",
        statusCode: 400,
      };
    }
    await userModel.findOneAndUpdate(
      { username: curUser },
      { $pull: { friend_requests: { from: targetUser } } }
    );
    return {
      success: true,
      message: "Request deleted",
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
 * Blocks a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the user to be blocked
 * @returns Success/Failure message along with appropriate message
 */

const blockUser = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkRelation.block(curUser, targetUser);
    if (isBlocked) {
      return {
        success: false,
        message: err.message,
        statusCode: 409,
      };
    }
    await removeFriend(curUser, targetUser);
    await unfollowUser(curUser, targetUser);
    await deleteRequest(curUser, targetUser);
    await removeFriend(targetUser, curUser);
    await unfollowUser(targetUser, curUser);
    await deleteRequest(targetUser, curUser);
    await userModel.findOneAndUpdate(
      { username: curUser },
      { $push: { blocks: targetUser } }
    );
    return {
      success: true,
      message: "User blocked successfully",
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
 * Unblocks a particular user
 * @param {String} curUser Username of the logged in user
 * @param {String} targetUser Username of the user to be unblocked
 * @returns Success/Failure message along with appropriate message
 */

const unblockUser = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkRelation.block(curUser, targetUser);
    if (!isBlocked) {
      return {
        success: false,
        message: "User is not blocked",
        statusCode: 400,
      };
    }
    await userModel.findOneAndUpdate(
      { username: curUser },
      { $pull: { blocks: targetUser } }
    );
    return {
      success: true,
      message: "User unblocked successfully",
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
 * Suggest list of potential friends for the user
 * @param {String} curUser Username of the logged in user
 * @returns Success/Failure message along with appropriate content
 */

const suggestFriends = async (curUser) => {
  try {
    let suggestions = [];
    const user = await userModel.findOne({ username: curUser });
    if (user.city) {
      const sameCity = await userModel
        .find({ city: user.city }, "username")
        .limit(25);
      suggestions.push(...sameCity);
    }
    if (user.organization) {
      const sameOrg = await userModel
        .find({ city: user.organization }, "username")
        .limit(25);
      suggestions.push(...sameOrg);
    }
    user.friends.map(async (itr) => {
      const userItr = await userModel.findOne({ username: itr });
      suggestions.push(...userItr.friends);
    });
    for (let i = suggestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [suggestions[i], suggestions[j]] = [suggestions[j], suggestions[i]];
    }
    suggestions.filter(async (user) => {
      const isBlocked = await checkRelation.block(user, curUser);
      return !isBlocked;
    });
    if (suggestions.length > 50) {
      suggestions.slice(0, 50);
    }
    return {
      success: true,
      content: suggestions,
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
  getFriends,
  sendRequest,
  removeFriend,
  getFollowers,
  followUser,
  unfollowUser,
  getRequests,
  acceptRequest,
  deleteRequest,
  blockUser,
  unblockUser,
  suggestFriends,
};
