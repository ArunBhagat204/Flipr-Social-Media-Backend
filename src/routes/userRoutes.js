const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", (req, res) => {
  const result = authController.signup(req.body);
  res.status(result.success === false ? 403 : 200).json(result);
});

router.get("/email_verify", (req, res) => {
  const result = authController.email_verify(req.query.token);
  res.status(result.status).send(`<h4>${result.message}</h4>`);
});

router.post("/login", (req, res) => {
  const result = authController.login(req.body);
  res
    .cookie("login_token", result.token, {
      httpOnly: true,
    })
    .status(result.success === false ? 403 : 200)
    .json(result);
});

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
