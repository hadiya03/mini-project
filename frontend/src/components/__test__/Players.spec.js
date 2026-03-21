import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Players from "../pages/Players";
import { BrowserRouter } from "react-router-dom";

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null, pathname: "/players" }),
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock fetch
global.fetch = jest.fn();

describe("Players Component", () => {
  const mockPlayers = [
    { id: 1, name: "Messi", position: "Forward", age: 35, current_team: "PSG", profile_image: "https://example.com/messi.jpg" },
    { id: 2, name: "Ronaldo", position: "Forward", age: 38, current_team: "Al-Nassr", profile_image: "https://example.com/ronaldo.jpg" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    fetch.mockImplementation((url, options) => {
      if (url.includes("/players") && (!options || options.method === "GET")) {
        return Promise.resolve({ ok: true, json: async () => mockPlayers });
      }
      if (url.includes("/players/") && options?.method === "DELETE") {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: false });
    });

    jest.spyOn(window, "confirm").mockImplementation(() => true);
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Players />
        </BrowserRouter>
      );
    });
  };

  test("renders players list after fetch", async () => {
    await renderComponent();

    await screen.findByText("Messi");
    await screen.findByText("Ronaldo");

    // Use getAllByText when multiple elements have same text
    const positions = screen.getAllByText("Forward");
    expect(positions).toHaveLength(2);

    expect(screen.getByText("35 years old")).toBeInTheDocument();
    expect(screen.getByText("PSG")).toBeInTheDocument();

    expect(screen.getByText("38 years old")).toBeInTheDocument();
    expect(screen.getByText("Al-Nassr")).toBeInTheDocument();
  });

  test("handles delete player", async () => {
    await renderComponent();

    const deleteButtons = screen.getAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      const { toast } = require("sonner");
      expect(toast.success).toHaveBeenCalledWith("Player deleted successfully");
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/player/players/1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("navigates to player profile", async () => {
    await renderComponent();

    const playerCard = screen.getByText("Messi").closest(".player-card");
    fireEvent.click(playerCard);

    expect(mockNavigate).toHaveBeenCalledWith("/players/1");
  });

  test("navigates to create player page", async () => {
    await renderComponent();

    const createBtn = screen.getByText(/Create Player Profile/i);
    fireEvent.click(createBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/create-player");
  });

  test("shows 'No players found' if empty list", async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: async () => [] }));

    await renderComponent();

    expect(screen.getByText(/No players found/i)).toBeInTheDocument();
  });
});