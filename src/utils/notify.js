const Notification = require("../models/notification");

const createNotification = async (payload) => {
  if (!payload?.userId || !payload?.title) return null;
  try {
    if (payload.type === "message" && payload.fromUserId) {
      const existing = await Notification.findOne({
        userId: payload.userId,
        type: "message",
        fromUserId: payload.fromUserId,
        read: false,
      });
      if (existing) {
        existing.body = payload.body || existing.body;
        existing.photoUrl = payload.photoUrl || existing.photoUrl;
        existing.createdAt = new Date();
        await existing.save();
        return existing;
      }
    }
    return await Notification.create(payload);
  } catch (err) {
    console.error("notify failed", err.message);
    return null;
  }
};

module.exports = { createNotification };
