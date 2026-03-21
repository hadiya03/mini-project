// src/components/__test__/TeamAnalytics.spec.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TeamAnalytics from "../pages/TeamAnalytics";

// ✅ Mock toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// ✅ Mock fetch
global.fetch = jest.fn();

describe("TeamAnalytics Component", () => {
  const mockPlayers = [
    { id: 1, name: "GK1", position: "Goalkeeper", readiness_score: 9 },
    { id: 2, name: "DEF1", position: "Defender", readiness_score: 8 },
    { id: 3, name: "DEF2", position: "Defender", readiness_score: 7 },
    { id: 4, name: "DEF3", position: "Defender", readiness_score: 6 },
    { id: 5, name: "DEF4", position: "Defender", readiness_score: 6 },
    { id: 6, name: "MID1", position: "Midfielder", readiness_score: 9 },
    { id: 7, name: "MID2", position: "Midfielder", readiness_score: 8 },
    { id: 8, name: "MID3", position: "Midfielder", readiness_score: 7 },
    { id: 9, name: "FWD1", position: "Forward", readiness_score: 9 },
    { id: 10, name: "FWD2", position: "Forward", readiness_score: 8 },
    { id: 11, name: "FWD3", position: "Forward", readiness_score: 7 },
    { id: 12, name: "SUB1", position: "Forward", readiness_score: 6 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-token");

    fetch.mockImplementation((url) => {
      if (url.includes("/trainer-players")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPlayers,
        });
      }

      if (url.includes("/last-team")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            team_a: [],
            team_b: [],
            best_team: { startingXI: [], substitutes: [] },
          }),
        });
      }

      if (url.includes("/save-team")) {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({ ok: false });
    });
  });

  // ✅ Helper
  const renderAndWait = async () => {
    render(<TeamAnalytics />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Shuffle Teams/i })
      ).toBeEnabled();
    });
  };

  // ✅ Test 1: Buttons render
  test("renders main buttons", async () => {
    await renderAndWait();

    expect(
      screen.getByRole("button", { name: /Shuffle Teams/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Generate Match XI/i })
    ).toBeInTheDocument();
  });

  // ✅ Test 2: Shuffle teams (FIXED)
  test("shuffles and displays teams", async () => {
    await renderAndWait();

    fireEvent.click(
      screen.getByRole("button", { name: /Shuffle Teams/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Team A" })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { name: "Team B" })
      ).toBeInTheDocument();
    });
  });

  // ✅ Test 3: Generate best XI
  test("generates best team", async () => {
    await renderAndWait();

    fireEvent.click(
      screen.getByRole("button", { name: /Generate Match XI/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Predicted Starting XI/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText("GK1")).toBeInTheDocument();
  });

  // ✅ Test 4: Disabled button when not enough players (FIXED)
  test("disables generate button if not enough players", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockPlayers.slice(0, 5),
      })
    );

    render(<TeamAnalytics />);

    const button = await screen.findByRole("button", {
      name: /Generate Match XI/i,
    });

    expect(button).toBeDisabled();
  });

  // ✅ Test 5: Save API called after shuffle
  test("calls save API after shuffle", async () => {
    await renderAndWait();

    fireEvent.click(
      screen.getByRole("button", { name: /Shuffle Teams/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/save-team"),
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });
});