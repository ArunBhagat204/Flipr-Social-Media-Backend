const express = require("express");
const search = require("../middlewares/search");
const authorization = require("../middlewares/authorization");
const postController = require("../controllers/post.controller");

const { validate } = require("express-validation");
const actionValidations = require("../validations/action.validation");
const postValidations = require("../validations/post.validation");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.get(
  "/",
  validate(postValidations.postSearch, {
    keyByField: true,
  }),
  authorization,
  search.postSearch,
  postController.searchPosts
);
router.get(
  "/:id",
  validate(actionValidations.postInteract, {
    keyByField: true,
  }),
  authorization,
  postController.getPost
);

router.post(
  "/",
  authorization,
  upload.single("image"),
  validate(postValidations.createPost, {
    keyByField: true,
  }),
  postController.createPost
);
router.put(
  "/:id",
  authorization,
  upload.single("image"),
  validate(postValidations.editPost, {
    keyByField: true,
  }),
  postController.editPost
);
router.delete(
  "/:id",
  validate(actionValidations.postInteract, {
    keyByField: true,
  }),
  authorization,
  postController.deletePost
);

router.get(
  "/like/:id",
  validate(actionValidations.postInteract, {
    keyByField: true,
  }),
  authorization,
  postController.likePost
);
router.get(
  "/unlike/:id",
  validate(actionValidations.postInteract, {
    keyByField: true,
  }),
  authorization,
  postController.unlikePost
);

module.exports = router;
