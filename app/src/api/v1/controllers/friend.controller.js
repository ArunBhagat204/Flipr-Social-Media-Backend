const friendService = require("../services/friend.service");
const errorHandler = require("../helpers/error_handler");

const getFriends = async (req, res) => {
  const result = await friendService.getFriends(req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.status(200).json({
      success: true,
      user: req.userId,
      friends: result.content,
    });
  }
};

const sendRequest = async (req, res) => {
  const result = await friendService.sendRequest(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const removeFriend = async (req, res) => {
  const result = await friendService.removeFriend(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const getFollowers = async (req, res) => {
  const result = await friendService.getFollowers(req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.status(200).json({
      success: true,
      user: req.userId,
      followers: result.content.followers,
      following: result.content.following,
    });
  }
};

const followUser = async (req, res) => {
  const result = await friendService.followUser(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const unfollowUser = async (req, res) => {
  const result = await friendService.unfollowUser(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const getRequests = async (req, res) => {
  const result = await friendService.getRequests(req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.status(200).json({
      success: true,
      user: req.userId,
      friend_requests: result.content.friend_requests,
    });
  }
};

const acceptRequest = async (req, res) => {
  const result = await friendService.acceptRequest(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const deleteRequest = async (req, res) => {
  const result = await friendService.deleteRequest(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const blockUser = async (req, res) => {
  const result = await friendService.blockUser(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const unblockUser = async (req, res) => {
  const result = await friendService.unblockUser(req.userId, req.body.name);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const suggestFriends = async (req, res) => {
  const result = await friendService.suggestFriends(req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
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
