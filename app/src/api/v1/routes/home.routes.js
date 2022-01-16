const express = require("express");
const userRoutes = require("./user.routes");
const authController = require("../controllers/auth.controller");
const errorHandler = require("../helpers/error_handler");
const { validate } = require("express-validation");
const userValidations = require("../validations/user.validation");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("Server running...");
});

router.post(
  "/login",
  validate(userValidations.login, {
    keyByField: true,
  }),
  authController.login
);

router.use("/users", userRoutes);

router.use(function (err, req, res, next) {
  errorHandler(err, res);
});

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
