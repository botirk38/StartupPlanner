import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BusinessActions } from '@/components/dashboard/business-action';
import { Business } from '@/utils/types';



const mockBusiness: Business = {
  id: 1,
  name: 'Test Business',
  description: 'Test Description',
  long_description: 'Test Long Description',
  industry: 'Test Industry',
  stage: 'Idea',
  stage_description: 'Test Stage Description',
  funding_amount: 1000,
  team_size: 5,
  founding_date: '2023-01-01',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  user_id: 1,
};

describe('BusinessActions', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCreateNew = jest.fn();

  it('renders create new button when no business is selected', () => {
    render(
      <BusinessActions
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreateNew={mockOnCreateNew}
        selectedBusiness={null}
      />
    );

    expect(screen.getByText('Create New Business')).toBeInTheDocument();
    expect(screen.queryByText('Edit Business')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Business')).not.toBeInTheDocument();
  });

  it('renders all buttons when a business is selected', () => {
    render(
      <BusinessActions
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreateNew={mockOnCreateNew}
        selectedBusiness={mockBusiness}
      />
    );

    expect(screen.getByText('Create New Business')).toBeInTheDocument();
    expect(screen.getByText('Edit Business')).toBeInTheDocument();
    expect(screen.getByText('Delete Business')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <BusinessActions
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreateNew={mockOnCreateNew}
        selectedBusiness={mockBusiness}
      />
    );

    fireEvent.click(screen.getByText('Edit Business'));
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onCreateNew when create new button is clicked', () => {
    render(
      <BusinessActions
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreateNew={mockOnCreateNew}
        selectedBusiness={null}
      />
    );

    fireEvent.click(screen.getByText('Create New Business'));
    expect(mockOnCreateNew).toHaveBeenCalled();
  });

  it('shows delete confirmation dialog when delete button is clicked', () => {
    render(
      <BusinessActions
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreateNew={mockOnCreateNew}
        selectedBusiness={mockBusiness}
      />
    );

    fireEvent.click(screen.getByText('Delete Business'));
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onDelete when delete is confirmed', () => {
    render(
      <BusinessActions
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreateNew={mockOnCreateNew}
        selectedBusiness={mockBusiness}
      />
    );

    fireEvent.click(screen.getByText('Delete Business'));
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalled();
  });
});

