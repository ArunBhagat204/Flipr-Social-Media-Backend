const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    profile_pic: {
      type: String,
      required: true,
      default: "NaN",
    },
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

module.exports = user;
