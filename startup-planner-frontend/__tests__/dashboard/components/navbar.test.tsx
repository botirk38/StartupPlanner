import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardNav from "@/components/dashboard/navbar";
import { AccountData } from "@/utils/types";
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/use-toast";
import fetchMock from "jest-fetch-mock";
import { getFallBackName } from '@/utils/client-functions';


const mockAccountData: AccountData = {
  display_name: 'Test User',
  email: 'testuser@example.com',
  bio: 'This is a test bio',
  avatar: 'https://example.com/avatar.jpg',
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, ...rest }: { children: React.ReactNode;[key: string]: any }) => <a {...rest}>{children}</a>;
});

// Mock toast
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

describe("DashboardNav", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  it("should render the navigation links", () => {
    render(<DashboardNav accountData={mockAccountData} />);
    expect(screen.getByText("BizPlanner")).toBeInTheDocument();
    expect(screen.getByText("Business Plan Creator")).toBeInTheDocument();
    expect(screen.getByText("Marketing Content Creator")).toBeInTheDocument();
    expect(screen.getByText("Logo Creator")).toBeInTheDocument();
  });

  it("should render the user avatar", () => {
    render(<DashboardNav accountData={mockAccountData} />);
    const avatar = screen.getByText(getFallBackName(mockAccountData));
    expect(avatar).toBeInTheDocument();
  });

  it("should open dropdown menu on avatar click", async () => {
    render(<DashboardNav accountData={mockAccountData} />);
    const avatar = screen.getByText(getFallBackName(mockAccountData));
    await userEvent.click(avatar);
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it("should navigate to profile page when Settings is clicked", async () => {
    render(<DashboardNav accountData={mockAccountData} />);
    const avatar = screen.getByText(getFallBackName(mockAccountData));
    await userEvent.click(avatar);
    const settingsButton = screen.getByText('Settings');
    await userEvent.click(settingsButton);
    expect(mockPush).toHaveBeenCalledWith("/dashboard/user-profile");
  });

  it("should call logout API and redirect on logout", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    render(<DashboardNav accountData={mockAccountData} />);
    const avatar = screen.getByText(getFallBackName(mockAccountData));
    await userEvent.click(avatar);
    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);

    expect(fetchMock).toHaveBeenCalledWith("/api/logout", expect.any(Object));
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Logout successful",
      }));
      expect(mockPush).toHaveBeenCalledWith("/logout");
    });
  });

  it("should handle logout failure", async () => {
    fetchMock.mockRejectOnce(new Error("Logout failed"));
    render(<DashboardNav accountData={mockAccountData} />);
    const avatar = screen.getByText(getFallBackName(mockAccountData));
    await userEvent.click(avatar);
    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Logout failed",
      }));
    });
  });
});

