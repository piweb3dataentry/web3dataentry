import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Add task (company)
router.post("/add", async (req, res) => {
  try {
    const { title, description, reward, createdBy } = req.body;
    if (!title || !reward) return res.status(400).json({ success: false, message: "Missing fields" });

    const t = await Task.create({ title, description, reward, createdBy });
    res.json({ success: true, task: t });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all open tasks
router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" }).populate("createdBy", "fullName piWalletAddress");
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Complete task (simulate instant payout to user's platform balance)
router.post("/complete/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    if (task.status === "completed") return res.status(400).json({ success: false, message: "Already completed" });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    task.status = "completed";
    task.assignedTo = userId;
    await task.save();

    const user = await User.findById(userId);
    user.balance += task.reward;
    await user.save();

    await Transaction.create({ user: userId, amount: task.reward, type: "credit", description: `Reward for task ${task._id}` });

    res.json({ success: true, task, balance: user.balance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
