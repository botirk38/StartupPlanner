import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/app/(auth)/login/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.ResizeObserver = class {
  observe() { }
  unobserve() { }
  disconnect() { }
};

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <>
        <LoginPage />
        <Toaster />
      </>
    );

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login with/i })).toBeInTheDocument();
  });

  test('displays error message for invalid email', async () => {
    render(
      <>
        <LoginPage />
        <Toaster />
      </>
    );

    fireEvent.input(screen.getByLabelText('Email address'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    render(
      <>
        <LoginPage />
        <Toaster />
      </>
    );

    fireEvent.input(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('You are now signed in!')).toBeInTheDocument();
    });
  });

  test('handles Canva login button click', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

    render(
      <>
        <LoginPage />
        <Toaster />
      </>
    );

    fireEvent.click(screen.getByRole('button', { name: /login with/i }));

    expect(mockPush).toHaveBeenCalledWith('http://localhost:3000/canva/auth');
  });

  test('displays error message when Canva login URL is not configured', () => {
    process.env.NEXT_PUBLIC_API_URL = '';

    render(
      <>
        <LoginPage />
        <Toaster />
      </>
    );

    fireEvent.click(screen.getByRole('button', { name: /login with/i }));

    waitFor(() => {
      expect(screen.getByText('Canva login URL is not configured')).toBeInTheDocument();
    });
  });
});

