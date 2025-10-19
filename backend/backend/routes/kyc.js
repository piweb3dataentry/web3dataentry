// backend/routes/kyc.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/kyc/' });
const KYC = require('../models/KYC');
const User = require('../models/User');
const piAdapter = require('../utils/piAdapter');

// ✅ Pioneer Auto-KYC Check
// POST /api/kyc/check-pioneer
// body: { piWalletAddress }
router.post('/check-pioneer', async (req, res) => {
  try {
    const { piWalletAddress } = req.body;
    const info = await piAdapter.verifyPioneer(piWalletAddress);

    if(info && info.pioneer){
      const user = await User.findOneAndUpdate(
        { piWalletAddress },
        { kycStatus: 'approved', pioneer: true },
        { new: true }
      );
      return res.json({ success: true, autoApproved: true, user });
    }

    return res.json({ success: true, autoApproved: false, message: 'Not a pioneer or API inconclusive' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Manual KYC Upload (Non-Pioneer)
// POST /api/kyc/manual  (multipart form)
// fields: docFront, docBack, face
router.post('/manual', upload.fields([
  { name: 'docFront' },
  { name: 'docBack' },
  { name: 'face' }
]), async (req, res) => {
  try {
    const { userId, formData } = req.body;
    const files = req.files || {};
    const paths = [];

    if(files.docFront) paths.push(files.docFront[0].path);
    if(files.docBack) paths.push(files.docBack[0].path);
    if(files.face) paths.push(files.face[0].path);

    const kyc = await KYC.create({
      userId,
      documents: paths,
      formData: JSON.parse(formData || '{}'),
      status: 'pending'
    });

    // TODO: Admin will review manually
    res.json({ success: true, kycId: kyc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin KYC Review
// POST /api/kyc/review/:id
// body: { action: 'approve' | 'reject' }
router.post('/review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const kyc = await KYC.findById(id);
    if(!kyc) return res.status(404).json({ error: 'notfound' });

    kyc.status = action === 'approve' ? 'approved' : 'rejected';
    kyc.reviewedAt = new Date();
    await kyc.save();

    if(kyc.userId){
      await User.findByIdAndUpdate(kyc.userId, { kycStatus: kyc.status });
    }

    res.json({ success: true, kyc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
