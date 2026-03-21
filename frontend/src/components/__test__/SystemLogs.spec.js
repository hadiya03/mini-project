import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react"; // ✅ Correct import
import SystemLogs from "../SystemLogs";

// Mock global fetch
beforeAll(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("SystemLogs Component", () => {
  it("renders table headers correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    await act(async () => {
      render(<SystemLogs />);
    });

    const headers = ["Email", "Role", "Login Time", "Logout Time", "Status"];
    for (const header of headers) {
      expect(screen.getByText(header)).toBeInTheDocument();
    }
  });

  it("renders logs fetched from API with correct online/offline status", async () => {
    const mockLogs = [
      { email: "a@example.com", role: "Admin", login_time: "2026-03-21T08:00:00Z", logout_time: "" },
      { email: "b@example.com", role: "User", login_time: "2026-03-21T07:00:00Z", logout_time: "2026-03-21T08:00:00Z" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockLogs
    });

    await act(async () => {
      render(<SystemLogs />);
    });

    await waitFor(() => {
      expect(screen.getByText("a@example.com")).toBeInTheDocument();
      expect(screen.getByText("b@example.com")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(screen.getByText("Offline")).toBeInTheDocument();
    });
  });

  it("handles API returning non-array gracefully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: "invalid data" })
    });

    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      render(<SystemLogs />);
    });

    await waitFor(() => {
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    spy.mockRestore();
  });

  it("handles fetch failure gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      render(<SystemLogs />);
    });

    await waitFor(() => {
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    spy.mockRestore();
  });
});