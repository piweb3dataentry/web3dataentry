# web3dataentry

Web3 Data Entry Platform — backend (Express + MongoDB), frontend (React), smart contracts (Solidity).  
This repo is setup-ready for others: clone → install → run.

## Quick start (local)

### Backend
1. cd backend
2. npm install
3. copy `.env.example` to `.env` and set values
4. npm run dev

Default server: http://localhost:5000

### Frontend
1. cd frontend
2. npm install
3. npm start

Frontend: http://localhost:3000

## Contracts
- contracts/PiCoin.sol
- contracts/DataEntryPlatform.sol

Deploy on Remix/Hardhat when ready.

## Notes
- Do not commit `.env` or private keys
- Minimum withdraw: 10$ (logic in backend)
- Transaction fee: 0.01 Pi (sample)

## Contact
Owner: your-name / your-email
License: MIT

