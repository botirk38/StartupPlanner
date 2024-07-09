import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardSettings from '@/components/dashboard/dashboard-settings';

describe('DashboardSettings', () => {
  const originalLocalStorage = global.localStorage;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};
    global.localStorage = {
      getItem: jest.fn((key) => localStorageMock[key]),
      setItem: jest.fn((key, value) => {
        localStorageMock[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete localStorageMock[key];
      }),
      clear: jest.fn(() => {
        localStorageMock = {};
      }),
    } as unknown as Storage;
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  it('renders the settings dialog when triggered', () => {
    render(<DashboardSettings sidebarOpen={true} />);
    const triggerButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText(/customize your dashboard settings/i)).toBeInTheDocument();
  });

  it('saves settings when save button is clicked', () => {
    render(<DashboardSettings sidebarOpen={true} />);
    const triggerButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(triggerButton);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.queryByText(/customize your dashboard settings/i)).not.toBeInTheDocument();
  });
});

