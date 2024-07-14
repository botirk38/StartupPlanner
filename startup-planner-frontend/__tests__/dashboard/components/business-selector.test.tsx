import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Business } from '@/utils/types';
import { BusinessSelector } from '@/components/dashboard/business-selector';

// Mock the icons
jest.mock('@/components/icons/chevron-down-icon', () => () => <div data-testid="chevron-down-icon" />);
jest.mock('@/components/icons/home-icon', () => () => <div data-testid="home-icon" />);

describe('BusinessSelector', () => {


  const mockBusinesses: Business[] = [
    {
      id: 1,
      name: 'Business A',
      description: 'Description A',
      long_description: 'Detailed description of Business A and its operations.',
      industry: 'Tech',
      stage: 'Growth',
      stage_description: 'Expanding market share and product offerings',
      funding_amount: 1000000,
      team_size: 50,
      founding_date: '2020-01-15',
      created_at: '2020-01-15T00:00:00Z',
      updated_at: '2023-06-01T00:00:00Z',
      user_id: 101
    },
    {
      id: 2,
      name: 'Business B',
      description: 'Description B',
      long_description: 'In-depth overview of Business B\'s financial services and products.',
      industry: 'Finance',
      stage: 'MVP',
      stage_description: 'Testing product-market fit with early adopters',
      funding_amount: 500000,
      team_size: 20,
      founding_date: '2021-03-22',
      created_at: '2021-03-22T00:00:00Z',
      updated_at: '2023-05-30T00:00:00Z',
      user_id: 102
    },
    {
      id: 3,
      name: 'Company C',
      description: 'Description C',
      long_description: 'Comprehensive explanation of Company C\'s retail strategy and unique value proposition.',
      industry: 'Retail',
      stage: 'Maturity',
      stage_description: 'Optimizing operations and exploring new markets',
      funding_amount: 5000000,
      team_size: 200,
      founding_date: '2015-11-01',
      created_at: '2015-11-01T00:00:00Z',
      updated_at: '2023-06-02T00:00:00Z',
      user_id: 103
    },
  ];


  const mockOnSelect = jest.fn();

  it('renders the selected business name', () => {
    render(
      <BusinessSelector
        businesses={mockBusinesses}
        selectedBusiness={mockBusinesses[0]}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Business A')).toBeInTheDocument();
  });

  it('renders the "Switch Business" button', () => {
    render(
      <BusinessSelector
        businesses={mockBusinesses}
        selectedBusiness={mockBusinesses[0]}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Switch Business')).toBeInTheDocument();
  });

  it('opens the dropdown menu when clicking the button', async () => {
    const user = userEvent.setup();
    render(
      <BusinessSelector
        businesses={mockBusinesses}
        selectedBusiness={mockBusinesses[0]}
        onSelect={mockOnSelect}
      />
    );
    await user.click(screen.getByText('Switch Business'));
    expect(screen.getByPlaceholderText('Search businesses...')).toBeInTheDocument();
  });


  it('filters businesses based on search term', async () => {
    const user = userEvent.setup();
    render(
      <BusinessSelector
        businesses={mockBusinesses}
        selectedBusiness={mockBusinesses[0]}
        onSelect={mockOnSelect}
      />
    );

    // Open the dropdown
    await user.click(screen.getByText('Switch Business'));

    // Type into the search input
    const searchInput = screen.getByPlaceholderText('Search businesses...');
    await user.type(searchInput, 'Company');

    // Wait for the dropdown to update
    await screen.findByText('Company C');

    // Check that 'Company C' is visible
    expect(screen.getByText('Company C')).toBeInTheDocument();

    // Check that 'Business A' and 'Business B' are not in the dropdown
    const dropdownContent = screen.getByRole('menu');
    expect(within(dropdownContent).queryByText('Business A')).not.toBeInTheDocument();
    expect(within(dropdownContent).queryByText('Business B')).not.toBeInTheDocument();

    // The selected business name should still be visible outside the dropdown
    expect(screen.getByText('Business A')).toBeInTheDocument();
  });


  it('calls onSelect when a business is selected', async () => {
    const user = userEvent.setup();
    render(
      <BusinessSelector
        businesses={mockBusinesses}
        selectedBusiness={mockBusinesses[0]}
        onSelect={mockOnSelect}
      />
    );
    await user.click(screen.getByText('Switch Business'));
    await user.click(screen.getByText('Business B'));

    expect(mockOnSelect).toHaveBeenCalledWith(mockBusinesses[1]);
  });

  it('renders home icons for each business in the dropdown', async () => {
    const user = userEvent.setup();
    render(
      <BusinessSelector
        businesses={mockBusinesses}
        selectedBusiness={mockBusinesses[0]}
        onSelect={mockOnSelect}
      />
    );
    await user.click(screen.getByText('Switch Business'));

    const homeIcons = screen.getAllByTestId('home-icon');
    expect(homeIcons).toHaveLength(mockBusinesses.length);
  });
});

