import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // credit / debit
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);
