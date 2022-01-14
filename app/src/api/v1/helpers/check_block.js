const userModel = require("../models/user");

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
