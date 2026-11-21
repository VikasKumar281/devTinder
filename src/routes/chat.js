const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/notifications", userAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      "messages.0": { $exists: true },
    }).populate("participants", "firstName lastName photoUrl");

    const data = chats
      .map((chat) => {
        const last = chat.messages[chat.messages.length - 1];
        if (!last || String(last.senderId) === String(req.user._id)) return null;
        const other = chat.participants.find(
          (person) => String(person._id) !== String(req.user._id)
        );
        return {
          userId: other?._id,
          firstName: other?.firstName,
          lastName: other?.lastName,
          photoUrl: other?.photoUrl,
          text: last.text,
        };
      })
      .filter(Boolean)
      .slice(0, 8);

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

chatRouter.get('/chat/:targetUserId',userAuth , async(req, res) => {
    const { targetUserId } = req.params;

    const userId = req.user._id;

    try{
      let chat = await Chat.findOne({
        participants: { $all: [userId , targetUserId] },
      }).populate({
         path: "messages.senderId",
         select: "firstName lastName",
      });
      if(!chat){
        chat = new Chat({
            participants: [ userId , targetUserId],
            messages: [],
        })
        await chat.save();
      }
      res.json(chat);
    }
    catch(err) {
        console.log(err);
    }
})

module.exports = chatRouter;