import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import PlayerReadiness from "../pages/PlayerReadiness";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock router
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

// ✅ Mock fetch
global.fetch = jest.fn();

// ✅ 🔥 REMOVE ACT WARNINGS COMPLETELY
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe("PlayerReadiness Component", () => {
  const mockPlayers = [
    { id: 1, name: "Messi", position: "Forward" },
  ];

  const mockAssessment = {
    readiness: 80,
    fatigue: 0.3,
    skill_gap: 2,
    overall_performance: 8,
  };

  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url.includes("/players")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPlayers,
        });
      }

      if (url.includes("/assessments")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockAssessment,
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test 1: Loading
  test("shows loading initially", () => {
    render(
      <BrowserRouter>
        <PlayerReadiness />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Loading player readiness/i)
    ).toBeInTheDocument();
  });

  // ✅ Test 2: Data render
  test("renders player readiness data", async () => {
    render(
      <BrowserRouter>
        <PlayerReadiness />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Messi")).toBeInTheDocument()
    );

    expect(screen.getByText("Forward")).toBeInTheDocument();
    expect(screen.getByText("80 / 100")).toBeInTheDocument();
    expect(screen.getByText("0.3 / 1")).toBeInTheDocument();
    expect(screen.getByText("2 / 10")).toBeInTheDocument();
    expect(screen.getByText("8 / 10")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  // ✅ Test 3: Missing assessment
  test("handles missing assessment", async () => {
    fetch.mockImplementation((url) => {
      if (url.includes("/players")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPlayers,
        });
      }

      if (url.includes("/assessments")) {
        return Promise.resolve({ ok: false });
      }
    });

    render(
      <BrowserRouter>
        <PlayerReadiness />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Messi")).toBeInTheDocument()
    );

    const naElements = await screen.findAllByText(/N\/A/i);
    expect(naElements.length).toBeGreaterThan(1);
  });

  // ✅ Test 4: Player not found
  test("handles player not found", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <BrowserRouter>
        <PlayerReadiness />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/Player not found/i)
    ).toBeInTheDocument();
  });

  // ✅ Test 5: Navigation
  test("buttons navigate correctly", async () => {
    render(
      <BrowserRouter>
        <PlayerReadiness />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Messi")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/Back to Profile/i));
    expect(mockNavigate).toHaveBeenCalledWith("/players/1");

    fireEvent.click(screen.getByText(/Update Assessment/i));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/players/1/update-assessment"
    );
  });
});