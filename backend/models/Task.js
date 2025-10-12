import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  reward: { type: Number, required: true }, // in Pi
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "open" }, // open / in-progress / completed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Task", taskSchema);
