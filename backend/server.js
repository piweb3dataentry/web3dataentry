// server.js
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PI_API_BASE = process.env.PI_API_BASE || 'https://api.minepi.com/v2';

// --- simple User model (mongoose) ---
const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  username: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// connect mongo
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(e => console.error('Mongo err', e));

// Route: verify Pi access token sent from frontend
// frontend will POST { accessToken }
app.post('/auth/pi-verify', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'accessToken required' });

    // call Pi /me endpoint to verify token (Authorization: Bearer <token>)
    const headers = { headers: { Authorization: `Bearer ${accessToken}` } };
    const resp = await axios.get(`${PI_API_BASE}/me`, headers);

    // resp.data.user should contain uid and username (per docs)
    const userDTO = resp.data && resp.data.user;
    if (!userDTO || !userDTO.uid) return res.status(401).json({ error: 'invalid token' });

    // find or create user in DB
    let user = await User.findOne({ uid: userDTO.uid });
    if (!user) {
      user = await User.create({ uid: userDTO.uid, username: userDTO.username || '' });
    }

    // issue our own JWT for session (short expiry example)
    const token = jwt.sign({ uid: user.uid, id: user._id }, JWT_SECRET, { expiresIn: '6h' });

    return res.json({ token, user: { uid: user.uid, username: user.username } });
  } catch (err) {
    console.error('verify error', err?.response?.data || err.message);
    // if Pi returns 401, token invalid
    if (err?.response?.status === 401) return res.status(401).json({ error: 'invalid access token' });
    return res.status(500).json({ error: 'server error' });
  }
});

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
