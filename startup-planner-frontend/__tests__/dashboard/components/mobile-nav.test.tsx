import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNavDashboard from '@/components/dashboard/mobile-nav-dashboard';
import { AccountData } from '@/utils/types';
// Mock the entire next/router module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add any other router methods you use in your component
  }),
}));

const mockAccountData: AccountData = {
  display_name: 'Test User',
  email: 'testuser@example.com',
  bio: 'This is a test bio',
  avatar: 'https://example.com/avatar.jpg',
  has_password_set: true,
};

describe('MobileNav', () => {
  it('renders the MobileNav component correctly', () => {
    render(<MobileNavDashboard accountData={mockAccountData} />);
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  it('opens the sheet when menu button is clicked', () => {
    render(<MobileNavDashboard accountData={mockAccountData} />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders the navigation links correctly', () => {
    render(<MobileNavDashboard accountData={mockAccountData} />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByText(/StartupPlanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Business plan Creator/i)).toBeInTheDocument();
    expect(screen.getByText(/Copywrite Creator/i)).toBeInTheDocument();
    expect(screen.getByText(/Branding Creator/i)).toBeInTheDocument();
  });

  it('renders the DashboardSettings component correctly', () => {
    render(<MobileNavDashboard accountData={mockAccountData} />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});

