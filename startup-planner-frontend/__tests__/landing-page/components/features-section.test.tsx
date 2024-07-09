import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '@/components/landing-page/features-section';

describe('FeaturesSection', () => {
  it('renders the section heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Powerful Features/i))
  });

  it('renders the Business Plan Generator feature', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Business Plan Generator/i))
    expect(screen.getByText(/Generate a comprehensive business plan with just a few clicks./i))
  });

  it('renders the Copywriting Tool feature', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Copywriting Tool/i))
    expect(screen.getByText(/Create compelling copy for your website, marketing materials, and more./i))
  });

  it('renders the Logo and Branding Generator feature', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Logo and Branding Generator/i))
    expect(screen.getByText(/Generate professional logos and branding assets for your business./i))
  });
});

