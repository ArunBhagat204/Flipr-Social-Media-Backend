const accountServices = require("../services/account.service");
const profileServices = require("../services/profile.service");
const errorHandler = require("../helpers/error_handler");

const userSearch = async (req, res) => {
  const result = await profileServices.userSearch(req.userId, req.body.queries);
  if (result.success === false) {
    errorHandler(new Error(result.message), res, result.statusCode);
  } else {
    res.status(200).json(result);
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
  uploadPfp,
  deletePfp,
};
