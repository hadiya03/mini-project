// src/components/__test__/PlayersT.spec.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import PlayersT from "../pages/PlayersT";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null, pathname: "/trainer-players" }),
}));

// ✅ Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ✅ Mock fetch
global.fetch = jest.fn();

describe("PlayersT Component", () => {
  const mockPlayers = [
    {
      id: 1,
      name: "Messi",
      position: "Forward",
      age: 35,
      current_team: "PSG",
      profile_image: "https://example.com/messi.jpg",
    },
    {
      id: 2,
      name: "Ronaldo",
      position: "Forward",
      age: 38,
      current_team: "Al-Nassr",
      profile_image: "https://example.com/ronaldo.jpg",
    },
  ];

  // ✅ Silence console errors (important fix)
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    fetch.mockImplementation((url, options) => {
      // GET players
      if (
        url.includes("/trainer-players") &&
        (!options || options.method === "GET")
      ) {
        return Promise.resolve({
          ok: true,
          json: async () => mockPlayers,
        });
      }

      // DELETE player
      if (
        url.includes("/trainer-playersdelete/") &&
        options?.method === "DELETE"
      ) {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({ ok: false });
    });

    jest.spyOn(window, "confirm").mockImplementation(() => true);
  });

  // ✅ No manual act needed — RTL handles it internally
  const renderComponent = async () => {
    render(
      <BrowserRouter>
        <PlayersT />
      </BrowserRouter>
    );

    // Wait for UI to load
    await screen.findByText("Messi");
  };

  test("renders players list after fetch", async () => {
    await renderComponent();

    expect(screen.getByText("Messi")).toBeInTheDocument();
    expect(screen.getByText("Ronaldo")).toBeInTheDocument();

    // Multiple "Forward"
    expect(screen.getAllByText("Forward")).toHaveLength(2);

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
      expect(toast.success).toHaveBeenCalledWith(
        "Player deleted successfully"
      );
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/trainer-playersdelete/1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("navigates to player profile", async () => {
    await renderComponent();

    const playerCard = screen
      .getByText("Messi")
      .closest(".player-card");

    fireEvent.click(playerCard);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/trainer-playerprofile/1"
    );
  });

  test("shows 'No players found' if empty list", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    );

    render(
      <BrowserRouter>
        <PlayersT />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/No players found/i)
    ).toBeInTheDocument();
  });

  test("shows error message on fetch failure", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    render(
      <BrowserRouter>
        <PlayersT />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/Failed to load players/i)
    ).toBeInTheDocument();
  });
});