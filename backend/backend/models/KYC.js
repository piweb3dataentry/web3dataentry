const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  piWallet: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Not submitted','Pending','Approved','Rejected'], default: 'Not submitted' },
  isPioneer: { type: Boolean, default: false },
  frontDoc: { type: String }, // store file path or URL
  backDoc: { type: String },
  facePhoto: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }
});

module.exports = mongoose.model('KYC', kycSchema);
