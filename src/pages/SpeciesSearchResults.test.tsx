import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Page from './SpeciesSearchResults';
import { getAllSpecies, Species } from '../services/species';
import { apiClient } from '../services/api';

vi.mock('../services/species', () => ({ getAllSpecies: vi.fn() }));
vi.mock('../services/api', () => ({ apiClient: { defaults: { baseURL: 'https://catalog.example.test/' } } }));
vi.mock('../layout/MainLayout', () => ({ MainLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
const records: Species[] = [
  { id: '9007199254740993123', commonName: 'Ikan Todak', scientificName: 'Xiphias gladius', distributionText: 'Perairan Riau', localNames: [{ name: 'Ikan Pedang', regionNote: 'Bintan' }], regencies: [{ regency: { name: 'Natuna', province: 'Kepulauan Riau' } }] },
  { id: '2', commonName: 'Ikan Kerapu', scientificName: 'Epinephelus', localNames: [{ localName: { name: 'Nama Kerapu' } }, { submittedName: 'Sebutan Kerapu' }] },
];
const mount = (query = 'todak') => render(<MemoryRouter initialEntries={[`/search/results?name=${encodeURIComponent(query)}`]}><Page /></MemoryRouter>);
beforeEach(() => { vi.resetAllMocks(); apiClient.defaults.baseURL = 'https://catalog.example.test/'; vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: records }); });
afterEach(cleanup);

describe('Species search filtering over the current complete API response', () => {
  it.each(['TODAK', 'gladius', 'ikan pedang', 'BINTAN', 'Natuna', 'Perairan Riau'])('matches %s without displaying unrelated species', async query => {
    mount(query); expect(await screen.findByText('Ikan Todak')).toBeDefined(); expect(screen.queryByText('Ikan Kerapu')).toBeNull();
    expect(getAllSpecies).toHaveBeenCalledWith(query);
    expect(screen.getByRole('link', { name: /Detail/ }).getAttribute('href')).toBe(`/species/${records[0].id}?name=${encodeURIComponent(query)}`);
  });
  it.each(['Nama Kerapu', 'Sebutan Kerapu'])('supports existing local-name response shapes: %s', async query => {
    mount(query); expect(await screen.findByText('Ikan Kerapu')).toBeDefined(); expect(screen.queryByText('Ikan Todak')).toBeNull();
  });
  it('preserves the no-results state', async () => { mount('no match'); expect(await screen.findByText('Spesies Tidak Ditemukan')).toBeDefined(); expect(screen.queryByRole('table')).toBeNull(); });
  it.each(['', '   '])('does not request or show the full list for an empty query: %s', async query => {
    mount(query); expect(screen.getByText('Ketik kata kunci untuk memulai pencarian')).toBeDefined(); expect(getAllSpecies).not.toHaveBeenCalled(); expect(screen.queryByRole('table')).toBeNull();
  });
  it('trims the query and updates results through the existing search form', async () => {
    mount('  todak  '); await screen.findByText('Ikan Todak'); expect(getAllSpecies).toHaveBeenCalledWith('todak');
    fireEvent.change(screen.getByPlaceholderText('Cari kata kunci lain...'), { target: { value: 'KERAPU' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Cari' }).closest('form')!);
    expect(await screen.findByText('Ikan Kerapu')).toBeDefined(); await waitFor(() => expect(screen.queryByText('Ikan Todak')).toBeNull());
  });
});

describe('Search photo URLs and fallback', () => {
  it.each([
    ['uploads/fish.jpg', 'https://catalog.example.test/uploads/fish.jpg'],
    ['/uploads/fish.jpg', 'https://catalog.example.test/uploads/fish.jpg'],
    ['uploads\\fish.jpg', 'https://catalog.example.test/uploads/fish.jpg'],
    [' /uploads//fish.jpg ', 'https://catalog.example.test/uploads/fish.jpg'],
    ['https://images.example.test/fish.jpg?q=1', 'https://images.example.test/fish.jpg?q=1'],
    ['http://images.example.test/fish.jpg', 'http://images.example.test/fish.jpg'],
  ])('resolves %s using configured API origin or the absolute URL', async (filePath, expected) => {
    vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [{ ...records[0], photos: [{ filePath }] }] });
    mount(); expect((await screen.findByRole('img', { name: 'Ikan Todak' })).getAttribute('src')).toBe(expected);
  });
  it('avoids adding uploads twice when it is already in the configured prefix', async () => {
    apiClient.defaults.baseURL = 'https://catalog.example.test/uploads/';
    vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [{ ...records[0], photos: [{ filePath: '/uploads/fish.jpg' }] }] });
    mount(); expect((await screen.findByRole('img', { name: 'Ikan Todak' })).getAttribute('src')).toBe('https://catalog.example.test/uploads/fish.jpg');
  });
  it.each([undefined, '', '   ', 'javascript:bad', 'https://'])('shows missing/invalid photo fallback for %s', async filePath => {
    vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [{ ...records[0], photos: [{ filePath }] }] });
    mount(); expect(await screen.findByText('Tanpa foto')).toBeDefined(); expect(screen.queryByRole('img', { name: 'Ikan Todak' })).toBeNull();
  });
  it('replaces a broken image with text rather than a fake image URL', async () => {
    vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [{ ...records[0], photos: [{ filePath: 'uploads/broken.jpg' }] }] });
    mount(); fireEvent.error(await screen.findByRole('img', { name: 'Ikan Todak' })); expect(screen.getByText('Foto gagal dimuat')).toBeDefined();
  });
});
