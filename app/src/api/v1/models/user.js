const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cron = require("node-cron");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    accepting_friends: {
      type: Boolean,
      required: true,
      default: true,
    },
    notifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    private_profile: {
      type: Boolean,
      required: true,
      default: false,
    },
    profile_views_monthly: {
      type: Number,
      required: true,
      default: 0,
    },
    profile_views_yearly: {
      type: Number,
      required: true,
      default: 0,
    },
    profile_pic: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    organization: {
      type: String,
      default: null,
    },
    blocks: [
      {
        type: String,
      },
    ],
    friends: [
      {
        type: String,
      },
    ],
    friend_requests: [
      {
        from: String,
        recievedAt: String,
      },
    ],
    following: [
      {
        type: String,
      },
    ],
    followers: [
      {
        type: String,
      },
    ],
    favourite_tags: [
      {
        tag: String,
        hits_today: Number,
        score: Number,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

userSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.hash, 10);
    this.hash = hashedPassword;
  } catch (err) {
    console.log(err.message);
  }
  next();
});

const user = mongoose.model("User", userSchema);

try {
  cron.schedule(
    "0 0 0 1 * *",
    async () => {
      await user.updateMany({}, { $set: { profile_views_monthly: 0 } });
    },
    {
      scheduled: true,
    }
  );
  cron.schedule(
    "0 0 0 1 1 *",
    async () => {
      await user.updateMany({}, { $set: { profile_views_yearly: 0 } });
    },
    {
      scheduled: true,
    }
  );
  cron.schedule(
    "0 0 0 * * *",
    async () => {
      await user.updateMany(
        {},
        {
          $set: {
            "favourite_tags.$.score":
              "favourite_tags.$.score" * 0.67 + "favourite_tags.$.hits_today",
            "favourite_tags.$.hits_today": 0,
          },
        }
      );
    },
    {
      scheduled: true,
    }
  );
} catch (err) {
  console.log(`[TASK SCHEDULING ERROR]: ${err.message}`);
}

module.exports = user;
