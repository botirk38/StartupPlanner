
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNav from '@/components/dashboard/mobile-nav';

describe('MobileNav', () => {
  it('renders the MobileNav component correctly', () => {
    render(<MobileNav />);
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  it('opens the sheet when menu button is clicked', () => {
    render(<MobileNav />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders the navigation links correctly', () => {
    render(<MobileNav />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByText(/acme inc/i)).toBeInTheDocument();
    expect(screen.getByText(/business plan/i)).toBeInTheDocument();
    expect(screen.getByText(/copywriting/i)).toBeInTheDocument();
    expect(screen.getByText(/branding/i)).toBeInTheDocument();
  });

  it('renders the DashboardSettings component correctly', () => {
    render(<MobileNav />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});

