const axios = require("axios");
const nodemailer = require("nodemailer");

const ADMIN_EMAIL = (
  process.env.MAIL_TO ||
  process.env.CONTACT_EMAIL ||
  "vikaskumar280204@gmail.com"
).trim();

const SITE = (process.env.CLIENT_URL || "https://dev-tinder-web-gules.vercel.app").replace(/\/$/, "");

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const layout = ({ title, intro, body, button, note }) => `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;">
        <tr><td style="padding:28px 32px 8px;">
          <p style="margin:0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">DevTinder</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;font-weight:650;">${title}</h1>
        </td></tr>
        <tr><td style="padding:8px 32px 24px;font-size:15px;line-height:1.6;color:#3f3f46;">
          <p style="margin:0 0 16px;">${intro}</p>
          ${body || ""}
          ${
            button
              ? `<p style="margin:24px 0;"><a href="${button.href}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;">${button.label}</a></p>
                 <p style="margin:0;font-size:12px;line-height:1.5;color:#71717a;word-break:break-all;">If the button does not open, paste this link into your browser:<br>${button.href}</p>`
              : ""
          }
          ${note ? `<p style="margin:20px 0 0;font-size:13px;color:#71717a;">${note}</p>` : ""}
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">This message was sent by DevTinder.</p>
    </td></tr>
  </table>
</body>
</html>`;

const smtpReady = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const sendSmtp = async ({ to, subject, text, html }) => {
  const user = process.env.SMTP_USER.trim();
  const pass = process.env.SMTP_PASS.replace(/\s/g, "");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_PORT || 465) !== "587",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || `DevTinder <${user}>`,
    to,
    replyTo: ADMIN_EMAIL,
    subject,
    text,
    html,
  });
};

const sendViaFormSubmit = async (to, fields) => {
  const response = await axios.post(
    "https://formsubmit.co/ajax/" + encodeURIComponent(to),
    { ...fields, _captcha: "false", _template: "box" },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: SITE,
        Referer: SITE + "/",
      },
      timeout: 12000,
      validateStatus: () => true,
    }
  );
  const body = response.data || {};
  if (response.status >= 400 || String(body.success) === "false") {
    throw new Error(body.message || "Could not send email");
  }
};

const deliver = async ({ to, subject, text, html, fields }) => {
  if (smtpReady()) {
    await sendSmtp({ to, subject, text, html });
    return;
  }
  await sendViaFormSubmit(to, { ...fields, _subject: subject });
};

const sendContactEmails = async ({ name, email, topic, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeTopic = escapeHtml(topic);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const jobs = [
    deliver({
      to: ADMIN_EMAIL,
      subject: `New message: ${topic}`,
      text: `${name} (${email}) wrote about ${topic}:\n\n${message}`,
      html: layout({
        title: "New contact message",
        intro: "Someone sent a message from the DevTinder contact page.",
        body: `<p style="margin:0 0 8px;"><strong>${safeName}</strong> · ${safeEmail}</p>
               <p style="margin:0 0 12px;color:#71717a;">${safeTopic}</p>
               <p style="margin:0;padding:14px 16px;background:#fafafa;border-radius:10px;">${safeMessage}</p>`,
      }),
      fields: { name, email, topic, message },
    }),
  ];

  if (email && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    jobs.push(
      deliver({
        to: email,
        subject: "We received your message",
        text: `Hi ${name}, we received your message about ${topic} and will reply to ${email}.`,
        html: layout({
          title: "We received your message",
          intro: `Hi ${safeName}, thanks for writing to DevTinder. We have your note and will reply at this address.`,
          body: `<p style="margin:0;padding:14px 16px;background:#fafafa;border-radius:10px;">${safeMessage}</p>`,
          note: "You can reply to this email if you need to add anything.",
        }),
        fields: { name, email, topic, message },
      })
    );
  }

  const results = await Promise.allSettled(jobs);
  if (!results.some((item) => item.status === "fulfilled")) {
    const reason = results.find((item) => item.status === "rejected")?.reason;
    throw new Error(reason?.message || "Could not send email");
  }
  return true;
};

const sendResetEmail = async ({ email, link }) => {
  await deliver({
    to: email,
    subject: "Reset your DevTinder password",
    text: `Reset your DevTinder password using this link. It expires in 30 minutes.\n\n${link}\n\nIf you did not ask for this, you can ignore this email.`,
    html: layout({
      title: "Reset your password",
      intro: "Use the button below to choose a new password. This link expires in 30 minutes.",
      button: { href: link, label: "Choose a new password" },
      note: "If you did not ask for a reset, you can ignore this email. Your password will stay the same.",
    }),
    fields: {
      email,
      message: `Reset your DevTinder password (valid for 30 minutes): ${link}`,
    },
  });
};

module.exports = { sendContactEmails, sendResetEmail, ADMIN_EMAIL };
