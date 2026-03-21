import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ForgotPassword from "../ForgotPassword";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers(); // for setTimeout
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("ForgotPassword Component", () => {
  test("renders form elements", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter registered email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send otp/i })).toBeInTheDocument();
  });

  test("allows typing email", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/enter registered email/i);
    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    expect(emailInput.value).toBe("test@mail.com");
  });

  test("successful OTP sends and navigates after timeout", async () => {
    axios.post.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/enter registered email/i);
    const submitButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.click(submitButton);

    // Wait for message to appear
    await waitFor(() => {
      expect(screen.getByText(/otp sent to your email/i)).toBeInTheDocument();
    });

    // Fast-forward setTimeout
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/reset-password", { state: { email: "test@mail.com" } });
  });

  test("shows error message if email not found", async () => {
    axios.post.mockRejectedValueOnce(new Error("Not found"));
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/enter registered email/i);
    const submitButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: "wrong@mail.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email not found/i)).toBeInTheDocument();
    });

    // Navigate should not be called
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});