const express = require("express");
const authorization = require("../middlewares/authorization");
const emailController = require("../controllers/email");

const router = express.Router();

router.post("/send", authorization, emailController.send);

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
