const mongoose = require("mongoose");
const validator = require("validator");

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minLength: 2, maxLength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    topic: { type: String, trim: true, default: "General" },
    message: { type: String, required: true, trim: true, minLength: 10, maxLength: 2000 },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
