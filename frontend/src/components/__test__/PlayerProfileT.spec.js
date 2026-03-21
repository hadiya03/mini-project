import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlayerProfile from "../pages/PlayerProfile";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

// ✅ Mock fetch
global.fetch = jest.fn();

describe("Trainer PlayerProfile Component", () => {
  const mockPlayer = {
    id: 1,
    name: "Messi",
    position: "Forward",
    age: 36,
    email: "messi@gmail.com",
    height: 170,
    weight: 72,
    preferred_foot: "Left",
    current_team: "Inter Miami",
    profile_image: "",
  };

  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockPlayer,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test 1: Loading state (FIXED act warning)
  test("shows loading initially", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading player/i)).toBeInTheDocument();

    // ✅ wait for async state update (removes act warning)
    await screen.findByText("Messi");
  });

  // ✅ Test 2: Data renders correctly
  test("renders player details", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    expect(await screen.findByText("Messi")).toBeInTheDocument();
    expect(await screen.findByText(/Forward/i)).toBeInTheDocument();
    expect(await screen.findByText(/36 years old/i)).toBeInTheDocument();
    expect(await screen.findByText(/Inter Miami/i)).toBeInTheDocument();
  });

  // ✅ Test 3: Edit mode toggle
  test("enters edit mode when Edit Profile is clicked", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    const editBtn = await screen.findByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    expect(screen.getByDisplayValue("Messi")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Forward")).toBeInTheDocument();
  });

  // ✅ Test 4: Save triggers PUT request (FIXED API)
  test("updates player on save", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayer,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPlayer, name: "Updated Messi" }),
      });

    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    const editBtn = await screen.findByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    const nameInput = screen.getByDisplayValue("Messi");
    fireEvent.change(nameInput, {
      target: { value: "Updated Messi" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    // ✅ wait for UI update
    expect(await screen.findByText("Updated Messi")).toBeInTheDocument();

    // ✅ FIX: match YOUR component API (not trainer)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/player/players/1"),
      expect.objectContaining({
        method: "PUT",
      })
    );
  });

  // ✅ Test 5: Cancel button
  test("cancel button exits edit mode", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    const editBtn = await screen.findByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(await screen.findByText(/Edit Profile/i)).toBeInTheDocument();
  });

  // ✅ Test 6: Back button navigation (FIXED path)
  test("back button navigates correctly", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    const backBtn = await screen.findByText(/Back to Players/i);
    fireEvent.click(backBtn);

    // ✅ FIX: match your component
    expect(mockNavigate).toHaveBeenCalledWith("/players");
  });
});