const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    creator: {
      id: String,
      name: String
    },

    participant: {
      id: String,
      name: String,
      url: String
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
