import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  piWalletAddress: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // user / company / admin
  kycStatus: { type: String, default: "pending" }, // pending / verified / manual
  balance: { type: Number, default: 0 }, // Pi balance (platform)
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
