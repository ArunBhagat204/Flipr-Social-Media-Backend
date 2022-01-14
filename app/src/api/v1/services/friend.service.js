const userModel = require("../models/user");
const checkBlock = require("../helpers/check_block");

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
    };
  }
};

const sendRequest = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkBlock(targetUser, curUser);
    if (isBlocked) {
      throw new Error("User has blocked you");
    }
    const newRequest = {
      from: curUser,
      recievedAt: new Date().toLocaleString(),
    };
    const recipient = await userModel.findOne({ username: targetUser });
    if (recipient.accepting_friends === false) {
      throw new Error("User not accepting new friend requests");
    }
    recipient.friend_requests.map((fr) => {
      if (fr.from === curUser) {
        throw new Error("Request already exists");
      }
    });
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
    };
  }
};

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
      throw new Error("No such friend found");
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
    };
  }
};

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
    };
  }
};

const followUser = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkBlock(targetUser, curUser);
    if (isBlocked) {
      throw new Error("User has blocked you");
    }
    const target = await userModel.findOne({ username: targetUser });
    if (!target) {
      throw new Error("No such user exists");
    }
    const user = await userModel.findOne({ username: curUser });
    user.following.map((followed) => {
      if (followed === targetUser) {
        throw new Error("User already being followed");
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
    };
  }
};

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
      throw new Error("No such follower found");
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
    };
  }
};

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
    };
  }
};

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
      throw new Error("No such request exists");
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
    return {
      success: true,
      message: "Request accepted",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

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
      throw new Error("No such request exists");
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
    };
  }
};

const blockUser = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkBlock(curUser, targetUser);
    if (isBlocked) {
      throw new Error("User already blocked");
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
    };
  }
};

const unblockUser = async (curUser, targetUser) => {
  try {
    const isBlocked = await checkBlock(curUser, targetUser);
    if (!isBlocked) {
      throw new Error("User not blocked");
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
};
