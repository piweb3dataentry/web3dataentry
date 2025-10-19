import React, { useState } from "react";
import PiDashboard from "./components/PiDashboard";
import KYCUpload from "./components/KYCUpload";
import MetamaskSwap from "./components/MetamaskSwap";

function App() {
  const [piWallet, setPiWallet] = useState("");

  const handleWalletSubmit = (e) => {
    e.preventDefault();
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
            className="p-2 border rounded mb-2"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Enter
          </button>
        </form>
      ) : (
        <>
          <PiDashboard piWalletAddress={piWallet} />
          <KYCUpload piWalletAddress={piWallet} />
          <MetamaskSwap />
        </>
      )}
    </div>
  );
}

export default App;
                       
