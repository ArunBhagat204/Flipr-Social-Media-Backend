const userModel = require("../models/user");

/**
 * Checks if a user is blocked by another user
 * @param {string} curUser
 * @param {string} targetUser
 * @returns Boolean representing the block status
 */

const checkBlock = async (curUser, targetUser) => {
  const user = await userModel.findOne({ username: curUser });
  let isBlocked = false;
  user.blocks.map((itr) => {
    if (itr === targetUser) {
      isBlocked = true;
    }
  });
  return isBlocked;
};

module.exports = checkBlock;
