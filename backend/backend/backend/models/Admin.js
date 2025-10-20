const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    income: { type: Number, default: 0 } // Collected transaction fees
});

module.exports = mongoose.model('Admin', adminSchema);
