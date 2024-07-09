import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardNav from "@/components/dashboard/navbar";

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, ...rest }) => <a {...rest}>{children}</a>;
});

describe("DashboardNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the navigation links", () => {
    render(<DashboardNav />);

    expect(screen.getByText("BizPlanner")).toBeInTheDocument();
    expect(screen.getByText("Business Plan Creator")).toBeInTheDocument();
    expect(screen.getByText("Marketing Content Creator")).toBeInTheDocument();
    expect(screen.getByText("Logo Creator")).toBeInTheDocument();
  });

  it("should render the avatar image", () => {
    render(<DashboardNav />);

    expect(screen.getByRole("img", { name: "Avatar" })).toBeInTheDocument();
  });

});

