import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { toast } from "@/components/ui/use-toast";
import BusinessStartupForm from '@/app/(business)/business/create/page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the toast function
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('BusinessStartupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('renders the form with initial step', () => {
    render(<BusinessStartupForm />);
    expect(screen.getByText('New Business Startup')).toBeInTheDocument();
    expect(screen.getByLabelText('Business Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Industry')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('navigates through steps when clicking Next', async () => {
    render(<BusinessStartupForm />);

    // Step 1
    await userEvent.type(screen.getByLabelText('Business Name'), 'Test Business');
    await userEvent.type(screen.getByLabelText('Industry'), 'Tech');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByLabelText('Short Description')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText('Short Description'), 'A test business');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 3
    await waitFor(() => {
      expect(screen.getByLabelText('Business Stage')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 4
    await waitFor(() => {
      expect(screen.getByLabelText('Funding Amount')).toBeInTheDocument();
    });
  });

  it('allows navigation back to previous steps', async () => {
    render(<BusinessStartupForm />);

    // Navigate to step 2
    await userEvent.type(screen.getByLabelText('Business Name'), 'Test Business');
    await userEvent.type(screen.getByLabelText('Industry'), 'Tech');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Go back to step 1
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    // Check if we're back on step 1
    await waitFor(() => {
      expect(screen.getByLabelText('Business Name')).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<BusinessStartupForm />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText('Business Name'), 'Test Business');
    await userEvent.type(screen.getByLabelText('Industry'), 'Tech');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Short Description')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText('Short Description'), 'A test business');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Business Stage')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Funding Amount')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText('Funding Amount'), '1000');
    await userEvent.type(screen.getByLabelText('Team Size'), '5');
    await userEvent.type(screen.getByLabelText('Founding Date'), '2023-01-01');

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/businesses/', expect.any(Object));
      expect(toast).toHaveBeenCalledWith({
        title: 'Successfully created business.',
        description: 'Redirecting to the dashboard.'
      });
    });
  });

});

