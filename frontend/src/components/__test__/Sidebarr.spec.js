import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Sidebarr from "../Sidebarr";

describe("Sidebarr Component", () => {
  const menuItems = [
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Analytics", path: "/analytics" },
    { name: "Manage Users", path: "/manage-users" },
    { name: "System Logs", path: "/system-logs" },
  ];

  test("renders all menu items", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebarr />
      </MemoryRouter>
    );

    // Check title
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();

    // Check all menu items exist
    menuItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  test("highlights active link based on location.pathname", () => {
    const activePath = "/manage-users";

    render(
      <MemoryRouter initialEntries={[activePath]}>
        <Sidebarr />
      </MemoryRouter>
    );

    // Active link should have the active style color
    const activeLink = screen.getByText("Manage Users");
    expect(activeLink).toHaveStyle("color: #10b981");
    expect(activeLink).toHaveStyle("background: #111827");

    // Other links should not have active styles
    menuItems
      .filter((item) => item.path !== activePath)
      .forEach((item) => {
        const link = screen.getByText(item.name);
        expect(link).not.toHaveStyle("color: #10b981");
        expect(link).not.toHaveStyle("background: #111827");
      });
  });

  test("links have correct href attributes", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebarr />
      </MemoryRouter>
    );

    menuItems.forEach((item) => {
      const link = screen.getByText(item.name);
      expect(link.getAttribute("href")).toBe(item.path);
    });
  });
});