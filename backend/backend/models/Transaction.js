const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  txType: { type: String, enum: ['sent', 'received'], default: 'sent' },
  timestamp: { type: Date, default: Date.now },
  txId: { type: String } // optional, from Pi network
});

module.exports = mongoose.model('Transaction', transactionSchema);
