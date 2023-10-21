const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    repliedMessage: [
      {
        userId: String,
        message: String,
      },
    ],
  },
  { timestamps: true }
);

const commentmodel = mongoose.model("comment", CommentSchema);
module.exports = commentmodel;
