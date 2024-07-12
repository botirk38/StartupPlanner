import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import { useToast } from '@/components/ui/use-toast';
import AccountForm from '@/components/user-profile/account-form';


jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

const mockAccountData = {
  display_name: 'John Doe',
  email: 'john@example.com',
  bio: 'Test bio',
  avatar: 'https://example.com/avatar.jpg',
};

describe('AccountForm', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });

  it('renders the form with initial values', () => {
    render(<AccountForm accountData={mockAccountData} />);

    expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('Bio')).toHaveValue('Test bio');
    // Check for the avatar fallback instead of the image
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('allows updating form fields', async () => {
    render(<AccountForm accountData={mockAccountData} />);

    await userEvent.type(screen.getByLabelText('Name'), ' Updated');
    await userEvent.type(screen.getByLabelText('Email'), '.updated');
    await userEvent.type(screen.getByLabelText('Bio'), ' Updated bio');

    expect(screen.getByLabelText('Name')).toHaveValue('John Doe Updated');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com.updated');
    expect(screen.getByLabelText('Bio')).toHaveValue('Test bio Updated bio');
  });

  it('handles avatar upload', async () => {
    render(<AccountForm accountData={mockAccountData} />);

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload Avatar');

    await userEvent.upload(input, file);

    expect(input.files?.[0]).toBe(file);
    expect(input.files?.length).toBe(1);
  });

  it('submits the form and shows success toast', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ avatar: 'https://example.com/new-avatar.jpg' }));

    render(<AccountForm accountData={mockAccountData} />);

    await userEvent.type(screen.getByLabelText('Name'), ' Updated');
    await userEvent.click(screen.getByText('Save Changes'));
    await userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/account', expect.any(Object));
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Account settings updated',
      }));
    });
  });

  it('shows error toast when submission fails', async () => {
    fetchMock.mockRejectOnce(new Error('API Error'));

    render(<AccountForm accountData={mockAccountData} />);

    await userEvent.click(screen.getByText('Save Changes'));
    await userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Account settings update failed.',
        variant: 'destructive',
      }));
    });
  });

  it('validates form fields', async () => {
    render(<AccountForm accountData={mockAccountData} />);

    await userEvent.clear(screen.getByLabelText('Name'));
    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.type(screen.getByLabelText('Bio'), 'a'.repeat(501));

    await userEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      userEvent.click(screen.getByText('Confirm'))
      expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
      expect(screen.getByText('Bio must not exceed 500 characters.')).toBeInTheDocument();

    });

  });
});

