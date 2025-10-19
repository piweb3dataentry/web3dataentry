// backend/utils/pi_rate.js

const fs = require('fs');
const path = require('path');

const RATE_FILE = path.join(__dirname, 'pi_rate.json');

// Default rate (example): 1 Pi = $314,159
// Store rate as piPerUsd := how many Pi equals 1 USD (i.e. Pi / USD)
const DEFAULT = { piPerUsd: 1 / 314159, updatedAt: new Date().toISOString() };

function loadRate(){
  try{
    if(fs.existsSync(RATE_FILE)){
      const raw = fs.readFileSync(RATE_FILE,'utf8');
      return JSON.parse(raw);
    }
  }catch(err){
    console.error('Error loading rate file', err);
  }
  return DEFAULT;
}

function saveRate(obj){
  fs.writeFileSync(RATE_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

// Admin can call this to set a new rate (piPerUsd)
function setRate(piPerUsd){
  const obj = { piPerUsd, updatedAt: new Date().toISOString() };
  saveRate(obj);
  return obj;
}

// Convert USD amount to Pi amount, returns number rounded to 8 decimals
function convertUsdToPi(usdAmount){
  const rate = loadRate();
  const pi = usdAmount * (rate.piPerUsd);
  return +pi.toFixed(8);
}

module.exports = { loadRate, setRate, convertUsdToPi };
