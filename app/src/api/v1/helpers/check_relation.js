const userModel = require("../models/user");

/**
 * Checks if a user is blocked by another user
 * @param {string} curUser
 * @param {string} targetUser
 * @returns Boolean representing the block status
 */

const block = async (curUser, targetUser) => {
  const user = await userModel.findOne({ username: curUser });
  let isBlocked = false;
  user.blocks.map((itr) => {
    if (itr === targetUser) {
      isBlocked = true;
    }
  });
  return isBlocked;
};

/**
 * Checks if a user is friend of another user
 * @param {string} curUser
 * @param {string} targetUser
 * @returns Boolean representing the friend status
 */

const friend = async (curUser, targetUser) => {
  const user = await userModel.findOne({ username: curUser });
  let isFriend = false;
  user.friends.map((itr) => {
    if (itr === targetUser) {
      isFriend = true;
    }
  });
  return isFriend;
};

module.exports = { block, friend };
