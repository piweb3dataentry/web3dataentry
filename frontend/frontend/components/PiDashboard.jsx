import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PiDashboard = ({ piWalletAddress }) => {
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txMessage, setTxMessage] = useState('');
  const [history, setHistory] = useState([]);

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`${API_URL}/pi/balance/${piWalletAddress}`);
        if(res.data.balance !== undefined){
          setBalance(res.data.balance);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, [piWalletAddress]);

  // Send Pi
  const handleSend = async () => {
    if(!recipient || !amount) return;
    try {
      const res = await axios.post(`${API_URL}/pi/send`, {
        fromAddress: piWalletAddress,
        toAddress: recipient,
        amount: parseFloat(amount)
      });
      if(res.data.success){
        setTxMessage('Transaction successful!');
        setBalance(prev => prev - parseFloat(amount));
        setHistory(prev => [...prev, { type: 'sent', to: recipient, amount }]);
      } else {
        setTxMessage(res.data.message || 'Transaction failed');
      }
    } catch(err) {
      console.error(err);
      setTxMessage('Error sending Pi');
    }
  };

  return (
    <div className="pi-dashboard">
      <h2>Pi Wallet Dashboard</h2>
      <p><strong>Wallet:</strong> {piWalletAddress}</p>
      <p><strong>Balance:</strong> {balance} Pi</p>

      <h3>Send Pi</h3>
      <input 
        type="text" 
        placeholder="Recipient Wallet Address" 
        value={recipient} 
        onChange={(e)=>setRecipient(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e)=>setAmount(e.target.value)} 
      />
      <button onClick={handleSend}>Send</button>
      <p>{txMessage}</p>

      <h3>Transaction History</h3>
      <ul>
        {history.map((tx, idx)=>(
          <li key={idx}>
            {tx.type} {tx.amount} Pi {tx.to ? `to ${tx.to}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PiDashboard;
