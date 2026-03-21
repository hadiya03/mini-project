import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ResetPassword from "../ResetPassword";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

// Mock useNavigate and useLocation
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({ state: { email: "test@mail.com" } }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("ResetPassword Component", () => {
  test("renders form elements correctly", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    // ✅ Target heading and button separately to avoid duplicate text issue
    expect(screen.getByRole("heading", { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/registered email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter otp/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  test("allows typing into fields", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/registered email/i);
    const otpInput = screen.getByPlaceholderText(/enter otp/i);
    const passwordInput = screen.getByPlaceholderText(/new password/i);

    fireEvent.change(emailInput, { target: { value: "user@mail.com" } });
    fireEvent.change(otpInput, { target: { value: "1234" } });
    fireEvent.change(passwordInput, { target: { value: "newpass" } });

    expect(emailInput.value).toBe("user@mail.com");
    expect(otpInput.value).toBe("1234");
    expect(passwordInput.value).toBe("newpass");
  });

  test("successful reset shows message and navigates after timeout", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Password reset successful" } });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/registered email/i), { target: { value: "test@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter otp/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: "newpass" } });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/l");
  });

  test("failed reset shows server error message", async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: "Invalid OTP" } } });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/registered email/i), { target: { value: "test@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter otp/i), { target: { value: "0000" } });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: "newpass" } });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
    });

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test("failed reset without server response shows default error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/registered email/i), { target: { value: "test@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter otp/i), { target: { value: "0000" } });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: "newpass" } });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/reset failed/i)).toBeInTheDocument();
    });

    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});