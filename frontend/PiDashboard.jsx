import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PiDashboard = ({ piWalletAddress }) => {
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`${API_URL}/pi/balance/${piWalletAddress}`);
        setBalance(res.data.balance || 0);
      } catch(err){ console.error(err); }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/pi/history/${piWalletAddress}`);
        if(res.data.success) setHistory(res.data.history);
      } catch(err){ console.error(err); }
    };

    fetchBalance();
    fetchHistory();
  }, [piWalletAddress, alert]);

  const handleSend = async () => {
    if(!recipient || !amount){
      setAlert({ message: 'Please fill recipient and amount', type: 'error' });
      return;
    }
    try{
      const res = await axios.post(`${API_URL}/pi/send`, {
        fromAddress: piWalletAddress,
        toAddress: recipient,
        amount: parseFloat(amount)
      });
      if(res.data.success){
        setAlert({ message: 'Transaction successful!', type: 'success' });
        setRecipient('');
        setAmount('');
      } else {
        setAlert({ message: res.data.message || 'Transaction failed', type: 'error' });
      }
    } catch(err){
      console.error(err);
      setAlert({ message: 'Error sending Pi', type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-2">Pi Wallet Dashboard</h2>
      <p><strong>Wallet:</strong> {piWalletAddress}</p>
      <p className="mb-4"><strong>Balance:</strong> {balance} Pi</p>

      {alert.message && (
        <div className={`p-2 mb-4 text-white rounded ${alert.type==='success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alert.message}
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Send Pi</h3>
        <input 
          type="text" 
          placeholder="Recipient Wallet Address" 
          className="w-full mb-2 p-2 border rounded"
          value={recipient} 
          onChange={(e)=>setRecipient(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          className="w-full mb-2 p-2 border rounded"
          value={amount} 
          onChange={(e)=>setAmount(e.target.value)} 
        />
        <button 
          onClick={handleSend}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      <h3 className="font-semibold mb-2">Transaction History</h3>
      <ul className="max-h-64 overflow-y-auto border rounded p-2">
        {history.length === 0 && <li>No transactions yet</li>}
        {history.map((tx, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-semibold">{tx.txType}</span> {tx.amount} Pi {tx.toAddress ? `to ${tx.toAddress}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PiDashboard;
