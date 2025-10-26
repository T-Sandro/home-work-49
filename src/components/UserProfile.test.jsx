import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './UserProfile';

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    try {
      vi.unstubAllGlobals?.();
    } catch {}
  });

  it('shows loading indicator while fetch is pending', async () => {
    const d = deferred();
    vi.stubGlobal('fetch', () => d.promise);

    render(<UserProfile userId={1} />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading user data...');

    const fakeResponse = {
      ok: true,
      json: async () => ({ id: 1, name: 'John Doe', username: 'jdoe', email: 'j@e.com', website: 'example.com' })
    };
    d.resolve(fakeResponse);

    await waitFor(() => expect(screen.getByText(/Name:/)).toBeInTheDocument());
  });

  it('renders user data after successful fetch', async () => {
    const mockJson = { id: 1, name: 'Alice Smith', username: 'alice', email: 'alice@example.com', website: 'alice.dev' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockJson
    }));

    render(<UserProfile userId={1} />);

    await waitFor(() => expect(screen.getByText(/Name:/)).toBeInTheDocument());

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

    render(<UserProfile userId={1} />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.getByRole('alert')).toHaveTextContent('Network failure');
  });

  it('shows error when response is not ok (HTTP error)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    }));

    render(<UserProfile userId={1} />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent('HTTP 500');
  });
});
