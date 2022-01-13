const accountServices = require("../services/account.service");
const profileServices = require("../services/profile.service");

const userSearch = async (req, res) => {
  const result = await profileServices.userSearch(
    req.body.userQuery,
    req.body.emailQuery
  );
  res.status(result.success === false ? 403 : 200).json(result.users);
};

const getProfile = async (req, res) => {
  const result = await profileServices.getProfile(req.params.id);
  return res.status(res.success === false ? 403 : 200).json(result);
};

const editProfile = async (req, res) => {
  const result = await profileServices.editProfile(
    req.params.id,
    req.body,
    req.userId
  );
  return res.status(res.success === false ? 403 : 200).json(result);
};

const uploadPfp = async (req, res) => {
  const result = await profileServices.uploadPfp(req.file, req.userId);
  return res.status(res.success === false ? 403 : 200).json(result);
};

const deletePfp = async (req, res) => {
  const result = await profileServices.deletePfp(req.userId);
  return res.status(res.success === false ? 403 : 200).json(result);
};

const deleteAccount = async (req, res) => {
  const result = await accountServices.deleteAccount(
    req.userId,
    req.body.password
  );
  if (result.success === false) {
    return res.status(403).json(result);
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
