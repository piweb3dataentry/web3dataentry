import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MetamaskSwap = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  const connectWallet = async () => {
    if(window.ethereum){
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch(err){ console.error(err); }
    } else alert("Metamask not detected");
  };

  const handleSwap = async () => {
    if(!swapAmount || !account){
      setAlert({ message: 'Enter amount', type: 'error' });
      return;
    }
    try{
      const res = await axios.post(`${API_URL}/swap/pi`, {
        userWallet: account,
        amount: parseFloat(swapAmount)
      });
      if(res.data.success){
        setAlert({ message: 'Swap successful! Pi credited.', type: 'success' });
        setSwapAmount('');
      } else {
        setAlert({ message: res.data.message || 'Swap failed', type: 'error' });
      }
    } catch(err){
      console.error(err);
      setAlert({ message: 'Error during swap', type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-2">Metamask / Swap</h2>
      {!account ? (
        <button 
          onClick={connectWallet} 
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Connect Metamask
        </button>
      ) : (
        <p className="mb-2">Connected Account: {account}</p>
      )}

      {alert.message && (
        <div className={`p-2 mb-4 text-white rounded ${alert.type==='success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alert.message}
        </div>
      )}

      <input
        type="number"
        placeholder="Amount in ETH"
        className="w-full mb-2 p-2 border rounded"
        value={swapAmount}
        onChange={(e)=>setSwapAmount(e.target.value)}
      />
      <button 
        onClick={handleSwap}
        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
      >
        Swap
      </button>
    </div>
  );
};

export default MetamaskSwap;
