const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    reward: { type: Number, required: true },
    completedBy: { type: [String], default: [] } // Users who completed this task
});

module.exports = mongoose.model('Task', taskSchema);
