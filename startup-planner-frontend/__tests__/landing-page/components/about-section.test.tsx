import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutSection from '@/components/landing-page/about-section';

jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string, alt: string }) => <img src={src} alt={alt} />,
}));

describe('AboutSection', () => {
  it('renders the about image with correct attributes', () => {
    render(<AboutSection />);
    const aboutImage = screen.getByRole('img', { name: /About Canva Startup Planner/i });
    expect(aboutImage).toHaveProperty('alt', 'About Canva Startup Planner');
    expect(aboutImage.getAttribute('src')).toContain('/about-image.webp');
  });

  it('renders the section heading', () => {
    render(<AboutSection />);
    expect(screen.getByRole('heading', { name: /About Canva Startup Planner/i }))
  });

  it('renders the first paragraph', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Canva Startup Planner is an AI-driven platform designed to help entrepreneurs and small business owners streamline their business planning and branding processes./i))
  });

  it('renders the second paragraph', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Our mission is to empower entrepreneurs and small business owners with the tools and resources they need to turn their dreams into reality./i))
  });

  it('renders the sign-up button', () => {
    render(<AboutSection />);
    expect(screen.getByRole('button', { name: /Sign up/i }))
  });
});

