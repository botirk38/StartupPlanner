import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Business } from '@/utils/types';
import { QuickActions } from '@/components/dashboard/quick-actions';

// Mock business object
const mockBusiness: Business = {
  id: 1,
  name: 'Test Business',
  description: 'A test business description',
  industry: 'Tech',
  stage: 'Growth',
  funding_amount: 1000000,
  team_size: 10,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
  user_id: 1,
  long_description: 'A more detailed description of the test business',
  stage_description: 'The business is in the growth stage',
  founding_date: '2020-01-01',
};

describe('QuickActions', () => {
  test('renders message when no business is selected', () => {
    render(<QuickActions business={null} />);
    expect(screen.getByText(/please select a business to see quick actions/i)).toBeInTheDocument();
  });

  test('renders all action buttons when a business is selected', () => {
    render(<QuickActions business={mockBusiness} />);
    expect(screen.getByText(/generate business plan/i)).toBeInTheDocument();
    expect(screen.getByText(/create logo/i)).toBeInTheDocument();
    expect(screen.getByText(/competitor research/i)).toBeInTheDocument();
    expect(screen.getByText(/marketing content/i)).toBeInTheDocument();
  });

  test('calls correct function when an action button is clicked', () => {
    console.log = jest.fn(); // Mock console.log

    render(<QuickActions business={mockBusiness} />);

    const actions = [
      { label: /generate business plan/i, message: 'Generate Business Plan' },
      { label: /create logo/i, message: 'Create Logo' },
      { label: /competitor research/i, message: 'Competitor Research' },
      { label: /marketing content/i, message: 'Marketing Content' },
    ];

    actions.forEach(({ label, message }) => {
      fireEvent.click(screen.getByText(label));
      expect(console.log).toHaveBeenCalledWith(message);
    });
  });
});

