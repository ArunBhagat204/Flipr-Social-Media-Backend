const mongoose = require("mongoose");
const cron = require("node-cron");

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
    likes_this_month: {
      type: Number,
      required: true,
      default: 0,
    },
    view_count: {
      type: Number,
      required: true,
      default: 0,
    },
    views_this_month: {
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

try {
  cron.schedule(
    "0 0 0 1 * *",
    async () => {
      await post.updateMany({}, { views_this_month: 0, likes_this_month: 0 });
    },
    {
      scheduled: true,
    }
  );
} catch (err) {
  console.log(`[TASK SCHEDULING ERROR]: ${err.message}`);
}

module.exports = post;
