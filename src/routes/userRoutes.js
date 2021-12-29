const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", (req, res) => {
  res.json(userController.signup(req.body));
});

router.get("/email_verify", (req, res) => {
  res.send(userController.email_verify(req.query.token));
});

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
