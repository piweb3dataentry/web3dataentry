🌐 Web3 DataEntry — Empowering Real People Through Web3 Work

Web3 DataEntry is a decentralized platform that connects real-world data entry workers with blockchain-powered payments.
It brings trust, transparency, and true earning opportunities to millions of people — without banks, without borders.

💠 Earn Pi Coin for completing verified micro-tasks.
💠 Work from anywhere — powered by the Pi Network ecosystem.
💠 No middleman, no fake jobs — every task is recorded and verified on the blockchain.
💠 Empowering individuals to become part of the future Web3 workforce

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
- **Name:** Ajgar Ali Molla  
- **Email:** adamsallam48104@gmail.com
- **GitHub:** [https://github.com/piweb3dataentry](https://github.com/piweb3dataentry)

Feel free to reach out for support, collaboration, or integration.

License: MIT
| Status | Task                                                       |
| :----: | :--------------------------------------------------------- |
|    ✅   | `DataEntryPlatform.sol` created                            |
|    ✅   | `TaskContract.sol` implemented (task management & payouts) |
|    ✅   | `Escrow.sol` implemented (secure payment holding)          |
|    ✅   | `MockPiToken.sol` added (for local testing)                |
|    ✅   | `KYCAuth.sol` implemented (KYC + Authentication system)    |
|    ⏳   | Compile all contracts (check `.abi` & `.bin`)              |
|    ⏳   | Record deployed contract addresses in `.env`               |
| Status | Task                                                        |
| :----: | :---------------------------------------------------------- |
|    ✅   | `backend/` folder structured                                |
|    ✅   | `.env.example` → `.env` created                             |
|    ✅   | `User.js` & `Earning.js` models created                     |
|    ⏳   | Add **KYC routes** (`/register`, `/approve`, `/kyc-status`) |
|    ⏳   | Connect backend with blockchain (via Web3.js)               |
|    ✅   | JWT/Auth system ready                                       |
|    ⏳   | Test API endpoints (Postman / curl)                         |
| Status | Task                                                              |
| :----: | :---------------------------------------------------------------- |
|    ✅   | Base React app initialized                                        |
|    ✅   | Tailwind CSS configured                                           |
|    ⏳   | **KYC Registration Page** (Name, Email, Connect Wallet, Register) |
|    ⏳   | **Admin Dashboard** (User list, Approve/Remove buttons)           |
|    ⏳   | Show KYC Status (Approved / Pending / Rejected)                   |
|    ⏳   | Web3 wallet integration test (MetaMask / Pi Browser)              |
| Status | Task                                                        |
| :----: | :---------------------------------------------------------- |
|    ✅   | `deploy.js` created for smart contract deployment           |
|    ⏳   | Deploy all contracts to testnet (Remix / Hardhat / Ganache) |
|    ⏳   | Store deployed contract addresses in `.env`                 |
|    ⏳   | Verify on frontend & backend integration                    |
|    ⏳   | Console logs verified successfully                          |
| Status | Task                                              |
| :----: | :------------------------------------------------ |
|    ✅   | `aiVerifier.js`, `ai_api.py`, `ai_model.py` added |
|    ⏳   | Integrate AI verification for KYC validation      |
|    ⏳   | Test response from AI API module                  |
| Status | Task                                            |
| :----: | :---------------------------------------------- |
|    ✅   | `.env` ignored in `.gitignore`                  |
|    ✅   | `onlyAdmin` modifier added to admin functions   |
|    ⏳   | Input validation before blockchain transactions |
|    ⏳   | Prevent duplicate registration attempts         |
|    ⏳   | Ensure HTTPS + secure headers in backend        |
| Status | Task                                            |
| :----: | :---------------------------------------------- |
|    ✅   | `README.md` created                             |
|    ✅   | `LICENSE (MIT)` added                           |
|    ✅   | `SECURITY.md` added                             |
|    ⏳   | Add “KYC setup” instructions in README          |
|    ⏳   | Add contract addresses + example `.env` section |
| Status | Task                                  |
| :----: | :------------------------------------ |
|    ⏳   | Local Hardhat or Ganache test run     |
|    ⏳   | User registration & KYC approval test |
|    ⏳   | PiToken transaction test (mocked)     |
|    ⏳   | Escrow + Withdraw flow test           |
|    ⏳   | End-to-end integration verified       |
---

## 🚀 Next Steps

- [ ] Add **Pi Token** real payment integration  
- [ ] Add **IPFS document upload** for KYC proof  
- [ ] Add **Notification / Email system** for KYC status updates  
- [ ] (Optional) Deploy frontend to **Vercel / Netlify**

---

> 📋 Full technical progress tracking is available in [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)
