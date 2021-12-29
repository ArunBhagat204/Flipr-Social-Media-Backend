const express = require("express");
const userRoutes = require("./userRoutes");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("<h2>Server running...<h2>");
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

router.use("/users", userRoutes);

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
