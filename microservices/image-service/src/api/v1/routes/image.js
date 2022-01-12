const express = require("express");
const authorization = require("../middlewares/authorization");
const imageController = require("../controllers/image");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post(
  "/",
  authorization,
  upload.single("avatar"),
  imageController.uploadImage
);
router.delete("/", authorization, imageController.deleteImage);

module.exports = router;
