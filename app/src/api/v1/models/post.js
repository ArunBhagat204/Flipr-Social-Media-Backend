const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: null,
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: true,
    },
    likes: [
      {
        type: String,
      },
    ],
    like_count: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: [
      {
        type: String,
      },
    ],
    tagged_users: [
      {
        type: String,
      },
    ],
    hashtags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const post = mongoose.model("Post", postSchema);

module.exports = post;
