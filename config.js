// config.js

// Sandbox flag
const SANDBOX = true;
export default SANDBOX;

// Pi SDK initialization
import Pi from 'pi-sdk'; // Adjust import according to your project setup

Pi.init({
  sandbox: SANDBOX,                  // Enable sandbox mode
  appName: 'Web3dataentry',          // Your app's name
  appLogoUrl: 'https://web3dataentry.vercel.app/logo.png', // App logo URL
  apiKey: 'YOUR_API_KEY',            // Your Pi API key if required
  // Other necessary parameters
});
