import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../styles/Header"; // adjust path if needed

describe("Header Component", () => {
  test("renders header text correctly", () => {
    render(<Header />);

    expect(
      screen.getByText(/Analyst Dashboard/i)
    ).toBeInTheDocument();
  });

  test("renders header element", () => {
    render(<Header />);

    const headerElement = screen.getByRole("banner"); // <header> tag
    expect(headerElement).toBeInTheDocument();
  });

  test("applies correct styles", () => {
    render(<Header />);

    const headerElement = screen.getByRole("banner");

    expect(headerElement).toHaveStyle({
      background: "#1f2531",
      color: "#fff",
      padding: "15px",
    });
  });
});