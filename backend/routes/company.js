import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

// Company posts a task
router.post("/post-task", async (req, res) => {
  try {
    const { title, description, reward, createdBy } = req.body;
    if (!title || !reward) return res.status(400).json({ success: false, message: "Missing fields" });
    const task = await Task.create({ title, description, reward, createdBy });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Company top-up platform balance (placeholder)
router.post("/topup", async (req, res) => {
  // implement actual topup logic as needed (transfer tokens to platform wallet)
  res.json({ success: true, message: "Topup endpoint placeholder" });
});

export default router;
