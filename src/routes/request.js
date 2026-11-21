const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { createNotification } = require("../utils/notify");


requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      if (status === "interested") {
        await createNotification({
          userId: toUserId,
          fromUserId: fromUserId,
          type: "request",
          title: req.user.firstName + " sent you a request",
          body: "Open Requests to accept or pass.",
          link: "/requests",
          photoUrl: req.user.photoUrl || "",
        });
      }

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      if (status === "accepted") {
        const fromUser = await User.findById(connectionRequest.fromUserId);
        await createNotification({
          userId: connectionRequest.fromUserId,
          fromUserId: loggedInUser._id,
          type: "match",
          title: "It's a match with " + loggedInUser.firstName,
          body: "You can start chatting now.",
          link: "/chat/" + loggedInUser._id,
          photoUrl: loggedInUser.photoUrl || "",
        });
        await createNotification({
          userId: loggedInUser._id,
          fromUserId: connectionRequest.fromUserId,
          type: "match",
          title: "It's a match with " + (fromUser?.firstName || "a developer"),
          body: "You can start chatting now.",
          link: "/chat/" + connectionRequest.fromUserId,
          photoUrl: fromUser?.photoUrl || "",
        });
      }

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;