const axios = require("axios");

const ADMIN_EMAIL = (
  process.env.MAIL_TO ||
  process.env.CONTACT_EMAIL ||
  "vikaskumar280204@gmail.com"
).trim();

const sendViaFormSubmit = async (to, fields) => {
  await axios.post(
    "https://formsubmit.co/ajax/" + encodeURIComponent(to),
    {
      ...fields,
      _captcha: "false",
      _template: "table",
    },
    {
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      timeout: 12000,
    }
  );
};

const sendContactEmails = async ({ name, email, topic, message }) => {
  const fields = {
    name,
    email,
    topic,
    message,
  };

  const jobs = [
    sendViaFormSubmit(ADMIN_EMAIL, {
      ...fields,
      _subject: `DevTinder contact: ${topic}`,
    }),
  ];

  if (email && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    jobs.push(
      sendViaFormSubmit(email, {
        ...fields,
        _subject: "DevTinder received your message",
      })
    );
  }

  const results = await Promise.allSettled(jobs);
  const sent = results.some((item) => item.status === "fulfilled");
  if (!sent) {
    const reason = results.find((item) => item.status === "rejected")?.reason;
    throw new Error(reason?.message || "Could not send email");
  }
  return sent;
};

const sendResetEmail = async ({ email, link }) => {
  await sendViaFormSubmit(email, {
    email,
    message: "Reset your DevTinder password using this link (valid for 30 minutes): " + link,
    _subject: "Reset your DevTinder password",
  });
};

module.exports = { sendContactEmails, sendResetEmail, ADMIN_EMAIL };
