// server.js
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());

// ===== Environment Variables =====
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/web3dataentry';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const PI_API_BASE = process.env.PI_API_BASE || 'https://api.minepi.com/v2';

// ===== MongoDB User Schema =====
const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  username: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ===== Connect MongoDB =====
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ===== Pi Access Token Verification Route =====
app.post('/auth/pi-verify', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'accessToken required' });

    // Call Pi API /me endpoint
    const headers = { headers: { Authorization: `Bearer ${accessToken}` } };
    const resp = await axios.get(`${PI_API_BASE}/me`, headers);

    const userDTO = resp.data?.user;
    if (!userDTO?.uid) return res.status(401).json({ error: 'invalid token' });

    // Find or create user in DB
    let user = await User.findOne({ uid: userDTO.uid });
    if (!user) {
      user = await User.create({ uid: userDTO.uid, username: userDTO.username || '' });
    }

    // Issue JWT for session
    const token = jwt.sign({ uid: user.uid, id: user._id }, JWT_SECRET, { expiresIn: '6h' });

    return res.json({ token, user: { uid: user.uid, username: user.username } });

  } catch (err) {
    console.error('verify error', err?.response?.data || err.message);
    if (err?.response?.status === 401) return res.status(401).json({ error: 'invalid access token' });
    return res.status(500).json({ error: 'server error' });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
