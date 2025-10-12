import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// simple in-project auth middleware by token (optional, simplified)
import jwt from "jsonwebtoken";
const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: "Missing token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.userId = decoded.id;
    next();
  } catch (e) { return res.status(401).json({ success: false, message: "Invalid token" }); }
};

// Get profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
});

// KYC upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "backend/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload KYC doc
router.post("/upload-kyc", auth, upload.single("doc"), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    // save path or mark pending
    user.kycStatus = "under_review";
    await user.save();
    res.json({ success: true, message: "KYC uploaded" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Request withdraw (convert USD to Pi and create pending transaction)
router.post("/request-withdraw", auth, async (req, res) => {
  try {
    const { usdAmount } = req.body;
    if (!usdAmount) return res.status(400).json({ success: false, message: "Missing amount" });
    if (usdAmount < 10) return res.status(400).json({ success: false, message: "Minimum withdraw $10" });

    // For demo: convert USD->Pi using fixed rate or algorithm
    // Example: 1 Pi = $314,159 (as per your earlier note) — but that's unrealistic.
    // We'll use a configurable conversion: here assume 1 Pi = $1 for simplicity.
    const USD_PER_PI = parseFloat(process.env.USD_PER_PI || "1"); // set in .env if needed
    const piAmount = usdAmount / USD_PER_PI;

    // Create transaction record (pending)
    const tx = await Transaction.create({ user: req.userId, amount: piAmount, type: "debit", description: `Withdraw request ${usdAmount}$ -> ${piAmount} Pi` });

    // In production: call payment util to process chain transfer
    res.json({ success: true, message: "Withdraw request created", piAmount, tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
