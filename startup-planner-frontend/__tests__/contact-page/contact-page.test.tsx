import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '@/components/contact-page';
import fetchMock from 'jest-fetch-mock';

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/input', () => {
  const mockReact = require('react');
  return {
    Input: mockReact.forwardRef((props, ref) => <input ref={ref} {...props} />),
  };
});

jest.mock('@/components/ui/textarea', () => {
  const mockReact = require('react');
  return {
    Textarea: mockReact.forwardRef((props, ref) => <textarea ref={ref} {...props} />),
  };
});

describe('ContactPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders the contact form', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /Get in touch/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('validates the form fields', async () => {
    render(<ContactPage />);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
    });
  });


  test('submits the form successfully', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    render(<ContactPage />);

    // Arrange: Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message' } });

    // Act: Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Assert: Verify the fetch call
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/contact-us',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john.doe@example.com',
            message: 'This is a test message'
          }),
        })
      );
    });
  });

  test('handles form submission failure', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: false }), { status: 400 });

    render(<ContactPage />);

    // Arrange: Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message' } });

    // Act: Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Assert: Verify the fetch call
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/contact-us',
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john.doe@example.com',
            message: 'This is a test message'
          }),
        })
      );
    });

  });
});

