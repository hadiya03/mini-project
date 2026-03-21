import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import Chatbot from "../Chatbot";
import "@testing-library/jest-dom";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const openChat = () => {
  render(<Chatbot />);
  const toggleBtn = screen.getByText("🤖");
  fireEvent.click(toggleBtn);
};

describe("Chatbot Component", () => {
  test("opens chat window", () => {
    openChat();

    expect(
      screen.getByText("🤖 AI Football Assistant")
    ).toBeInTheDocument();
  });

  test("sends message on Enter key", async () => {
    openChat();

    const input = screen.getByPlaceholderText(/Ask me anything/i);

    // type message
    fireEvent.change(input, { target: { value: "training" } });

    // press Enter
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // ✅ FAST-FORWARD TIME (IMPORTANT FIX)
    await act(async () => {
      jest.advanceTimersByTime(2000); // covers random delay
    });

    // ✅ now message WILL exist
    await waitFor(() => {
      expect(
        screen.getByText(/Training sessions are available/i)
      ).toBeInTheDocument();
    });
  });
});