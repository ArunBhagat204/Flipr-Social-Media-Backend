const express = require("express");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("<h2>Server running...<h2>");
});

router.use("/users", userRoutes);

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
