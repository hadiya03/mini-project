import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../Navbar";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("Navbar Component", () => {
  test("renders Register and Login links when no token", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  test("renders Logout button when token exists", () => {
    localStorage.setItem("token", "fake-token");
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/register/i)).not.toBeInTheDocument();
  });

  test("clicking Logout calls fetch, clears localStorage, and navigates", async () => {
    // Set token and user
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("user", JSON.stringify({ id: 123 }));

    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    await waitFor(() => {
      // Fetch called with correct payload
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/logout",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: 123 }),
        })
      );

      // localStorage cleared
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();

      // Navigate called with "/l"
      expect(mockedNavigate).toHaveBeenCalledWith("/l");
    });
  });

  test("handles missing user gracefully on logout", async () => {
    localStorage.setItem("token", "fake-token");
    localStorage.removeItem("user");

    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    await waitFor(() => {
      // fetch should not be called because user is missing
      expect(fetch).not.toHaveBeenCalled();

      // localStorage cleared
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();

      // Navigate called
      expect(mockedNavigate).toHaveBeenCalledWith("/l");
    });
  });

  test("handles fetch error gracefully", async () => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("user", JSON.stringify({ id: 123 }));

    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    await waitFor(() => {
      // localStorage still cleared
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();

      // Navigate still called
      expect(mockedNavigate).toHaveBeenCalledWith("/l");
    });
  });
});