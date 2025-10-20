import Earning from "../models/Earning.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const completeTask = async (req, res) => {
    try {
        const { taskId, userId } = req.body;

        const task = await Task.findById(taskId);
        const user = await User.findById(userId);
        const admin = await Admin.findOne({});

        if (!task || !user) return res.status(404).json({ msg: "Task or user not found" });
        if (task.completedBy.includes(userId)) return res.status(400).json({ msg: "Task already completed" });

        const transactionFeePercent = 1; // 1%
        const transactionFee = (task.reward * transactionFeePercent) / 100;
        const earningsAmount = task.reward - transactionFee;

        // Update user balance
        user.balance += earningsAmount;
        await user.save();

        // Update admin income
        admin.income += transactionFee;
        await admin.save();

        // Mark task as completed
        task.completedBy.push(userId);
        await task.save();

        // Save Earning record
        const earningRecord = new Earning({
            user: user._id,
            piAmount: earningsAmount,
            usdAmount: earningsAmount * 0.1, // example conversion rate
            inrAmount: earningsAmount * 8,   // example conversion rate
            note: `Task completed: ${task.title}`
        });
        await earningRecord.save();

        res.json({ msg: "Task completed successfully", earnings: earningsAmount, feeCharged: transactionFee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
