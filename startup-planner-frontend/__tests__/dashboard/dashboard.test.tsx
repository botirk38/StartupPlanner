import React from "react";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/components/dashboard";

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the card title and description", () => {
    render(<Dashboard />);

    expect(screen.getByText("Business Plan Generator")).toBeInTheDocument();
    expect(screen.getByText("Create a professional business plan in minutes.")).toBeInTheDocument();
  });

  it("should render the input and textarea elements", () => {
    render(<Dashboard />);

    expect(screen.getByPlaceholderText("Business Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Business Description")).toBeInTheDocument();
  });

  it("should render the generate plan button", () => {
    render(<Dashboard />);

    expect(screen.getByText("Generate Plan")).toBeInTheDocument();
  });

  it("should apply dark mode styles correctly", () => {
    render(<Dashboard />);

    expect(screen.getByText("Business Plan Generator")).toHaveClass("dark:text-gray-100");
    expect(screen.getByText("Create a professional business plan in minutes.")).toHaveClass("dark:text-gray-400");
    expect(screen.getByPlaceholderText("Business Name")).toHaveClass("dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-white");
    expect(screen.getByPlaceholderText("Business Description")).toHaveClass("dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-white");
    expect(screen.getByText("Generate Plan")).toHaveClass("dark:text-white dark:bg-blue-700 dark:hover:bg-blue-800");
  });
});

