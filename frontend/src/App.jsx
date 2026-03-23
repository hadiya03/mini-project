import React from "react";
import { Toaster } from "sonner";
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
import PlayersT from "./components/pages/PlayersT";
import CreatePlayer from "./components/pages/CreatePlayer";

import "./components/styles/layout.css";
import "./components/pages/styles/page.css";
import PlayerProfile from "./components/pages/PlayerProfile";
import PlayerReadiness from "./components/pages/PlayerReadiness";
import UpdateAssessment from "./components/pages/UpdateAssessment";
import TrainingSessions from "./components/pages/TrainingSessions";
import TrainerReports from "./components/pages/TrainerReports";
import TeamAnalytics from "./components/pages/TeamAnalytics";
import "./components/pages/reports.css";
import "./components/pages/trainingSessions.css";
import PlayerDashboard from './assets/PlayerDashboard';
import Dashboard from "./pages/Dashboard";
import "./components/SidebarT"
import SidebarT from "./components/SidebarT";
import HeaderT from "./components/HeaderT";
import HeaderA from "./components/HeaderA";
import PlayerProfileT from "./components/pages/PlayerProfileT";
import PlayerReadinessT from "./components/pages/PlayerReadinessT";
import TrainingSessionsT from "./components/pages/TrainingSessionsT";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Analytics from "./components/Analytics.jsx";
import ManageUsers from "./components/ManageUsers.jsx";
import Sidebarr from "./components/Sidebarr.jsx";

import SystemLogs from "./components/SystemLogs.jsx";
import "./football-theme.css";


const App = () => {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/l" replace />;
    }
    return children;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Toaster richColors position="top-center" closeButton />
      <Navbar />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route
          path="/l"
          element={
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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

        <Route path="/playerdashboard" element={<PlayerDashboard/>}/>

        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-players"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <PlayersT />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-playerprofile/:id"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <PlayerProfileT/>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-playerprofile/:id/readiness"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <PlayerReadinessT/>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-training-sessions"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <TrainingSessionsT />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-analysis"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <TeamAnalytics />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainer-reports"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", flex: 1 }}>
                <SidebarT />
                <div style={{ flex: 1 }}>
                  <HeaderT />
                  <TrainerReports />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

         {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div style={{ display: "flex", height: "100%" }}>
                  <Sidebarr />
                  <div style={{ flex: 1 }}>
                    <HeaderA />
                    <AdminDashboard />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <div style={{ display: "flex", height: "100%" }}>
                  <Sidebarr />
                  <div style={{ flex: 1 }}>
                    <HeaderA />
                    <Analytics />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-users"
            element={
              <ProtectedRoute>
                <div style={{ display: "flex", height: "100%" }}>
                  <Sidebarr />
                  <div style={{ flex: 1 }}>
                    <HeaderA />
                    <ManageUsers />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/system-logs"
            element={
              <ProtectedRoute>
                <div style={{ display: "flex", height: "100%" }}>
                  <Sidebarr />
                  <div style={{ flex: 1 }}>
                    <HeaderA />
                    <SystemLogs />
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