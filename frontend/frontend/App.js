import './styles/styles.css';
import React, { useState } from "react";
import PiDashboard from "./components/PiDashboard";
import MetamaskSwap from "./components/MetamaskSwap";

function App() {
  const [piWallet, setPiWallet] = useState("");

  const handleWalletSubmit = (e) => {
    e.preventDefault();
    // wallet validation can be added here
  };

  return (
    <div className="App">
      {!piWallet ? (
        <form onSubmit={handleWalletSubmit}>
          <input
            type="text"
            placeholder="Enter your Pi Wallet Address"
            value={piWallet}
            onChange={(e) => setPiWallet(e.target.value)}
          />
          <button type="submit">Enter</button>
        </form>
      ) : (
        <>
          <PiDashboard piWalletAddress={piWallet} />
          <MetamaskSwap />
        </>
      )}
    </div>
  );
}

export default App;
              
