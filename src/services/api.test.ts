import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './api';

const originalAdapter = apiClient.defaults.adapter;
const failure = (config: InternalAxiosRequestConfig, status: number, data: object) =>
  new AxiosError('Request failed', undefined, config, undefined, { config, status, data, statusText: 'Error', headers: new AxiosHeaders() });
const respond = (status: number, data: object) => { apiClient.defaults.adapter = async config => { throw failure(config, status, data); }; };
beforeEach(() => { localStorage.clear(); localStorage.setItem('token', 'session-under-test'); localStorage.setItem('role', 'ADMIN'); localStorage.setItem('catalog-preference', 'keep'); });
afterEach(() => { apiClient.defaults.adapter = originalAdapter; localStorage.clear(); vi.restoreAllMocks(); });

describe('Protected API session invalidation with in-memory Axios adapter', () => {
  it('clears only token/role once for concurrent Admin 401s and emits the existing event', async () => {
    respond(401, { message: 'Akses ditolak. Token tidak ditemukan.' }); const event = vi.fn(); window.addEventListener('admin-auth-changed', event);
    await Promise.allSettled([apiClient.get('/api/fish/submissions'), apiClient.get('/api/fish/submissions')]);
    expect(localStorage.getItem('token')).toBeNull(); expect(localStorage.getItem('role')).toBeNull(); expect(localStorage.getItem('catalog-preference')).toBe('keep'); expect(event).toHaveBeenCalledTimes(1);
    window.removeEventListener('admin-auth-changed', event);
  });
  it('handles only the backend exact invalid-token 403 as an expired session', async () => {
    respond(403, { message: 'Token tidak valid atau kadaluwarsa.' }); await apiClient.get('/api/fish/submissions').catch(() => undefined);
    expect(localStorage.getItem('token')).toBeNull();
  });
  it.each([403, 404, 500])('does not log out on permission/resource/server status %s', async status => {
    respond(status, { message: 'Anda tidak memiliki hak akses untuk tindakan ini.' }); await apiClient.get('/api/fish/submissions').catch(() => undefined);
    expect(localStorage.getItem('token')).toBe('session-under-test');
  });
  it.each(['/api/auth/login', '/api/fish/submit'])('excludes public POST %s from automatic logout', async url => {
    respond(401, { error: 'Request ditolak' }); await apiClient.post(url, {}).catch(() => undefined); expect(localStorage.getItem('token')).toBe('session-under-test');
  });
  it('does not treat a public GET or a foreign origin as an Admin session failure', async () => {
    respond(401, {}); await apiClient.get('/api/species').catch(() => undefined); await apiClient.get('https://unrelated.example.test/api/fish/submissions').catch(() => undefined);
    expect(localStorage.getItem('token')).toBe('session-under-test');
  });
  it.each(['post', 'put', 'delete'] as const)('invalidates on protected %s using only an in-memory adapter', async method => {
    respond(401, {}); await apiClient.request({ method, url: '/api/species/1' }).catch(() => undefined); expect(localStorage.getItem('token')).toBeNull();
  });
  it.each(['ERR_NETWORK', 'ECONNABORTED'])('preserves session for %s', async code => {
    apiClient.defaults.adapter = async config => { throw new AxiosError('Sensitive transport detail', code, config); };
    await apiClient.get('/api/fish/submissions').catch(() => undefined); expect(localStorage.getItem('token')).toBe('session-under-test');
  });
  it('does not invalidate a new login due to a delayed old request', async () => {
    let fail!: () => void;
    apiClient.defaults.adapter = config => new Promise<AxiosResponse>((_, reject) => { fail = () => reject(failure(config, 401, {})); });
    const request = apiClient.get('/api/fish/submissions'); await vi.waitFor(() => expect(fail).toBeDefined());
    localStorage.setItem('token', 'new-session'); fail(); await request.catch(() => undefined); expect(localStorage.getItem('token')).toBe('new-session');
  });
});
