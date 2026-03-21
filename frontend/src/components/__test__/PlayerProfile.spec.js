import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlayerProfile from "../pages/PlayerProfile";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock react-router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "1" }),
}));

// ✅ Mock fetch
global.fetch = jest.fn();

describe("PlayerProfile Component", () => {

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

    // initial loading
    expect(screen.getByText(/Loading player/i)).toBeInTheDocument();

    // wait for data to load → removes act warning
    await screen.findByText("Messi");
  });

  // ✅ Test 2: Player data renders
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

  // ✅ Test 3: Edit mode toggles
  test("enters edit mode when clicking Edit Profile", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    const editBtn = await screen.findByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    // inputs appear
    expect(await screen.findByDisplayValue("Messi")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Forward")).toBeInTheDocument();
  });

  // ✅ Test 4: Save button works (PUT request)
  test("updates player on save", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayer,
      }) // initial fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPlayer, name: "Messi Updated" }),
      }); // PUT response

    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    const editBtn = await screen.findByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    const nameInput = await screen.findByDisplayValue("Messi");
    fireEvent.change(nameInput, {
      target: { value: "Messi Updated" },
    });

    const saveBtn = screen.getByText(/Save/i);
    fireEvent.click(saveBtn);

    // wait for PUT call (no manual act needed)
    await screen.findByText("Messi Updated");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/players/1"),
      expect.objectContaining({
        method: "PUT",
      })
    );
  });

  // ✅ Test 5: Back button exists
  test("back button is rendered", async () => {
    render(
      <BrowserRouter>
        <PlayerProfile />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Back to Players/i)).toBeInTheDocument();
  });

});