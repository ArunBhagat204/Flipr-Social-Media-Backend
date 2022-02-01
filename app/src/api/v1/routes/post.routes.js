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
  validate(actionValidations.contentInteract, {
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
  validate(actionValidations.contentInteract, {
    keyByField: true,
  }),
  authorization,
  postController.deletePost
);

router.get(
  "/like/:id",
  validate(actionValidations.contentInteract, {
    keyByField: true,
  }),
  authorization,
  postController.likePost
);
router.get(
  "/unlike/:id",
  validate(actionValidations.contentInteract, {
    keyByField: true,
  }),
  authorization,
  postController.unlikePost
);

router.get(
  "/comments",
  validate(postValidations.fetchComments, {
    keyByField: true,
  }),
  authorization,
  search.commentSearch,
  postController.fetchComments
);
router.get(
  "/comments/:id",
  validate(actionValidations.contentInteract, {
    keyByField: true,
  }),
  authorization,
  postController.getComment
);

router.post(
  "/comments/:id",
  authorization,
  validate(postValidations.createComment, {
    keyByField: true,
  }),
  postController.createComment
);
router.put(
  "/comments/:id",
  authorization,
  validate(postValidations.editComment, {
    keyByField: true,
  }),
  postController.editComment
);
router.delete(
  "/comments/:id",
  validate(actionValidations.contentInteract, {
    keyByField: true,
  }),
  authorization,
  postController.deleteComment
);

router.get("/engagement", authorization, postController.getEngagement);

module.exports = router;
