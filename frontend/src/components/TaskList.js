import React from "react";
import axios from "axios";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function TaskList({ tasks = [], onComplete }) {
  const complete = async (taskId) => {
    try {
      const user = JSON.parse(localStorage.getItem("w3_user") || "null");
      const token = localStorage.getItem("w3_token");
      const res = await axios.post(`${API}/api/tasks/complete/${taskId}`, { userId: user._id }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        // update user localStorage
        user.balance = res.data.balance;
        localStorage.setItem("w3_user", JSON.stringify(user));
        alert("Task completed and balance updated");
        onComplete && onComplete();
      } else alert(res.data.message || "Failed");
    } catch (err) {
      alert(err.response?.data?.message || "Network error");
    }
  };

  return (
    <div>
      <h4>Open Tasks</h4>
      <ul className="task-list">
        {tasks.map(t => (
          <li key={t._id}>
            <div className="task-row">
              <div>
                <strong>{t.title}</strong>
                <p>{t.description}</p>
                <small>Reward: {t.reward} Pi</small>
              </div>
              <div>
                <button onClick={() => complete(t._id)}>Complete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
