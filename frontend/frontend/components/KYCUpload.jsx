import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const KYCUpload = ({ piWalletAddress }) => {
  const [kycStatus, setKycStatus] = useState('Not submitted'); // Not submitted / Pending / Approved / Rejected
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Fetch KYC status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/kyc/status/${piWalletAddress}`);
        if(res.data.success) setKycStatus(res.data.status);
      } catch(err){
        console.error(err);
      }
    };
    fetchStatus();
  }, [piWalletAddress, alert]);

  // Handle KYC submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!frontDoc || !backDoc || !facePhoto){
      setAlert({ message: 'All files required', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('piWallet', piWalletAddress);
    formData.append('frontDoc', frontDoc);
    formData.append('backDoc', backDoc);
    formData.append('facePhoto', facePhoto);

    try {
      const res = await axios.post(`${API_URL}/kyc/manual`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if(res.data.success){
        setAlert({ message: 'KYC submitted successfully', type: 'success' });
      } else {
        setAlert({ message: res.data.message || 'Submission failed', type: 'error' });
      }
    } catch(err){
      console.error(err);
      setAlert({ message: 'Error submitting KYC', type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-2">KYC Verification</h2>
      <p className="mb-4">Current Status: <span className="font-semibold">{kycStatus}</span></p>

      {alert.message && (
        <div className={`p-2 mb-4 text-white rounded ${alert.type==='success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alert.message}
        </div>
      )}

      {kycStatus === 'Not submitted' || kycStatus === 'Rejected' ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            onChange={(e)=>setFrontDoc(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            onChange={(e)=>setBackDoc(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e)=>setFacePhoto(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit KYC
          </button>
        </form>
      ) : (
        <p className="text-gray-600">KYC already submitted or under review.</p>
      )}
    </div>
  );
};

export default KYCUpload;
