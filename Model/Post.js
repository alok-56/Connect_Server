const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    CollegeId: {
      type: String,
    },
    Image: [],
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConnectUser",
    },
    likeby: [],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    }],
    Sharecount:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", PostSchema);

module.exports = postModel;
