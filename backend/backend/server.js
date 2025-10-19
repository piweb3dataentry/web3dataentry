const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const kycRoutes = require('./routes/kyc');
const swapRoutes = require('./routes/swap');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/kyc', kycRoutes);
app.use('/api/swap', swapRoutes);

// Pi balance/send routes (example)
const piAdapter = require('./utils/piAdapter');
app.get('/api/pi/balance/:wallet', async (req, res) => {
  const wallet = req.params.wallet;
  const result = await piAdapter.getUserOnchainBalance(wallet);
  res.json({ balance: result.balance || 0 });
});
app.post('/api/pi/send', async (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  const result = await piAdapter.sendPi(fromAddress, toAddress, amount);
  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
