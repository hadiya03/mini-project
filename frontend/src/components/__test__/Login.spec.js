import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import axios from "axios";
import "@testing-library/jest-dom";

// ✅ Mock dependencies
jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from "sonner";

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // ✅ FIX 1: Use role instead of text
  test("renders login form", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  // ✅ Helper to fill form
  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
  };

  // ✅ FIX 2: Click button by ROLE (not text)
  test("successful login (trainer role)", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "Login success",
        token: "abc123",
        user: { role: "trainer" },
      },
    });

    render(<Login />);
    fillForm();

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBe("abc123");
      expect(mockNavigate).toHaveBeenCalledWith("/trainer-dashboard");
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test("successful login (analyst role)", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "Login success",
        token: "xyz",
        user: { role: "analyst" },
      },
    });

    render(<Login />);
    fillForm();

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/analyst-dashboard");
    });
  });

  test("failed login (server response)", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: "Invalid credentials",
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("network error", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Server error" } },
    });

    render(<Login />);
    fillForm();

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });
});