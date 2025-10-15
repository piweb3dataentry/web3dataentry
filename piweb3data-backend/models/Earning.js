import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  piAmount: { type: Number, required: true },
  usdAmount: { type: Number, required: true },
  inrAmount: { type: Number, required: true },
  note: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Earning", earningSchema);
