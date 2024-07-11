import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardNav from "@/components/dashboard/navbar";
import { AccountData } from "@/utils/types";

const mockAccountData: AccountData = {
  display_name: 'Test User',
  email: 'testuser@example.com',
  bio: 'This is a test bio',
  avatar: 'https://example.com/avatar.jpg',
  has_password_set: true,
};

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
    render(<DashboardNav accountData={mockAccountData} />);

    expect(screen.getByText("BizPlanner")).toBeInTheDocument();
    expect(screen.getByText("Business Plan Creator")).toBeInTheDocument();
    expect(screen.getByText("Marketing Content Creator")).toBeInTheDocument();
    expect(screen.getByText("Logo Creator")).toBeInTheDocument();
  });


});

