const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
    },
    Number: {
      type: Number,
      required: true,
      unique: true,
    },
    College: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdwin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    ProfileImage: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("ConnectUser", UserSchema);
module.exports = UserModel;
