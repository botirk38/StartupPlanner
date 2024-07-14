import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../../components/dashboard';
import fetchMock from 'jest-fetch-mock';
import { Business } from '@/utils/types';

// Mock the toast component
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock hasPointerCapture
Element.prototype.hasPointerCapture = jest.fn(() => false);

describe('Dashboard Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const mockBusinesses: Business[] = [
    {
      id: 1,
      name: 'Business 1',
      description: 'Description 1',
      long_description: 'Long Description 1',
      industry: 'Industry 1',
      stage: 'MVP',
      stage_description: 'MVP Stage',
      funding_amount: 100000,
      team_size: 5,
      founding_date: '2022-01-01',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      user_id: 1,
    },
    {
      id: 2,
      name: 'Business 2',
      description: 'Description 2',
      long_description: 'Long Description 2',
      industry: 'Industry 2',
      stage: 'Growth',
      stage_description: 'Growth Stage',
      funding_amount: 500000,
      team_size: 20,
      founding_date: '2022-02-01',
      created_at: '2023-02-01T00:00:00Z',
      updated_at: '2023-02-01T00:00:00Z',
      user_id: 1,
    },
  ];

  it('should render the dashboard with businesses', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockBusinesses));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getAllByText('Business 1')).toHaveLength(2);
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Business 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('should handle API error when loading businesses', async () => {
    fetchMock.mockRejectOnce(new Error('API error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load businesses.')).toBeInTheDocument();
    });
  });

  it('should allow selecting a business', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockBusinesses));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getAllByText('Business 1')).toHaveLength(2);
    });

    const switchButton = screen.getByRole('button', { name: 'Switch Business' })
    userEvent.click(switchButton);

    await waitFor(() => {
      expect(screen.getByText('Business 2')).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Business 2'));

    await waitFor(() => {
      expect(screen.getAllByText('Business 2')).toHaveLength(2);
    });
  });

  it('should open the create business dialog', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockBusinesses));

    render(<Dashboard />);

    await waitFor(() => {
      const createButton = screen.getByText('Create New Business');
      userEvent.click(createButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Enter details for your new business.')).toBeInTheDocument();
    });
  });

  it('should create a new business', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockBusinesses));
    const newBusiness: Business = {
      id: 3,
      name: 'New Business',
      description: 'New Description',
      long_description: 'New Long Description',
      industry: 'New Industry',
      stage: 'Idea',
      stage_description: 'New Stage Description',
      funding_amount: 50000,
      team_size: 3,
      founding_date: '2023-06-01',
      created_at: '2023-06-01T00:00:00Z',
      updated_at: '2023-06-01T00:00:00Z',
      user_id: 1,
    };
    fetchMock.mockResponseOnce(JSON.stringify(newBusiness));

    render(<Dashboard />);

    await waitFor(() => {
      const createButton = screen.getByText('Create New Business');
      userEvent.click(createButton);
    });

    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Business Name'), 'New Business');
      userEvent.type(screen.getByLabelText('Short Description'), 'New Description');
      userEvent.type(screen.getByLabelText('Long Description'), 'New Long Description');
      userEvent.type(screen.getByLabelText('Industry'), 'New Industry');
      userEvent.type(screen.getByLabelText('Business Stage'), 'Idea');
      userEvent.type(screen.getByLabelText('Stage Description'), 'New Stage Description');
      userEvent.type(screen.getByLabelText('Funding Amount'), '50000');
      userEvent.type(screen.getByLabelText('Team Size'), '3');
      userEvent.type(screen.getByLabelText('Founding Date'), '2023-06-01');

      const submitButton = screen.getByText('Create Business');
      userEvent.click(submitButton);
    });

  });

  it('should update an existing business', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockBusinesses));
    const updatedBusiness: Business = {
      ...mockBusinesses[0],
      name: 'Updated Business',
      description: 'Updated Description',
      stage: 'Growth',
      funding_amount: 200000,
      team_size: 10,
    };
    fetchMock.mockResponseOnce(JSON.stringify(updatedBusiness));

    render(<Dashboard />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Business');
      userEvent.click(editButton);
    });

    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Business Name'), 'Updated Business');
      userEvent.type(screen.getByLabelText('Short Description'), 'Updated Description');
      userEvent.type(screen.getByLabelText('Business Stage'), 'Growth');
      userEvent.type(screen.getByLabelText('Funding Amount'), '200000');
      userEvent.type(screen.getByLabelText('Team Size'), '10');

      const saveButton = screen.getByText('Save changes');
      userEvent.click(saveButton);
    });

  });

  it('should delete a business', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockBusinesses));
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    render(<Dashboard />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete Business');
      userEvent.click(deleteButton);
    });

    await waitFor(() => {
      const confirmDeleteButton = screen.getByText('Delete');
      userEvent.click(confirmDeleteButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Business 1')).not.toBeInTheDocument();
    });
  });
});
