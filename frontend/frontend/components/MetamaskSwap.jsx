import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MetamaskSwap = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [txMessage, setTxMessage] = useState('');

  // Connect Metamask
  const connectWallet = async () => {
    if(window.ethereum){
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch(err){
        console.error(err);
      }
    } else {
      alert("Metamask not detected");
    }
  };

  // Swap Ethereum token to Pi (placeholder)
  const handleSwap = async () => {
    if(!swapAmount || !account) return;
    try{
      const res = await axios.post(`${API_URL}/swap/pi`, {
        userWallet: account,
        amount: parseFloat(swapAmount)
      });
      if(res.data.success){
        setTxMessage('Swap successful! Pi credited.');
      } else {
        setTxMessage(res.data.message || 'Swap failed');
      }
    } catch(err){
      console.error(err);
      setTxMessage('Error during swap');
    }
  };

  return (
    <div className="metamask-swap">
      <h2>Metamask / Swap</h2>
      {!account ? (
        <button onClick={connectWallet}>Connect Metamask</button>
      ) : (
        <p>Connected Account: {account}</p>
      )}

      <h3>Swap Ethereum to Pi (Placeholder)</h3>
      <input
        type="number"
        placeholder="Amount in ETH"
        value={swapAmount}
        onChange={(e)=>setSwapAmount(e.target.value)}
      />
      <button onClick={handleSwap}>Swap</button>
      <p>{txMessage}</p>
    </div>
  );
};

export default MetamaskSwap;
