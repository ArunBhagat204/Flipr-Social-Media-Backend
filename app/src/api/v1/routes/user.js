const express = require("express");
const authorization = require("../middlewares/authorization");
const search = require("../middlewares/search");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/email_verify", authController.email_verify);

router.post("/logout", authorization, authController.logout);
router.post("/forgot_password", authController.forgotPassword);
router.post("/delete_account", authorization, userController.deleteAccount);

router.get("/", authorization, search, userController.userSearch);
router.get("/:id", authorization, userController.getProfile);
router.put("/:id", authorization, userController.editProfile);

module.exports = router;
