import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react";
import ManageUsers from "../ManageUsers";
import axios from "axios";
import "@testing-library/jest-dom";

// ✅ Mock axios
jest.mock("axios");

// ✅ Mock confirm dialog
global.confirm = jest.fn();

// ✅ Silence console errors
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@mail.com",
    password: "123456",
    otp: "1111",
    is_verified: true,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@mail.com",
    password: "abcdef",
    otp: "2222",
    is_verified: false,
    created_at: "2024-01-02T12:00:00Z",
  },
];

describe("ManageUsers Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TEST 1: Initial render (without loading text)
  test("renders table and heading initially", async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      render(<ManageUsers />);
    });

    // Instead of checking "Loading users", check heading and table exist
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  // ✅ TEST 2: Fetch users
  test("renders users after fetch", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });

    await act(async () => {
      render(<ManageUsers />);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText(/yes/i)).toBeInTheDocument();
      expect(screen.getByText(/no/i)).toBeInTheDocument();
    });
  });

  // ✅ TEST 3: Delete user (confirmed)
  test("deletes user when confirmed", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    axios.delete.mockResolvedValue({});
    global.confirm.mockReturnValue(true);

    await act(async () => {
      render(<ManageUsers />);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/1"
      );
    });
  });

  // ✅ TEST 4: Cancel delete
  test("does not delete if confirm is false", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    global.confirm.mockReturnValue(false);

    await act(async () => {
      render(<ManageUsers />);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(axios.delete).not.toHaveBeenCalled();
  });

  // ✅ TEST 5: Toggle verify
  test("toggles verify status", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    axios.put.mockResolvedValue({});

    await act(async () => {
      render(<ManageUsers />);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByRole("button", {
      name: /toggle verify/i,
    });

    fireEvent.click(toggleButtons[0]);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/verify/1",
        { is_verified: false }
      );
    });
  });

  // ✅ TEST 6: API error handling
  test("handles fetch error gracefully", async () => {
    axios.get.mockRejectedValue(new Error("API error"));

    await act(async () => {
      render(<ManageUsers />);
    });

    await waitFor(() => {
      // Ensure the heading is still present
      expect(screen.getByText("Manage Users")).toBeInTheDocument();
    });
  });
});