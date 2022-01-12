const express = require("express");
const authorization = require("../middlewares/authorization");
const emailController = require("../controllers/email.controller");

const router = express.Router();

router.post("/send", authorization, emailController.send);

module.exports = router;
