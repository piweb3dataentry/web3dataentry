import InstallButton from "./components/InstallButton";
import Verifier from "./components/Verifier";

function App() {
  const wsUrl = process.env.REACT_APP_AI_WS || "ws://localhost:8000/ws/verify";
  return (
    <div style={{ padding: 12 }}>
      <h2>Pi Web3 DataEntry — Mobile</h2>
      <InstallButton />
      <hr />
      <h3>AI Verifier (real-time)</h3>
      <Verifier wsUrl={wsUrl} />
    </div>
  );
}
