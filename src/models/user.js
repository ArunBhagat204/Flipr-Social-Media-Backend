const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

userSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.hash, 10);
    this.hash = hashedPassword;
    console.log("[UserModel]: Password hashed");
  } catch (err) {
    console.log(err.message);
  }
  next();
});

userSchema.post("save", async function (next) {
  console.log("[UserModel] : Account saved");
});

const user = mongoose.model("User", userSchema);

module.exports = user;
