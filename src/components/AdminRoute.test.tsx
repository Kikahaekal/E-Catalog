import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from './AdminRoute';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AdminRoute without a token', () => {
  it.each([null, 'ADMIN', 'SUPER_ADMIN', 'USER'])('denies access with role %s', (role) => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => key === 'role' ? role : null);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminRoute><p>Protected Admin</p></AdminRoute>} />
          <Route path="/login" element={<p>Login required</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login required')).toBeDefined();
    expect(screen.queryByText('Protected Admin')).toBeNull();
  });
});
