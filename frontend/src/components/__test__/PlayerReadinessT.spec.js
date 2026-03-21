import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import PlayerReadinessT from "../pages/PlayerReadinessT";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

// ✅ Mock toast
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// ✅ Mock fetch
global.fetch = jest.fn();

describe("PlayerReadinessT Component", () => {
  const mockPlayers = [{ id: 1, player_id: 1, name: "Messi", position: "Forward" }];
  const mockAssessment = { readiness: 80, fatigue: 0.3, skill_gap: 2, overall_performance: 8 };

  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url.includes("/players")) {
        return Promise.resolve({ ok: true, json: async () => mockPlayers });
      }
      if (url.includes("/assessments")) {
        return Promise.resolve({ ok: true, json: async () => mockAssessment });
      }
      if (url.includes("/trainer/message")) {
        return Promise.resolve({ ok: true, json: async () => ({}) });
      }
    });
  });

  afterEach(() => jest.clearAllMocks());

  const renderAndWait = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PlayerReadinessT />
        </BrowserRouter>
      );
    });

    // ✅ Use regex to avoid splitting issues
    await screen.findByText(/Messi/i);
  };

  test("renders player readiness data", async () => {
    await renderAndWait();

    expect(screen.getByText(/Forward/i)).toBeInTheDocument();
    expect(screen.getByText(/80\s*\/\s*100/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.3\s*\/\s*1/i)).toBeInTheDocument();
    expect(screen.getByText(/2\s*\/\s*10/i)).toBeInTheDocument();
    expect(screen.getByText(/8\s*\/\s*10/i)).toBeInTheDocument();
    expect(screen.getByText(/Good/i)).toBeInTheDocument();
  });

  test("handles missing assessment", async () => {
    fetch.mockImplementation((url) => {
      if (url.includes("/players")) return Promise.resolve({ ok: true, json: async () => mockPlayers });
      if (url.includes("/assessments")) return Promise.resolve({ ok: false });
    });

    await renderAndWait();

    expect(screen.getAllByText(/N\/A/i).length).toBeGreaterThan(1);
  });

  test("player not found", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    await act(async () => {
      render(
        <BrowserRouter>
          <PlayerReadinessT />
        </BrowserRouter>
      );
    });

    expect(await screen.findByText(/Player not found/i)).toBeInTheDocument();
  });

  test("sends message successfully", async () => {
    await renderAndWait();

    const textarea = screen.getByPlaceholderText(/Write recovery advice/i);
    fireEvent.change(textarea, { target: { value: "Take rest" } });

    const sendBtn = screen.getByRole("button", { name: /Send Message/i });
    fireEvent.click(sendBtn);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/trainer/message/1"),
        expect.objectContaining({ method: "POST" })
      )
    );
  });

  test("back button navigates correctly", async () => {
    await renderAndWait();

    fireEvent.click(screen.getByText(/Back to Profile/i));
    expect(mockNavigate).toHaveBeenCalledWith("/trainer-playerprofile/1");
  });
});