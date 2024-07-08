import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderSection from '@/components/landing-page/header-section';


jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string, alt: string }) => <img src={src} alt={alt} />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: { children: React.ReactNode, className?: string }) => <button className={className}>{children}</button>,
}));

describe('HeaderSection', () => {
  it('renders the main header', () => {
    render(<HeaderSection />);
    const header = screen.getByRole('heading', { name: /Startup Planner/i });
    expect(header)
  });

  it('renders the subheader paragraph', () => {
    render(<HeaderSection />);
    const subheader = screen.getByText(/The AI-driven tool for entrepreneurs and small business owners./i);
    expect(subheader)
  });

  it('renders the Sign up button', () => {
    render(<HeaderSection />);
    const signUpButton = screen.getByRole('button', { name: /Sign up/i });
    expect(signUpButton)
  });

  it('renders the Learn More button', () => {
    render(<HeaderSection />);
    const learnMoreButton = screen.getByRole('button', { name: /Learn More/i });
    expect(learnMoreButton)
  });

  it('renders the hero image with correct attributes', () => {
    render(<HeaderSection />);
    const heroImage = screen.getByRole('img', { name: /Startup Planner App Hero Image/i });
    expect(heroImage)
    expect(heroImage.getAttribute('src')).toContain('/hero-img.webp');
    expect(heroImage).toHaveProperty('alt', 'Startup Planner App Hero Image');
  });
});

