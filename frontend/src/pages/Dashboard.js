import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskList from "../components/TaskList";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("w3_user") || "null"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks/all`);
      if (res.data.success) setTasks(res.data.tasks);
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.removeItem("w3_token");
    localStorage.removeItem("w3_user");
    window.location.href = "/";
  };

  return (
    <div className="page">
      <div className="card">
        <div className="topbar">
          <div>
            <h3>Welcome, {user?.fullName}</h3>
            <p>Wallet: {user?.piWalletAddress}</p>
            <p>Balance: {user?.balance} Pi</p>
            <p>KYC: {user?.kycStatus}</p>
          </div>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <TaskList tasks={tasks} onComplete={() => loadTasks()} />
      </div>
    </div>
  );
}
