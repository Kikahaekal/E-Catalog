import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import { AxiosError, AxiosHeaders } from 'axios';
import { apiClient } from '../services/api';

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

describe('AdminRoute existing sessions and auth events', () => {
  afterEach(() => localStorage.clear());
  const mount = () => render(<MemoryRouter initialEntries={['/admin']}><Routes><Route path="/admin" element={<AdminRoute><p>Protected Admin</p></AdminRoute>} /><Route path="/login" element={<p>Login required</p>} /></Routes></MemoryRouter>);
  it.each(['ADMIN', 'SUPER_ADMIN'])('retains a stored %s session on initial mount/refresh', role => {
    localStorage.setItem('token', 'session-test-only'); localStorage.setItem('role', role); mount(); expect(screen.getByText('Protected Admin')).toBeDefined();
  });
  it('denies a non-admin role even with a token', () => {
    localStorage.setItem('token', 'session-test-only'); localStorage.setItem('role', 'USER'); mount(); expect(screen.getByText('Login required')).toBeDefined();
  });
  it.each(['admin-auth-changed', 'storage'])('reacts to %s invalidation without a reload', event => {
    localStorage.setItem('token', 'session-test-only'); localStorage.setItem('role', 'ADMIN'); mount();
    act(() => { localStorage.removeItem('token'); localStorage.removeItem('role'); window.dispatchEvent(new Event(event)); });
    expect(screen.getByText('Login required')).toBeDefined(); expect(screen.queryByText('Protected Admin')).toBeNull();
  });
  it.each([401, 403])('redirects the mounted guard after an intercepted invalid-session %s response', async status => {
    localStorage.setItem('token', 'session-test-only'); localStorage.setItem('role', 'ADMIN'); mount();
    const original = apiClient.defaults.adapter;
    apiClient.defaults.adapter = async config => { throw new AxiosError('Request failed', undefined, config, undefined, { config, status, statusText: 'Error', headers: new AxiosHeaders(), data: { message: 'Token tidak valid atau kadaluwarsa.' } }); };
    try {
      await act(async () => { await apiClient.get('/api/fish/submissions').catch(() => undefined); });
      expect(screen.getByText('Login required')).toBeDefined(); expect(localStorage.getItem('token')).toBeNull();
    } finally { apiClient.defaults.adapter = original; }
  });

});
