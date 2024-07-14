import React from 'react';
import { render, screen } from '@testing-library/react';
import { Business } from '@/utils/types';
import { StartupOverview } from '@/components/dashboard/startup-overview';

// Mock business object
const mockBusiness: Business = {
  id: 1,
  name: 'Test Business',
  description: 'A test business description',
  long_description: 'A more detailed description of the test business',
  industry: 'Tech',
  stage: 'Growth',
  stage_description: 'The business is in the growth stage',
  funding_amount: 1000000,
  team_size: 10,
  founding_date: '2020-01-01',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
  user_id: 1,
};

describe('StartupOverview', () => {
  test('renders business name and description', () => {
    render(<StartupOverview business={mockBusiness} />);
    expect(screen.getByText(mockBusiness.name)).toBeInTheDocument();
    expect(screen.getByText(mockBusiness.description)).toBeInTheDocument();
  });

  test('renders founding date and stage badge', () => {
    render(<StartupOverview business={mockBusiness} />);
    expect(screen.getByText(/founded: 2020-01-01/i)).toBeInTheDocument();
    expect(screen.getAllByText(mockBusiness.stage)).toHaveLength(3);
  });

  test('renders funding amount and team size', () => {
    render(<StartupOverview business={mockBusiness} />);
    expect(screen.getByText(/\$1,000,000/i)).toBeInTheDocument();
    expect(screen.getByText(mockBusiness.team_size.toString())).toBeInTheDocument();
  });

  test('renders current stage and stage description', () => {
    render(<StartupOverview business={mockBusiness} />);
    expect(screen.getAllByText(mockBusiness.stage)[1]).toBeInTheDocument();
    if (mockBusiness.stage_description) {
      expect(screen.getByText(mockBusiness.stage_description)).toBeInTheDocument();
    }
  });

  test('renders progress bar with correct width', () => {
    render(<StartupOverview business={mockBusiness} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle(`width: 75%`);
  });

  test('renders about section with long description', () => {
    render(<StartupOverview business={mockBusiness} />);
    expect(screen.getByText(/about test business/i)).toBeInTheDocument();
    if (mockBusiness.long_description) {
      expect(screen.getByText(mockBusiness.long_description)).toBeInTheDocument();
    }
  });
});

