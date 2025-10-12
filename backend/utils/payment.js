// Placeholder payment utilities.
// In production replace with real Pi payment gateway / contract interactions.

export async function sendPi(fromPrivateKey, toAddress, amount) {
  // TODO: integrate with Pi network / contract / bridge
  // Currently a stub that returns success
  return { success: true, txHash: "stub-tx-hash" };
}
