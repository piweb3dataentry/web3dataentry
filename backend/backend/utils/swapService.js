// backend/utils/swapService.js

// Swap helper: provides quote and (optionally) execute swap via external providers.
// Example providers: 1inch (on-chain aggregator), SimpleSwap (custodial swap), others.

const axios = require('axios');
const SWAP_PROVIDER = process.env.SWAP_PROVIDER || '1inch';

// fromChain: e.g. 'ethereum'
// fromTokenAddress: token contract address or symbol depending on provider
// amount: amount in token's smallest unit (provider-specific)

async function swapTokenToPi(fromChain, fromTokenAddress, amount, userWalletAddress){
  if(SWAP_PROVIDER === '1inch'){
    // 1inch quote example (requires chainId and token addresses)
    // NOTE: 1inch does not currently support 'PI' token by default. Use a provider that supports PI or a custodial swap.
    const chainId = 1; // mainnet
    const quoteUrl = `https://api.1inch.io/v5.0/${chainId}/quote`;
    try{
      const res = await axios.get(quoteUrl, { params: { fromTokenAddress, toTokenAddress: '0xPI_TOKEN_PLACEHOLDER', amount } });
      return { success: true, quote: res.data };
    }catch(err){
      return { success: false, message: err.message };
    }
  }

  if(SWAP_PROVIDER === 'simpleswap'){
    try{
      const res = await axios.post('https://api.simpleswap.io/v1/create-transaction', {
        coin_from: fromTokenAddress,
        coin_to: 'PI',
        amount_from: amount,
        address_to: userWalletAddress
      }, { headers: { 'Authorization': `Bearer ${process.env.SWAP_API_KEY}` } });
      return { success: true, data: res.data };
    }catch(err){
      return { success: false, message: err.message };
    }
  }

  return { success: false, message: 'no swap provider configured' };
}

module.exports = { swapTokenToPi };
