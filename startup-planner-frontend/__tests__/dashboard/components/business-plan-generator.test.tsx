import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BusinessPlanGenerator } from '@/components/dashboard/business-plan-generator';

describe('BusinessPlanGenerator', () => {
  const mockBusiness = {
    id: 1,
    name: 'Test Business',
    description: 'This is a test business description',
  };

  it('renders the component title', () => {
    render(<BusinessPlanGenerator business={null} />);
    expect(screen.getByText('Business Plan Generator')).toBeInTheDocument();
  });

  it('renders the component description', () => {
    render(<BusinessPlanGenerator business={null} />);
    expect(screen.getByText('Create a professional business plan in minutes.')).toBeInTheDocument();
  });

  it('renders input fields and button when no business is provided', () => {
    render(<BusinessPlanGenerator business={null} />);
    expect(screen.getByPlaceholderText('Business Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Business Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Plan' })).toBeInTheDocument();
  });

  it('displays business name when a business is provided', () => {
    render(<BusinessPlanGenerator business={mockBusiness} />);
    const nameInput = screen.getByPlaceholderText('Business Name') as HTMLInputElement;
    expect(nameInput.value).toBe('Test Business');
  });

  it('displays business description when a business is provided', () => {
    render(<BusinessPlanGenerator business={mockBusiness} />);
    const descriptionTextarea = screen.getByPlaceholderText('Business Description') as HTMLTextAreaElement;
    expect(descriptionTextarea.value).toBe('This is a test business description');
  });

  it('input fields are readonly when a business is provided', () => {
    render(<BusinessPlanGenerator business={mockBusiness} />);
    const nameInput = screen.getByPlaceholderText('Business Name') as HTMLInputElement;
    const descriptionTextarea = screen.getByPlaceholderText('Business Description') as HTMLTextAreaElement;
    expect(nameInput).toHaveAttribute('readonly');
    expect(descriptionTextarea).toHaveAttribute('readonly');
  });

  it('renders the generate plan button', () => {
    render(<BusinessPlanGenerator business={null} />);
    const generateButton = screen.getByRole('button', { name: 'Generate Plan' });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toHaveClass('dark:text-white dark:bg-blue-700 dark:hover:bg-blue-800');
  });
});

