import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/components/landing-page';

describe('LandingPage', () => {
  it('renders the HeaderSection', () => {
    render(<LandingPage />);
    expect(screen.getByText(/The AI-driven tool for entrepreneurs and small business owners./i))
  });

  it('renders the FeaturesSection', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Powerful Features/i));
    expect(screen.getByText(/Canva Startup Planner offers a suite of AI-driven tools to help you succeed./i)); expect(screen.getByText(/Generate a comprehensive business plan with just a few clicks./i))
  });

  it('renders the AboutSection', () => {
    render(<LandingPage />);
    expect(screen.getByText(/About Canva Startup Planner/i))
  });

  it('renders the FooterSection', () => {
    render(<LandingPage />);
    expect(screen.getByText(/© 2024 Startup Planner Inc./i))
  });
});

