const express = require("express");
const validator = require("validator");
const supportRouter = express.Router();
const SupportTopic = require("../models/supportTopic");
const SupportFaq = require("../models/supportFaq");
const ContactMessage = require("../models/contactMessage");
const { seedSupport } = require("../utils/seedSupport");
const { sendContactEmails } = require("../utils/sendMail");

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

supportRouter.get("/support/faq/:id", async (req, res) => {
  try {
    const faq = await SupportFaq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ data: faq });
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

    let emailSent = false;
    try {
      emailSent = await sendContactEmails({ name, email, topic, message });
    } catch (mailErr) {
      console.error("Contact email failed", mailErr.message);
    }

    res.status(201).json({
      message: emailSent ? "Message stored and email sent" : "Message stored",
      data: {
        _id: saved._id,
        name: saved.name,
        email: saved.email,
        topic: saved.topic,
        createdAt: saved.createdAt,
        emailSent,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = supportRouter;
