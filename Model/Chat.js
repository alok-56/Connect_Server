const { default: mongoose } = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    SenderId: {
      type: String,
      required: true,
    },
    ReceiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("ChatModel", ChatSchema);
module.exports = { ChatModel };
