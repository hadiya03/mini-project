import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import UpdateAssessment from "../pages/UpdateAssessment";

/* ================= MOCKS ================= */

// ✅ router
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

// ✅ toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// ✅ fetch
global.fetch = jest.fn();

/* ================= HELPERS ================= */

// ✅ COMPLETE DATA (for normal tests)
const completeMocks = () => {
  fetch
    // metrics
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rpe: 5,
        sleep: 7,
        tiredness: 3,
        soreness: 2,
      }),
    })
    // profile
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Messi" }),
    })
    // training
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ duration_minutes: 60 }),
    })
    // avg load
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ averageLoad: 100 }),
    });
};

// ✅ INCOMPLETE DATA (for email reminder test)
const incompleteMocks = () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => null, // ❌ no metrics
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Messi" }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ averageLoad: 0 }),
    });
};

const renderComponent = async () => {
  await act(async () => {
    render(<UpdateAssessment />);
  });
};

/* ================= TESTS ================= */

describe("UpdateAssessment Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders player data", async () => {
    completeMocks();

    await renderComponent();

    expect(await screen.findByText(/Messi/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // RPE
  });

  test("shows email reminder when metrics incomplete", async () => {
    incompleteMocks();

    await renderComponent();

    expect(
      await screen.findByText(/Email Reminder/i)
    ).toBeInTheDocument();
  });

  test("sends email reminder", async () => {
    incompleteMocks();

    await renderComponent();

    // mock POST call
    fetch.mockResolvedValueOnce({ ok: true });

    fireEvent.click(await screen.findByText(/Email Reminder/i));

    const { toast } = require("sonner");

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Reminder email sent successfully!"
      );
    });
  });

  test("validates analyst inputs before sync", async () => {
    completeMocks();

    await renderComponent();

    fireEvent.click(
      screen.getByText(/Calculate & Sync to Player Dashboard/i)
    );

    const { toast } = require("sonner");

    expect(toast.error).toHaveBeenCalledWith(
      "Please fill all analyst performance fields!"
    );
  });

  test("handles sync failure", async () => {
    completeMocks();

    await renderComponent();

    // fill all analyst inputs
    const inputs = screen.getAllByPlaceholderText("0 - 10");

    inputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "8" } });
    });

    // mock failed API
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    fireEvent.click(
      screen.getByText(/Calculate & Sync to Player Dashboard/i)
    );

    const { toast } = require("sonner");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Sync failed on server."
      );
    });
  });

  test("handles successful sync", async () => {
    completeMocks();

    await renderComponent();

    const inputs = screen.getAllByPlaceholderText("0 - 10");

    inputs.forEach((input) => {
      fireEvent.change(input, { target: { value: "8" } });
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        trainingLoad: 300,
        recovery: 80,
        fatigue: 20,
        readiness: 75,
        overallPerformance: 85,
        skillGap: 10,
        injuryRisk: "Low",
        injuryLevel: "Safe",
      }),
    });

    fireEvent.click(
      screen.getByText(/Calculate & Sync to Player Dashboard/i)
    );

    const { toast } = require("sonner");

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Assessment synced and update email sent!"
      );
    });

    expect(await screen.findByText(/Training Load/i)).toBeInTheDocument();
  });
});