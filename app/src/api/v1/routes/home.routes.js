const express = require("express");
const userRoutes = require("./user.routes");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("Server running...");
});

router.post("/login", authController.login);

router.use("/users", userRoutes);

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
