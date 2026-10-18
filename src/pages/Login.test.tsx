import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './Login';
import { authUser } from '../services/user';
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('../services/user', () => ({ authUser: vi.fn() }));
vi.mock('@ionic/react', async original => ({ ...await original<typeof import('@ionic/react')>(), useIonRouter: () => ({ push }) }));
beforeEach(() => { vi.resetAllMocks(); localStorage.clear(); vi.spyOn(window, 'alert').mockImplementation(() => undefined); });
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });
const submit = () => {
  render(<Login />); fireEvent.change(screen.getByLabelText('Email Pengguna'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Kata Sandi'), { target: { value: 'Test only' } }); fireEvent.submit(screen.getByRole('button', { name: 'Masuk' }).closest('form')!);
};
describe('Login contracts with mocked authentication only', () => {
  it.each(['ADMIN', 'SUPER_ADMIN', 'USER'])('preserves successful %s storage, event and redirect', async role => {
    vi.mocked(authUser).mockResolvedValue({ message: 'OK', token: 'test-session-only', role }); const event = vi.fn(); window.addEventListener('admin-auth-changed', event);
    submit(); await waitFor(() => expect(push).toHaveBeenCalledWith(role === 'USER' ? '/home' : '/admin', 'forward', 'replace'));
    expect(localStorage.getItem('role')).toBe(role); expect(localStorage.getItem('token')).toBe('test-session-only'); expect(event).toHaveBeenCalledTimes(1);
    expect(authUser).toHaveBeenCalledWith('test@example.com', 'Test only'); window.removeEventListener('admin-auth-changed', event);
  });
  it.each([{ error: 'Email atau password salah' }, { message: 'Login ditolak' }])('reads failed Login response %s without a redirect loop', async data => {
    vi.mocked(authUser).mockRejectedValue({ response: { status: 401, data } }); submit(); await waitFor(() => expect(window.alert).toHaveBeenCalledWith(Object.values(data)[0]));
    expect(push).not.toHaveBeenCalled(); expect(localStorage.getItem('token')).toBeNull();
  });
  it('does not display internal server diagnostics', async () => {
    vi.mocked(authUser).mockRejectedValue({ response: { status: 500, data: { error: 'Private database trace' } } }); submit();
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Login gagal. Silakan coba lagi.')); expect(push).not.toHaveBeenCalled();
  });

});
