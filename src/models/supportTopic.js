const mongoose = require("mongoose");

const supportTopicSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "✦" },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportTopic", supportTopicSchema);
