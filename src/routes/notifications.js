const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Notification = require("../models/notification");
const ConnectionRequest = require("../models/connectionRequest");

const notificationsRouter = express.Router();

notificationsRouter.get("/notifications", userAuth, async (req, res) => {
  try {
    const items = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(40)
      .populate("fromUserId", "firstName lastName photoUrl");

    const pending = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl");

    const storedFrom = new Set(
      items
        .filter((item) => item.type === "request" && item.fromUserId)
        .map((item) => String(item.fromUserId._id || item.fromUserId))
    );

    const liveRequests = pending
      .filter((row) => row.fromUserId && !storedFrom.has(String(row.fromUserId._id)))
      .map((row) => ({
        _id: "req-" + row._id,
        type: "request",
        title: (row.fromUserId.firstName || "Someone") + " sent you a request",
        body: "Open Requests to accept or pass.",
        link: "/requests",
        photoUrl: row.fromUserId.photoUrl || "",
        fromUserId: row.fromUserId,
        read: false,
        createdAt: row.createdAt,
      }));

    const data = [...liveRequests, ...items].slice(0, 40);
    const unread = data.filter((item) => !item.read).length;
    res.json({
      data,
      unread,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

notificationsRouter.post("/notifications/read", userAuth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
    const filter = { userId: req.user._id, read: false };
    if (ids?.length) filter._id = { $in: ids };
    await Notification.updateMany(filter, { $set: { read: true } });
    res.json({ message: "ok" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = notificationsRouter;
