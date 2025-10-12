import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [piWallet, setPiWallet] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, { fullName, piWalletAddress: piWallet, password });
      if (res.data.success) {
        alert("Registered. Please login.");
        navigate("/");
      } else alert(res.data.message || "Register failed");
    } catch (err) {
      alert(err.response?.data?.message || "Network error");
    }
  };

  return (
    <div className="page">
      <div className="card auth">
        <h2>Register</h2>
        <input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
        <input placeholder="Pi Wallet Address" value={piWallet} onChange={e => setPiWallet(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}
