const Task = require('../models/Task');
const User = require('../models/User');

const completeTask = async (req, res) => {
    try {
        const { taskId, userId } = req.body;

        const task = await Task.findById(taskId);
        const user = await User.findById(userId);

        if (!task || !user) return res.status(404).json({ msg: 'Task or user not found' });

        const transactionFee = 0.01; // 0.01 Pi or 1% example
        const earnings = task.reward - transactionFee;

        // Update user earnings
        user.balance += earnings;
        await user.save();

        res.json({ msg: 'Task completed', earnings, feeCharged: transactionFee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { completeTask };
