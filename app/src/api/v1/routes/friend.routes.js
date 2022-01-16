const express = require("express");
const authorization = require("../middlewares/authorization");
const friendController = require("../controllers/friend.controller");
const { validate } = require("express-validation");
const actionValidations = require("../validations/action.validation");

const router = express.Router();

router.get("/requests", authorization, friendController.getRequests);
router.post(
  "/requests",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.acceptRequest
);
router.delete(
  "/requests",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.deleteRequest
);

router.post(
  "/block",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.blockUser
);
router.delete(
  "/block",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.unblockUser
);

router.get("/follow", authorization, friendController.getFollowers);
router.post(
  "/follow",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.followUser
);
router.delete(
  "/follow",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.unfollowUser
);

router.get("/suggest", authorization, friendController.suggestFriends);

router.get("/", authorization, friendController.getFriends);
router.post(
  "/",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.sendRequest
);
router.delete(
  "/",
  validate(actionValidations.interact, {
    keyByField: true,
  }),
  authorization,
  friendController.removeFriend
);

module.exports = router;
