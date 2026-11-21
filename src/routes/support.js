const express = require("express");
const validator = require("validator");
const supportRouter = express.Router();
const SupportTopic = require("../models/supportTopic");
const SupportFaq = require("../models/supportFaq");
const ContactMessage = require("../models/contactMessage");
const { seedSupport } = require("../utils/seedSupport");

supportRouter.get("/support/content", async (req, res) => {
  try {
    await seedSupport();
    const [topics, faqs] = await Promise.all([
      SupportTopic.find().sort({ order: 1 }),
      SupportFaq.find().sort({ order: 1 }),
    ]);
    res.json({ data: { topics, faqs } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

supportRouter.post("/support/contact", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const topic = String(req.body.topic || "General").trim();
    const message = String(req.body.message || "").trim();

    if (name.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    if (message.length < 10) {
      throw new Error("Message must be at least 10 characters");
    }

    const saved = await ContactMessage.create({ name, email, topic, message });
    res.status(201).json({
      message: "Message stored",
      data: {
        _id: saved._id,
        name: saved.name,
        email: saved.email,
        topic: saved.topic,
        createdAt: saved.createdAt,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = supportRouter;
