import React from 'react';
import { render, screen } from '@testing-library/react';
import FooterSection from '@/components/landing-page/footer-section';

jest.mock('@/components/icons/mountain-icon', () => ({
  __esModule: true,
  default: ({ className }: { className: string }) => <div className={className} data-testid="mountain-icon" />,
}));

describe('FooterSection', () => {
  it('renders the Startup Planner logo with icon', () => {
    render(<FooterSection />);
    const logoLink = screen.getByRole('link', { name: /Startup Planner/i });
    expect(logoLink)
    expect(screen.getByTestId('mountain-icon'))
  });

  it('renders the copyright text', () => {
    render(<FooterSection />);
    expect(screen.getByText(/© 2024 Startup Planner Inc./i))
  });

  it('renders the Privacy Policy link', () => {
    render(<FooterSection />);
    const privacyLink = screen.getByRole('link', { name: /Privacy Policy/i });
    expect(privacyLink)
    expect(privacyLink.getAttribute('href')).toContain('#');

  });

  it('renders the Terms of Service link', () => {
    render(<FooterSection />);
    const termsLink = screen.getByRole('link', { name: /Terms of Service/i });
    expect(termsLink).toHaveProperty('href', 'http://localhost/#');
    expect(termsLink.getAttribute('href')).toContain('#');

  });

  it('renders the Contact Us link', () => {
    render(<FooterSection />);
    const contactLink = screen.getByRole('link', { name: /Contact Us/i });
    expect(contactLink)
    expect(contactLink.getAttribute('href')).toContain('#');

  });
});

