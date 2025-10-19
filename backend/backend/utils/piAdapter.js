// backend/utils/piAdapter.js

// Pi Network Adapter
// NOTE: Placeholder implementation. Replace with official Pi App Platform SDK/API.

const axios = require('axios');

const PI_API_BASE = process.env.PI_API_ENDPOINT || 'https://api.minepi.com';
const PLATFORM_WALLET = process.env.PLATFORM_WALLET_ADDRESS;

// Get Balance of a Pi Wallet Address
async function getUserOnchainBalance(piAddress){
  try{
    const res = await axios.get(`${PI_API_BASE}/wallets/${encodeURIComponent(piAddress)}/balance`, {
      headers: { 'x-api-key': process.env.PI_API_KEY }
    });
    return res.data;
  }catch(err){
    console.warn('pi getBalance failed', err.message);
    return { error: 'not_available', message: err.message };
  }
}

// Send Pi from Platform Wallet
async function sendPi(fromPrivateKey, toAddress, amountPi){
  // Placeholder: Replace with real Pi transfer logic
  try{
    const body = { from: PLATFORM_WALLET, to: toAddress, amount: amountPi };
    const res = await axios.post(`${PI_API_BASE}/payments/send`, body, {
      headers: { 'x-api-key': process.env.PI_API_KEY }
    });
    return res.data;
  }catch(err){
    console.warn('pi send failed', err.message);
    return { success: false, message: err.message };
  }
}

// Verify Pioneer / KYC Status
async function verifyPioneer(piAddress){
  try{
    const res = await axios.get(`${PI_API_BASE}/users/${encodeURIComponent(piAddress)}`, {
      headers: { 'x-api-key': process.env.PI_API_KEY }
    });
    return res.data; // { pioneer: true, kyc_status: 'approved' }
  }catch(err){
    console.warn('pi verifyPioneer failed', err.message);
    return { error: true, message: err.message };
  }
}

module.exports = { getUserOnchainBalance, sendPi, verifyPioneer };
