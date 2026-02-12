import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    default: "",
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["collector", "admin"],
    default: "collector",
  },

  staffId: {
    type: String,
    unique: true,
  },

  token: {
    type: String, // ✅ REQUIRED FOR STORAGE
    default: null,
  },

  active: {
    type: Boolean,
    default: true,
  },

  createdBy: {
    type: String,
    default: "system",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastLogin: {
    type: Date,
  },
});

export default mongoose.models.Staff ||
  mongoose.model("Staff", staffSchema);
