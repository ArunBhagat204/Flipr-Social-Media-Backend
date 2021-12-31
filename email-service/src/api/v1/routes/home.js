const express = require("express");
const emailRoutes = require("./email");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("Server running...");
});

router.use("/email", emailRoutes);

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
