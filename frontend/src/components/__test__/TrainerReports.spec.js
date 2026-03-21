import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TrainerReports from "../pages/TrainerReports";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock recharts (VERY IMPORTANT to avoid errors)
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>Grid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

// ✅ Mock useLocation
const mockUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => mockUseLocation(),
}));

describe("TrainerReports Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (pathname = "/reports") => {
    mockUseLocation.mockReturnValue({ pathname });

    render(
      <BrowserRouter>
        <TrainerReports />
      </BrowserRouter>
    );
  };

  test("renders main headings", () => {
    renderComponent();

    expect(screen.getByText(/Reports Overview/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Generate and analyze comprehensive reports/i)
    ).toBeInTheDocument();
  });

  test("renders filter dropdowns and buttons", () => {
    renderComponent();

    expect(screen.getByText(/All Players/i)).toBeInTheDocument();
    expect(screen.getByText(/All Teams/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
  });

  test("calls window.print on Export PDF click", () => {
    renderComponent();

    const printMock = jest.spyOn(window, "print").mockImplementation(() => {});

    fireEvent.click(screen.getByText(/Export PDF/i));

    expect(printMock).toHaveBeenCalled();
  });

  test("renders report cards", () => {
    renderComponent();

    expect(
      screen.getByText(/Monthly Performance Overview/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Player Readiness Trends/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Injury Risk Assessment/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Team Workload Analysis/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Player Performance Trend/i)
    ).toBeInTheDocument();
  });

  test("shows Scheduled Reports section when NOT trainer", () => {
    renderComponent("/reports"); // not trainer

    expect(screen.getByText(/Scheduled Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule Report/i)).toBeInTheDocument();
  });

  test("hides Scheduled Reports section for trainer route", () => {
    renderComponent("/trainer-reports"); // trainer

    expect(
      screen.queryByText(/Scheduled Reports/i)
    ).not.toBeInTheDocument();
  });
});