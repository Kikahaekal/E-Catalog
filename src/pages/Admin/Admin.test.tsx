import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getAllSpecies } from '../../services/species';
import { getAllFishSubmissions } from '../../services/fish';
import { logout } from '../../services/user';
import AdminPage from './Admin';

vi.mock('../../services/species', () => ({ getAllSpecies: vi.fn() }));
vi.mock('../../services/fish', () => ({ getAllFishSubmissions: vi.fn() }));
vi.mock('../../services/user', () => ({ logout: vi.fn() }));

const speciesRequest = vi.mocked(getAllSpecies);
const submissionsRequest = vi.mocked(getAllFishSubmissions);
const mount = () => render(<MemoryRouter initialEntries={['/admin']}><AdminPage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  speciesRequest.mockResolvedValue({ message: 'OK', data: [] });
  submissionsRequest.mockResolvedValue({ message: 'OK', data: [] });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Admin Dashboard', () => {
  it('counts response arrays and keeps both loading states independent', async () => {
    let resolveSpecies!: (value: Awaited<ReturnType<typeof getAllSpecies>>) => void;
    speciesRequest.mockReturnValue(new Promise((resolve) => { resolveSpecies = resolve; }));
    submissionsRequest.mockResolvedValue({ message: 'OK', data: [{ id: 1, submittedName: 'Usulan', photoFilePath: 'uploads/photo.jpg' }] });
    mount();
    const species = screen.getByRole('region', { name: 'Jumlah Spesies Terdaftar' });
    const submissions = screen.getByRole('region', { name: 'Jumlah Usulan Masuk' });
    expect(within(species).getByRole('status')).toBeDefined();
    await waitFor(() => expect(within(submissions).getByText('1')).toBeDefined());
    expect(within(species).queryByText('0')).toBeNull();
    await act(async () => resolveSpecies({ message: 'OK', data: [{ id: 1, commonName: 'Ikan', scientificName: 'Species one' }, { id: 2, commonName: 'Ikan lain', scientificName: 'Species two' }] }));
    expect(within(species).getByText('2')).toBeDefined();
  });

  it('shows a partial error without reporting zero, and retries only the failed card', async () => {
    submissionsRequest.mockRejectedValueOnce(new Error('Offline'));
    mount();
    const submissions = screen.getByRole('region', { name: 'Jumlah Usulan Masuk' });
    await waitFor(() => expect(within(submissions).getByRole('alert')).toBeDefined());
    expect(within(submissions).queryByText('0')).toBeNull();
    expect(screen.getByText('Belum ada spesies terdaftar.')).toBeDefined();
    fireEvent.click(within(submissions).getByRole('button', { name: /Coba lagi/ }));
    await waitFor(() => expect(within(submissions).getByText('Belum ada usulan menunggu moderasi.')).toBeDefined());
    expect(speciesRequest).toHaveBeenCalledTimes(1);
    expect(submissionsRequest).toHaveBeenCalledTimes(2);
  });

  it('treats malformed data as an error rather than an empty result', async () => {
    submissionsRequest.mockResolvedValue({ message: 'OK', data: null } as unknown as Awaited<ReturnType<typeof getAllFishSubmissions>>);
    mount();
    const card = screen.getByRole('region', { name: 'Jumlah Usulan Masuk' });
    await waitFor(() => expect(within(card).getByRole('alert')).toBeDefined());
    expect(within(card).queryByText('0')).toBeNull();
  });

  it('keeps expired/forbidden sessions visible as an error', async () => {
    submissionsRequest.mockRejectedValue({ isAxiosError: true, response: { status: 403 } });
    mount();
    await waitFor(() => expect(screen.getByText(/sesi berakhir/)).toBeDefined());
    expect(screen.getByRole('button', { name: /Coba lagi Jumlah Usulan/ })).toBeDefined();
  });

  it('preserves every existing navigation route and toggles the desktop sidebar', async () => {
    mount();
    const nav = screen.getAllByRole('navigation', { name: 'Navigasi Admin' })[0];
    for (const path of ['/admin', '/iucn', '/wpp', '/referensi', '/spesies', '/daerah', '/permintaan-ikan', '/home']) {
      expect(nav.querySelector(`a[href="${path}"]`)).not.toBeNull();
    }
    const toggle = screen.getByRole('button', { name: 'Sembunyikan sidebar' });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    await waitFor(() => expect(screen.getByText('Belum ada spesies terdaftar.')).toBeDefined());
  });

  it('preserves logout cleanup and the auth-changed event', async () => {
    vi.mocked(logout).mockResolvedValue();
    const remove = vi.spyOn(Storage.prototype, 'removeItem');
    const authChanged = vi.fn();
    window.addEventListener('admin-auth-changed', authChanged);
    render(<MemoryRouter initialEntries={['/admin']}><Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<p>Login page</p>} />
    </Routes></MemoryRouter>);
    fireEvent.click(screen.getAllByRole('button', { name: 'Log Out' })[0]);
    await waitFor(() => expect(screen.getByText('Login page')).toBeDefined());
    expect(logout).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith('token');
    expect(remove).toHaveBeenCalledWith('role');
    expect(authChanged).toHaveBeenCalledTimes(1);
    window.removeEventListener('admin-auth-changed', authChanged);
  });
});
