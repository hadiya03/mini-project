import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./pages/PlayerProfile";
import TrainingSessions from "./pages/TrainingSessions";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />   {/* ✅ render sidebar */}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/training-sessions" element={<TrainingSessions />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
