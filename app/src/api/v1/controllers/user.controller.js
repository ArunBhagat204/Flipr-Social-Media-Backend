const accountServices = require("../services/account.service");
const profileServices = require("../services/profile.service");
const postService = require("../services/post.service");
const errorHandler = require("../helpers/error_handler");

const userSearch = async (req, res) => {
  const result = await profileServices.userSearch(req.userId, req.body.queries);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const getFeed = async (req, res) => {
  const result = await postService.getFeed(req.userId, req.query.page);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.status(200).json({
      success: true,
      posts: result.content,
    });
  }
};

const getMetrics = async (req, res) => {
  const result = await profileServices.getMetrics(req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.status(200).json({
      success: true,
      metrics: result.content,
    });
  }
};

const getProfile = async (req, res) => {
  const result = await profileServices.getProfile(req.params.id, req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const editProfile = async (req, res) => {
  const result = await profileServices.editProfile(
    req.params.id,
    req.body,
    req.userId
  );
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const uploadPfp = async (req, res) => {
  const result = await profileServices.uploadPfp(req.file, req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const deletePfp = async (req, res) => {
  const result = await profileServices.deletePfp(req.userId);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
  }
};

const deleteAccount = async (req, res) => {
  const result = await accountServices.deleteAccount(
    req.userId,
    req.body.password
  );
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    return res.clearCookie("login_token").status(200).json(result);
  }
};

module.exports = {
  deleteAccount,
  getProfile,
  editProfile,
  userSearch,
  getFeed,
  getMetrics,
  uploadPfp,
  deletePfp,
};
