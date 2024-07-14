import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BusinessFormDialog } from '@/components/dashboard/business-form-dialog';
import { Business, NewBusiness } from '@/utils/types';

// Mock the UI components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({ name, render }: { name: string; render: (props: { field: any }) => React.ReactNode }) =>
    render({
      field: {
        name,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value:
          name === 'name' ? 'Test Business' :
            name === 'description' ? 'Test Description' :
              name === 'long_description' ? 'Test Long Description' :
                name === 'industry' ? 'Test Industry' :
                  name === 'stage' ? 'Idea' :
                    name === 'stage_description' ? 'Test Stage Description' :
                      name === 'funding_amount' ? 1000 :
                        name === 'team_size' ? 5 :
                          name === 'founding_date' ? '2023-01-01' : '',
      }
    }),
  FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FormControl: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormMessage: () => null,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (callback: (data: any) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      callback({
        name: 'Test Business',
        description: 'Test Description',
        long_description: 'Test Long Description',
        industry: 'Test Industry',
        stage: 'Idea',
        stage_description: 'Test Stage Description',
        funding_amount: 1000,
        team_size: 5,
        founding_date: '2023-01-01',
      });
    },
    control: {},
    formState: { errors: {} },
    register: jest.fn(),
  }),
}));

describe('BusinessFormDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnCreate = jest.fn();
  const business: Business = {
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
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    business: null as Business | null,
    onUpdate: mockOnUpdate,
    onCreate: mockOnCreate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for creating a new business', () => {
    render(<BusinessFormDialog {...defaultProps} />);
    expect(screen.getByText('Create New Business')).toBeInTheDocument();
    expect(screen.getByText('Enter details for your new business.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Business')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Long Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Industry')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Stage Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
    expect(screen.getByText('Create Business')).toBeInTheDocument();
  });

  it('renders correctly for editing an existing business', () => {
    render(<BusinessFormDialog {...defaultProps} business={business} />);
    expect(screen.getByText('Edit Business')).toBeInTheDocument();
    expect(screen.getByText('Make changes to your business details here.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Business')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Long Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Industry')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Stage Description')).toBeInTheDocument();
    expect(screen.getByText('Save changes')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BusinessFormDialog {...defaultProps} />);
    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCreate with form data when creating a new business', async () => {
    const user = userEvent.setup();
    render(<BusinessFormDialog {...defaultProps} />);
    await user.click(screen.getByText('Create Business'));
    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith({
        name: 'Test Business',
        description: 'Test Description',
        long_description: 'Test Long Description',
        industry: 'Test Industry',
        stage: 'Idea',
        stage_description: 'Test Stage Description',
        funding_amount: 1000,
        team_size: 5,
        founding_date: '2023-01-01',
      } as NewBusiness);
    });
  });

  it('calls onUpdate with form data when editing an existing business', async () => {
    const user = userEvent.setup();
    render(<BusinessFormDialog {...defaultProps} business={business} />);
    await user.click(screen.getByText('Save changes'));
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...business,
        name: 'Test Business',
        description: 'Test Description',
        long_description: 'Test Long Description',
        industry: 'Test Industry',
        stage: 'Idea',
        stage_description: 'Test Stage Description',
        funding_amount: 1000,
        team_size: 5,
        founding_date: '2023-01-01',
      } as Business);
    });
  });
});

