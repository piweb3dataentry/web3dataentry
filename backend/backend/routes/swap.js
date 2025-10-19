const express = require('express');
const router = express.Router();
const piAdapter = require('../utils/piAdapter');
const piRate = require('../utils/pi_rate');

// Swap / Convert to Pi (Placeholder for Metamask/ERC20)
router.post('/pi', async (req, res) => {
  try {
    const { userWallet, amount } = req.body;

    if(!userWallet || !amount) return res.status(400).json({ success: false, message: 'Wallet and amount required' });

    // Convert USD/ETH amount to Pi (using placeholder logic)
    const piAmount = piRate.convertUsdToPi(amount);  // Assuming 'amount' in USD for now

    // Send Pi to user wallet (via PiAdapter)
    const result = await piAdapter.sendPi(process.env.PLATFORM_WALLET_ADDRESS, userWallet, piAmount);

    if(result.success || result.txId){
      return res.json({ success: true, piAmount, txId: result.txId || 'placeholder_txid' });
    } else {
      return res.json({ success: false, message: result.message || 'Swap failed' });
    }

  } catch(err){
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
    
