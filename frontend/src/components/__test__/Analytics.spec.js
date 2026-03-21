import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import Analytics from "../Analytics";
import "@testing-library/jest-dom";

// ✅ MOCK fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        weeklyLogins: [10, 20, 30],
      }),
  })
);

// ✅ COMPLETE Chart.js MOCK (FIXED)
jest.mock("react-chartjs-2", () => ({
  __esModule: true,
  Line: () => <div>Mock Chart</div>,
  Bar: () => <div>Mock Chart</div>,
  Pie: () => <div>Mock Chart</div>,
  Doughnut: () => <div>Mock Chart</div>,
  default: () => <div>Mock Chart</div>,
}));

describe("Analytics Component", () => {
  test("renders analytics data", async () => {
    await act(async () => {
      render(<Analytics />);
    });

   await waitFor(() => {
  const charts = screen.getAllByText(/mock chart/i);
  expect(charts.length).toBeGreaterThan(0);
});
  });
});