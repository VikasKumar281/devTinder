const SupportTopic = require("../models/supportTopic");
const SupportFaq = require("../models/supportFaq");

const topics = [
  {
    icon: "♥",
    title: "Matching & Feed",
    summary: "How swipes, likes, and your developer feed work.",
    details:
      "Feed shows developers you have not already passed or connected with. Like someone to send an interested request. Pass skips that profile. Matches appear in Connections after they accept.",
    order: 1,
  },
  {
    icon: "◎",
    title: "Requests",
    summary: "Accept or pass incoming connection requests.",
    details:
      "Open Requests to review people who liked you. Accept to start chatting. Pass quietly removes the request. You can also search developers from the navbar and send a request from their profile.",
    order: 2,
  },
  {
    icon: "✉",
    title: "Chat",
    summary: "Message people you have already matched with.",
    details:
      "Chat is available only after both people connect. Messages stay in that conversation. Keep it professional and kind. If someone makes you uncomfortable, use Contact us and include their name.",
    order: 3,
  },
  {
    icon: "▣",
    title: "Profile & photo",
    summary: "Edit name, about, skills, photo, and password.",
    details:
      "Go to Profile to update email, name, age, gender, about, and skills. Upload a JPG, PNG, or WEBP photo up to 10 MB. First name needs at least 2 characters. Save profile to store changes in the database.",
    order: 4,
  },
  {
    icon: "✦",
    title: "Safety",
    summary: "Stay safe while meeting developers online.",
    details:
      "Never share passwords, OTP codes, or payment details. Meet in public if you go offline. Report harassment through Contact us. We store every report so the team can review it.",
    order: 5,
  },
  {
    icon: "⚙",
    title: "Account & login",
    summary: "Sign in, sessions, and account trouble.",
    details:
      "Use the email and password you signed up with. Sessions last about 7 days. If login fails, check caps lock and email spelling. For a stuck session, log out and sign in again. Contact us if you still cannot get in.",
    order: 6,
  },
];

const faqs = [
  {
    category: "Account",
    question: "How do I create a DevTinder account?",
    answer:
      "Open Sign up on the home page. Enter your first name (at least 2 characters), last name, email, and a strong password. A strong password needs 8 or more characters, one uppercase letter, one lowercase letter, one number, and one symbol. After signup you land on Feed so you can start matching immediately. Your profile is stored in MongoDB and you can finish details later under Profile.",
    order: 1,
  },
  {
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "DevTinder currently updates passwords from Profile while you are signed in: enter your current password and a new strong password. If you cannot sign in at all, open Contact us, choose Account & login, and tell us the email on the account. The team reads every stored message and can help you reset access. Do not share your password in the form.",
    order: 2,
  },
  {
    category: "Matching",
    question: "How do likes, passes, and requests work?",
    answer:
      "On Feed you see one developer at a time. Heart / Like sends an interested request. X / Pass skips them and they will not show again in this cycle. The other person gets your request in their Requests inbox. If they Accept, you both appear in Connections and can chat. If they Pass, the request is closed and they will not be notified further.",
    order: 3,
  },
  {
    category: "Matching",
    question: "Why is my feed empty?",
    answer:
      "Feed is empty when there are no new developers left to show: you already liked or passed everyone, or there are no other users yet. Try again later after new people join. You can also search developers from the navbar if you know a name. Completing your own profile (photo, about, skills) helps others find and like you, which grows your Connections instead of only relying on Feed.",
    order: 4,
  },
  {
    category: "Profile",
    question: "How do I change my photo, skills, or about section?",
    answer:
      "Open Profile from the avatar menu. Choose a JPG, PNG, or WEBP image up to 10 MB. Write a short About, add skills separated by commas (for example React, Node.js, MongoDB), then press Save profile. Changes are validated and stored on the server. First name must be at least 2 characters. Empty photo fields are ignored so your previous photo stays until you upload a new one.",
    order: 5,
  },
  {
    category: "Chat",
    question: "When can I start a chat?",
    answer:
      "Chat unlocks only after a two-way match: you sent interested and they accepted, or they sent interested and you accepted. Open Connections and tap Chat on that person. Messages are delivered in real time and saved to that conversation. You cannot message people you have only passed or who have not accepted yet. Keep chats respectful; abuse can be reported via Contact us.",
    order: 6,
  },
  {
    category: "Safety",
    question: "How do I report someone or stay safe?",
    answer:
      "If a user is rude, spammy, or asks for money, do not continue the chat. Open Contact us, pick Safety, include their name or profile details, and describe what happened. Reports are stored in the database with your email so we can follow up. Never send OTPs, bank details, or remote-access links. For in-person meetups, choose a public place and tell a friend where you are going.",
    order: 7,
  },
  {
    category: "Technical",
    question: "The app is loading slowly or showing an error after deploy.",
    answer:
      "The API runs on a free host, so the first request after idle time can take a few seconds. Wait on the loading animation, then retry. If profile save fails, check the red error: names that are too short or an invalid photo URL are rejected. Use JPG/PNG/WEBP uploads or a valid https image link. If cookies fail on a custom domain, make sure you are on the official DevTinder site and not a blocked browser mode.",
    order: 8,
  },
  {
    category: "Language",
    question: "How do I change the language?",
    answer:
      "Use the globe in the navbar. Search any language and tap its native name. Your choice is saved in the browser so it stays after refresh. Support and Contact labels follow the selected language. Hindi and English also update more of the page text. Language preference is local to your device; it does not change other users’ view.",
    order: 9,
  },
];

const seedSupport = async () => {
  for (const topic of topics) {
    await SupportTopic.findOneAndUpdate(
      { title: topic.title },
      topic,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  for (const faq of faqs) {
    await SupportFaq.findOneAndUpdate(
      { question: faq.question },
      faq,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};

module.exports = { seedSupport };
