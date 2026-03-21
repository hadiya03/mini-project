import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../styles/Sidebar"; // ✅ adjust path if needed

describe("Sidebar Component", () => {
  const renderSidebar = (route = "/") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Sidebar />
      </MemoryRouter>
    );
  };

  test("renders sidebar logo", () => {
    renderSidebar();

    expect(
      screen.getByText(/Apex Athlete/i)
    ).toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Players")).toBeInTheDocument();
    expect(screen.getByText("Training Sessions")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  test("links have correct hrefs", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toHaveAttribute(
      "href",
      "/analyst-dashboard"
    );
    expect(screen.getByText("Players")).toHaveAttribute(
      "href",
      "/players"
    );
    expect(screen.getByText("Training Sessions")).toHaveAttribute(
      "href",
      "/training-sessions"
    );
    expect(screen.getByText("Reports")).toHaveAttribute(
      "href",
      "/reports"
    );
  });

  test("applies active class to current route", () => {
    renderSidebar("/players");

    const playersLink = screen.getByText("Players");

    expect(playersLink.className).toMatch(/active/);
  });

  test("sidebar container is rendered", () => {
    renderSidebar();

    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toBeInTheDocument();
  });
});