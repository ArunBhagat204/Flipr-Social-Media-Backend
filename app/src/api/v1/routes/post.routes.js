const express = require("express");
const search = require("../middlewares/search");
const authorization = require("../middlewares/authorization");
const postController = require("../controllers/post.controller");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.get("/", authorization, search.postSearch, postController.searchPosts);
router.get("/:id", authorization, postController.getPost);

router.post(
  "/",
  authorization,
  upload.single("image"),
  postController.createPost
);
router.put(
  "/:id",
  authorization,
  upload.single("image"),
  postController.editPost
);
router.delete("/:id", authorization, postController.deletePost);

router.get("/like/:id", authorization, postController.likePost);
router.get("/unlike/:id", authorization, postController.unlikePost);

module.exports = router;
