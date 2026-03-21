import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard"; // ✅ correct path
import axios from "axios";

jest.mock("axios");

describe("AdminDashboard Component", () => {
  const mockUsers = [
    { id: 1, email: "a@test.com" },
    { id: 2, email: "b@test.com" },
  ];

  const mockLogs = [
    {
      email: "a@test.com",
      login_time: "2024-01-01T10:00:00",
      logout_time: null, // ✅ active
    },
    {
      email: "b@test.com",
      login_time: "2024-01-01T09:00:00",
      logout_time: "2024-01-01T11:00:00", // ✅ offline
    },
    {
      email: "a@test.com",
      login_time: "2024-01-01T08:00:00",
      logout_time: "2024-01-01T09:00:00",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    axios.get.mockImplementation((url) => {
      if (url.includes("/users")) {
        return Promise.resolve({ data: mockUsers });
      }
      if (url.includes("/logs")) {
        return Promise.resolve({ data: mockLogs });
      }
      return Promise.resolve({ data: [] });
    });
  });

  const renderComponent = async () => {
    render(<AdminDashboard />);
    await screen.findByText(/Total Users/i);
  };

  /* ================= TEST CASES ================= */

  test("renders KPI labels", async () => {
    await renderComponent();

    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Logins/i)).toBeInTheDocument();
    expect(screen.getByText(/Currently Offline/i)).toBeInTheDocument();
  });

  test("renders KPI values correctly", async () => {
    await renderComponent();

    // ✅ avoid duplicate text issue
    const kpiValues = screen.getAllByRole("heading", { level: 2 });

    expect(kpiValues[0]).toHaveTextContent("2"); // total users
    expect(kpiValues[1]).toHaveTextContent("1"); // active users
    expect(kpiValues[2]).toHaveTextContent("3"); // total logins
    expect(kpiValues[3]).toHaveTextContent("1"); // offline users
  });

  test("renders recent activity table", async () => {
    await renderComponent();

    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    expect(screen.getByText("a@test.com")).toBeInTheDocument();
    expect(screen.getByText("b@test.com")).toBeInTheDocument();
  });

  test("shows correct online/offline status", async () => {
    await renderComponent();

    // ✅ FIX: exact match + multiple elements safe
    const onlineElements = screen.getAllByText(/^Online$/i);
    const offlineElements = screen.getAllByText(/^Offline$/i);

    expect(onlineElements.length).toBeGreaterThan(0);
    expect(offlineElements.length).toBeGreaterThan(0);
  });
});