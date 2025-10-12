import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, piWalletAddress, password } = req.body;
    if (!fullName || !piWalletAddress || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    const existing = await User.findOne({ piWalletAddress });
    if (existing) return res.status(400).json({ success: false, message: "Wallet address already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, piWalletAddress, password: hashed });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { piWalletAddress, password } = req.body;
    if (!piWalletAddress || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    const user = await User.findOne({ piWalletAddress });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
