import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true }, // store Pi uid
  fullName: { type: String, default: "" },
  consentLegal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
