const express = require("express");
const authorization = require("../middlewares/authorization");
const friendController = require("../controllers/friend.controller");

const router = express.Router();

router.get("/requests", authorization, friendController.getRequests);
router.post("/requests", authorization, friendController.acceptRequest);
router.delete("/requests", authorization, friendController.deleteRequest);

router.post("/block", authorization, friendController.blockUser);
router.delete("/block", authorization, friendController.unblockUser);

router.get("/follow", authorization, friendController.getFollowers);
router.post("/follow", authorization, friendController.followUser);
router.delete("/follow", authorization, friendController.unfollowUser);

router.get("/suggest", authorization, friendController.suggestFriends);

router.get("/", authorization, friendController.getFriends);
router.post("/", authorization, friendController.sendRequest);
router.delete("/", authorization, friendController.removeFriend);

module.exports = router;
