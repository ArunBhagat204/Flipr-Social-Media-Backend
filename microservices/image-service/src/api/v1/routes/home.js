const express = require("express");
const imageRoutes = require("./image");

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("Server running...");
});

router.use("/image", imageRoutes);

router.get("*", (req, res) => {
  res.status(404).send("<h2>Page not found!<h2>");
});

module.exports = router;
