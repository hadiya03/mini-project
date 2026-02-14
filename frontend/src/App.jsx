import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./pages/PlayerProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/player/:id" element={<PlayerProfile />} />
    </Routes>
  );
}
export default App;