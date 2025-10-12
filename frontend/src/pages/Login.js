import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login() {
  const [piWallet, setPiWallet] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { piWalletAddress: piWallet, password });
      if (res.data.success) {
        localStorage.setItem("w3_token", res.data.token);
        localStorage.setItem("w3_user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Network error");
    }
  };

  return (
    <div className="page">
      <div className="card auth">
        <h2>Login</h2>
        <input placeholder="Pi Wallet Address" value={piWallet} onChange={e => setPiWallet(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="row">
          <button onClick={handleLogin}>Login</button>
          <Link to="/register"><button>Register</button></Link>
        </div>
      </div>
    </div>
  );
    }
