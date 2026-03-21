// src/components/__test__/Signup.spec.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "../Signup";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Signup Component", () => {

  it("renders name, email, password, role and button", () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify otp/i })).toBeInTheDocument();
  });

  it("simulates form input and submission", () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "trainer" } });

    fireEvent.click(screen.getByRole("button", { name: /verify otp/i }));

    const { toast } = require("react-toastify");

    // Assert toast calls instead of window.location.assign
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

});