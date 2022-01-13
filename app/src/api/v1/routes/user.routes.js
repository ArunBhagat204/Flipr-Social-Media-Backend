const express = require("express");
const authorization = require("../middlewares/authorization");
const search = require("../middlewares/search");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const friendRoutes = require("../routes/friend.routes");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/email_verify", authController.email_verify);

router.post("/logout", authorization, authController.logout);
router.post("/forgot_password", authController.forgotPassword);
router.post("/delete_account", authorization, userController.deleteAccount);

router.post(
  "/pfp",
  authorization,
  upload.single("avatar"),
  userController.uploadPfp
);
router.delete("/pfp", authorization, userController.deletePfp);

router.use("/friends", friendRoutes);

router.get("/", authorization, search, userController.userSearch);
router.get("/:id", authorization, userController.getProfile);
router.put("/:id", authorization, userController.editProfile);

module.exports = router;
