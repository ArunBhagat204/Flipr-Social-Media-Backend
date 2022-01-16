const express = require("express");
const authorization = require("../middlewares/authorization");
const search = require("../middlewares/search");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const friendRoutes = require("../routes/friend.routes");
const { validate } = require("express-validation");
const userValidations = require("../validations/user.validation");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post(
  "/signup",
  validate(userValidations.createAccount, {
    keyByField: true,
  }),
  authController.signup
);
router.get("/email_verify", authController.email_verify);

router.post("/logout", authorization, authController.logout);
router.post(
  "/forgot_password",
  validate(userValidations.forgotPassword, {
    keyByField: true,
  }),
  authController.forgotPassword
);
router.post(
  "/delete_account",
  validate(userValidations.forgotPassword, {
    keyByField: true,
  }),
  authorization,
  userController.deleteAccount
);

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
router.put(
  "/:id",
  validate(userValidations.editProfile, {
    keyByField: true,
  }),
  authorization,
  userController.editProfile
);

module.exports = router;
