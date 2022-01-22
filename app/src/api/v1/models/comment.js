const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    parent: {
      parent_id: String,
      isReply: Boolean,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const comment = mongoose.model("Comment", commentSchema);

module.exports = comment;
