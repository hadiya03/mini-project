/*import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Sidebar from "./components/styles/Sidebar";
import Header from "./components/styles/Header";

import DashboardHome from "./components/pages/DashboardHome";
import Players from "./components/pages/Players";
import CreatePlayer from "./components/pages/CreatePlayer";

import "./components/styles/layout.css";
import "./components/pages/styles/page.css";
import PlayerProfile from "./components/pages/PlayerProfile";
import PlayerReadiness from "./components/pages/PlayerReadiness";
import UpdateAssessment from "./components/pages/UpdateAssessment";
import TrainingSessions from "./components/pages/TrainingSessions";
import TrainerReports from "./components/pages/TrainerReports";
import "./components/pages/reports.css";
import "./components/pages/trainingSessions.css";



const App = () => {
  // ProtectedRoute component to check if user is logged in
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/l" replace />; // redirect to login if not logged in
    }
    return children;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
     
      <Navbar />

      
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom right, #9be8e8, #b9d0ff)",
        }}
      >
        <Routes>
          <Route path="/l" element={<Login />} />
          <Route path="/s" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="*" element={<Navigate to="/l" replace />} />


              <Route path="/analyst-dashboard" element={<DashboardHome />} />
              <Route path="/players" element={<Players />} />
              <Route path="/create-player" element={<CreatePlayer />} />
              <Route path="/players/:id" element={<PlayerProfile />} />
              <Route path="/players/:id/readiness" element={<PlayerReadiness />} />
              <Route path="/players/:id/update-assessment" element={<UpdateAssessment />} />
              <Route path="/training-sessions"element={<TrainingSessions />}/>
              <Route path="reports" element={<TrainerReports />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;*/






import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Sidebar from "./components/styles/Sidebar";
import Header from "./components/styles/Header";

import DashboardHome from "./components/pages/DashboardHome";
import Players from "./components/pages/Players";
import CreatePlayer from "./components/pages/CreatePlayer";

import "./components/styles/layout.css";
import "./components/pages/styles/page.css";
import PlayerProfile from "./components/pages/PlayerProfile";
import PlayerReadiness from "./components/pages/PlayerReadiness";
import UpdateAssessment from "./components/pages/UpdateAssessment";
import TrainingSessions from "./components/pages/TrainingSessions";
import TrainerReports from "./components/pages/TrainerReports";
import "./components/pages/reports.css";
import "./components/pages/trainingSessions.css";

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/l" replace />;
    }
    return children;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Routes>
        {/* ---------------- PUBLIC ROUTES (Centered like before) ---------------- */}
        <Route
          path="/l"
          element={
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(to bottom right, #9be8e8, #b9d0ff)",
              }}
            >
              <Login />
            </div>
          }
        />

        <Route
          path="/s"
          element={
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(to bottom right, #9be8e8, #b9d0ff)",
              }}
            >
              <Signup />
            </div>
          }
        />

        <Route
          path="/reset-password"
          element={
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(to bottom right, #9be8e8, #b9d0ff)",
              }}
            >
              <ResetPassword />
            </div>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                  "linear-gradient(to bottom right, #9be8e8, #b9d0ff)",
              }}
            >
              <ForgotPassword />
            </div>
          }
        />

        {/* ---------------- PROTECTED DASHBOARD ROUTES ---------------- */}

        <Route
          path="/analyst-dashboard"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <DashboardHome />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <Players />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-player"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <CreatePlayer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/:id"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <PlayerProfile />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/:id/readiness"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <PlayerReadiness />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/:id/update-assessment"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <UpdateAssessment />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/training-sessions"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <TrainingSessions />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Header />
                  <TrainerReports />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/l" replace />} />
      </Routes>
    </div>
  );
};

export default App;


