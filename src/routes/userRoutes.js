const express = require("express");
const authorization = require("../middlewares/authorization");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", (req, res) => {
  const result = authController.signup(req.body);
  res.status(result.success === false ? 403 : 200).json(result);
});

router.get("/email_verify", (req, res) => {
  const result = authController.email_verify(req.query.token);
  res.status(result.status).send(`<h4>${result.message}</h4>`);
});

router.get("/:id", authorization, async (req, res) => {
  const result = await userController.getProfile(req);
  return res.status(res.success === false ? 403 : 200).json(result);
});

router.put("/:id", authorization, async (req, res) => {
  const result = await userController.editProfile(req);
  return res.status(res.success === false ? 403 : 200).json(result);
});

router.post("/logout", authorization, (req, res) => {
  const result = authController.logout(req);
  if (result.success === false) {
    return res.status(401).json(result);
  } else {
    return res.clearCookie("login_token").status(200).json(result);
  }
});

router.post("/forgot_password", (req, res) => {
  const result = authController.forgotPassword(req);
  return res.status(result.success === false ? 401 : 200).json(result);
});

router.post("/delete_account", authorization, (req, res) => {
  const result = userController.deleteAccount(req);
  if (result.success === false) {
    return res.status(403).json(result);
  } else {
    return res.clearCookie("login_token").status(200).json(result);
  }
});

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
