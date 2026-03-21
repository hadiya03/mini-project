import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import TrainingSessionsT from "../pages/TrainingSessionsT";

/* ================= MOCKS ================= */

// ✅ toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// ✅ IMPORTANT FIX: define mocks OUTSIDE
const mockSave = jest.fn();
const mockText = jest.fn();

// ✅ jsPDF mock (correct)
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    text: mockText,
    save: mockSave,
  }));
});

// ✅ autoTable
jest.mock("jspdf-autotable", () => jest.fn());

// ✅ fetch
global.fetch = jest.fn();

/* ================= TEST ================= */

describe("TrainingSessions Component", () => {
  const mockSessions = [
    {
      id: 1,
      session_date: "2024-01-01",
      duration_minutes: 50,
      distance_km: 5,
      sprint_count: 10,
      rpe: 5,
      minutes_played: 60,
    },
    {
      id: 2,
      session_date: "2024-01-02",
      duration_minutes: 150,
      distance_km: 8,
      sprint_count: 40,
      rpe: 7,
      minutes_played: 110,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockSessions,
    });
  });

  const renderComponent = async () => {
    await act(async () => {
      render(<TrainingSessionsT />);
    });

    await screen.findByText("2024-01-01");
  };

  /* ================= TEST CASES ================= */

  test("renders fetched sessions", async () => {
    await renderComponent();

    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getByText("2024-01-02")).toBeInTheDocument();
  });

  test("shows alert banner when risk exists", async () => {
    await renderComponent();

    expect(
      screen.getByText(/Some sessions show fatigue or injury risk/i)
    ).toBeInTheDocument();
  });

  test("validates form before saving", async () => {
    await act(async () => {
      render(<TrainingSessionsT />);
    });

    fireEvent.click(screen.getByText("Save"));

    const { toast } = require("sonner");
    expect(toast.error).toHaveBeenCalledWith("Date and Duration required");
  });

  test("saves new session", async () => {
    await renderComponent();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 3,
        session_date: "2024-01-03",
        duration_minutes: 60,
        rpe: 5,
      }),
    });

    fireEvent.change(screen.getByLabelText(/Session Date/i), {
      target: { value: "2024-01-03" },
    });

    fireEvent.change(screen.getByLabelText(/Duration/i), {
      target: { value: "60" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/training-sessions",
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });

  /* ✅ FIXED TEST */
  test("exports PDF", async () => {
    await renderComponent();

    fireEvent.click(screen.getByText(/Export PDF/i));

    expect(mockSave).toHaveBeenCalledWith(
      "training-sessions-report.pdf"
    );
  });

  test("renders risk status correctly", async () => {
    await renderComponent();

    expect(screen.getByText(/Normal/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /Overtraining Risk|High Fatigue|Sprint Strain|Match Overload/i
      )
    ).toBeInTheDocument();
  });

  test("reset form on cancel", async () => {
    await act(async () => {
      render(<TrainingSessionsT />);
    });

    const dateInput = screen.getByLabelText(/Session Date/i);

    fireEvent.change(dateInput, {
      target: { value: "2024-01-05" },
    });

    fireEvent.click(screen.getByText("Cancel"));

    expect(dateInput.value).toBe("");
  });
});