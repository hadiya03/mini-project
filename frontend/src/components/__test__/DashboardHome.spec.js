import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardHome from "../pages/DashboardHome";
import axios from "axios";

jest.mock("axios");

describe("Dashboard Component", () => {

  const mockDashboardData = {
    totalPlayers: 10,
    averageReadiness: 80,
    playersAtRisk: 2,
    atRiskPlayers: [
      {
        id: 1,
        name: "Messi",
        risk_level: "High",
        injury_risk: "0.8",
      },
    ],
  };

  const mockPlayers = [
    { id: 1, name: "Messi", position: "Forward", current_team: "Inter Miami" },
    { id: 2, name: "Ronaldo", position: "Forward", current_team: "Al Nassr" },
  ];

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/dashboard")) {
        return Promise.resolve({ data: mockDashboardData });
      }
      if (url.includes("/player/players")) {
        return Promise.resolve({ data: mockPlayers });
      }
    });
  });

  // ✅ Test 1: Dashboard stats (FIXED)
  test("renders dashboard statistics", async () => {
    render(<DashboardHome />);

    expect(await screen.findByText("Total Players")).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();

    // FIX → multiple 80%
    const readinessValues = await screen.findAllByText(/80\s*%/);
    expect(readinessValues.length).toBeGreaterThan(0);

    expect(await screen.findByText("2")).toBeInTheDocument();
  });

  // ✅ Test 2: Players table (FIXED)
  test("renders players table", async () => {
    render(<DashboardHome />);

    const messiElements = await screen.findAllByText("Messi");
    expect(messiElements.length).toBeGreaterThan(0);

    expect(await screen.findByText("Ronaldo")).toBeInTheDocument();

    // FIX → multiple "Forward"
    const forwardElements = await screen.findAllByText("Forward");
    expect(forwardElements.length).toBeGreaterThan(0);
  });

  // ✅ Test 3: Readiness message
  test("shows correct readiness message", async () => {
    render(<DashboardHome />);

    expect(
      await screen.findByText("Good – Optimal training load maintained")
    ).toBeInTheDocument();
  });

  // ✅ Test 4: Risk alerts (FIXED)
  test("renders at risk players", async () => {
    render(<DashboardHome />);

    expect(
      await screen.findByText(/Injury Risk Alerts/i)
    ).toBeInTheDocument();

    const messiElements = await screen.findAllByText(/Messi/i);
    expect(messiElements.length).toBeGreaterThan(0);

    expect(await screen.findByText(/High/i)).toBeInTheDocument();
  });

});