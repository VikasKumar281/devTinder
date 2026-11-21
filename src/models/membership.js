const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["pulse", "aura", "orbit"],
      required: true,
    },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "inr" },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripeSessionId: String,
    status: {
      type: String,
      enum: ["active", "canceled"],
      default: "active",
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
