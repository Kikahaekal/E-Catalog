import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Page from './FishSubmissions';
import { approveSubmission, getAllFishSubmissions, rejectSubmission, UserSubmission } from '../../../services/fish';
import { getAllSpecies } from '../../../services/species';

vi.mock('../../../services/fish', () => ({ approveSubmission: vi.fn(), getAllFishSubmissions: vi.fn(), rejectSubmission: vi.fn() }));
vi.mock('../../../services/species', () => ({ getAllSpecies: vi.fn() }));
vi.mock('../../../services/api', () => ({ apiClient: { defaults: { baseURL: 'http://fixture.test/' } } }));
vi.mock('../../../layout/AdminLayout', () => ({ AdminLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
// Real Ionic overlays/selects are exercised separately in the isolated browser tests.
vi.mock('@ionic/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ionic/react')>();
  return {
    ...actual,
    IonButton: ({ children, onClick, disabled, 'aria-label': label }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button onClick={onClick} disabled={disabled} aria-label={label}>{children}</button>,
    IonSelect: ({ children, value, onIonChange, 'aria-label': label }: { children: React.ReactNode; value: string | number; 'aria-label': string; onIonChange: (event: { detail: { value: string } }) => void }) => <select aria-label={label} value={value} onChange={event => onIonChange({ detail: { value: event.target.value } })}><option value="">Pilih spesies</option>{children}</select>,
    IonSelectOption: ({ children, value }: { children: React.ReactNode; value: string | number }) => <option value={value}>{children}</option>,
    IonModal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => isOpen ? <section role="dialog">{children}</section> : null,
    IonAlert: ({ isOpen, buttons, message, onDidDismiss }: { isOpen: boolean; message: string; buttons: { text: string; handler?: () => void }[]; onDidDismiss: () => void }) => isOpen ? <section role="alertdialog"><p>{message}</p>{buttons.map(button => <button key={button.text} onClick={() => { button.handler?.(); onDidDismiss(); }}>{button.text}</button>)}</section> : null,
    IonToast: ({ isOpen, message }: { isOpen: boolean; message: string }) => isOpen ? <p role="status">{message}</p> : null,
  };
});

const largeId = '9007199254740993123';
const speciesId = '9007199254740993124';
const sample: UserSubmission = { id: largeId, submittedName: 'Ikan Usulan', photoFilePath: 'uploads\\fish.jpg', locationNote: 'Bintan', submitterName: 'Pengusul', createdAt: '2026-10-18', updatedAt: '2026-10-18' };
const apiError = (status: number, data: { error?: string; message?: string }) => ({ isAxiosError: true, response: { status, data } });
const ready = async () => { render(<Page />); return screen.findByRole('table', { name: 'Permintaan ikan' }); };
const selectSpecies = () => fireEvent.change(screen.getByRole('combobox', { name: 'Hubungkan Ikan Usulan ke spesies' }), { target: { value: speciesId } });
const confirmReject = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Tolak Ikan Usulan' }));
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Tolak' }));
};
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getAllFishSubmissions).mockResolvedValue({ message: 'OK', data: [sample] });
  vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [{ id: speciesId, commonName: 'Ikan Terdaftar', scientificName: 'Species example' }] });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Permintaan Ikan presentation and moderation with mocked services only', () => {
  it('preserves all six columns, values, species options and selection requirement', async () => {
    const table = await ready();
    expect(within(table).getAllByRole('columnheader').map(n => n.textContent)).toEqual(['Foto', 'Nama Lokal', 'Lokasi', 'Pengusul', 'Hubungkan ke Spesies', 'Aksi']);
    expect(screen.queryByRole('heading', { name: 'Permintaan Nama Ikan' })).toBeNull();
    expect(within(table).getByText('Bintan')).toBeDefined();
    const approve = screen.getByRole('button', { name: 'Setujui Ikan Usulan' });
    expect((approve as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(approve); expect(approveSubmission).not.toHaveBeenCalled();
    selectSpecies(); expect((approve as HTMLButtonElement).disabled).toBe(false);
  });

  it('keeps loading and disables reload while the existing parallel fetch waits', () => {
    vi.mocked(getAllSpecies).mockReturnValue(new Promise(() => undefined));
    render(<Page />); expect(screen.getByRole('status').textContent).toContain('Memuat');
    expect((screen.getByRole('button', { name: 'Muat Ulang' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('shows empty only for a successful empty response', async () => {
    vi.mocked(getAllFishSubmissions).mockResolvedValue({ message: 'OK', data: [] });
    render(<Page />); expect(await screen.findByText('Belum ada permintaan nama ikan.')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each([401, 403, 500])('shows message-format error %s without empty and retries both existing requests', async status => {
    vi.mocked(getAllFishSubmissions).mockRejectedValueOnce(apiError(status, { message: 'Akses gagal' }));
    render(<Page />); expect((await screen.findByRole('alert')).textContent).toContain(status === 500 ? 'Gagal memuat data permintaan.' : 'Akses gagal');
    expect(screen.queryByText('Belum ada permintaan nama ikan.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Muat Ulang' }));
    await screen.findByRole('table'); expect(getAllFishSubmissions).toHaveBeenCalledTimes(2); expect(getAllSpecies).toHaveBeenCalledTimes(2);
  });

  it('retains Promise.all failure behavior and error-field precedence', async () => {
    vi.mocked(getAllSpecies).mockRejectedValueOnce(apiError(400, { error: 'Spesies gagal', message: 'Pesan lain' }));
    render(<Page />); expect((await screen.findByRole('alert')).textContent).toContain('Spesies gagal');
    expect(screen.queryByRole('table')).toBeNull(); expect(screen.queryByText('Belum ada permintaan nama ikan.')).toBeNull();
  });

  it('retains a useful fallback for network errors', async () => {
    vi.mocked(getAllFishSubmissions).mockRejectedValueOnce(new Error('Network failed'));
    render(<Page />); expect((await screen.findByRole('alert')).textContent).toContain('Gagal memuat data permintaan.');
  });

  it('preserves normalized/absolute photo URLs and shows missing/broken image fallback', async () => {
    vi.mocked(getAllFishSubmissions).mockResolvedValue({ message: 'OK', data: [sample, { ...sample, id: '2', submittedName: 'Foto kosong', photoFilePath: '' }, { ...sample, id: '3', submittedName: 'Foto absolut', photoFilePath: 'https://fixture.test/photo.jpg' }] });
    await ready(); const photo = screen.getByRole('img', { name: 'Foto Ikan Usulan' });
    expect(photo.getAttribute('src')).toBe('http://fixture.test/uploads/fish.jpg');
    expect(screen.getByRole('img', { name: 'Foto Foto absolut' }).getAttribute('src')).toBe('https://fixture.test/photo.jpg');
    expect(screen.getByText('Foto tidak tersedia')).toBeDefined();
    fireEvent.error(photo); expect(screen.getByText('Foto gagal dimuat')).toBeDefined();
  });

  it('keeps detail fields, large ID and photo fallback inside the modal', async () => {
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Lihat detail permintaan Ikan Usulan' }));
    const detail = screen.getByRole('dialog'); expect(within(detail).getByText(largeId)).toBeDefined();
    for (const field of ['Nama Lokal', 'Lokasi', 'Pengusul', 'Foto', 'Dibuat', 'Diperbarui']) expect(within(detail).getByText(field, { selector: 'dt' })).toBeDefined();
    fireEvent.error(within(detail).getByRole('img')); expect(within(detail).getByText('Foto gagal dimuat')).toBeDefined();
    fireEvent.click(within(detail).getByRole('button')); expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('approves directly with exact string IDs, clears selection and refreshes using mocks', async () => {
    let finish!: (value: { message: string }) => void;
    vi.mocked(approveSubmission).mockReturnValue(new Promise(resolve => { finish = resolve; }));
    await ready(); selectSpecies(); fireEvent.click(screen.getByRole('button', { name: 'Setujui Ikan Usulan' }));
    expect(approveSubmission).toHaveBeenCalledWith(largeId, speciesId);
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect((screen.getByRole('button', { name: 'Setujui Ikan Usulan' }) as HTMLButtonElement).disabled).toBe(true);
    finish({ message: 'OK' });
    expect(await screen.findByText('Permintaan berhasil disetujui.')).toBeDefined();
    await waitFor(() => expect(getAllFishSubmissions).toHaveBeenCalledTimes(2)); await screen.findByRole('table');
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('');
  });

  it('shows approve failure without removing the row or hiding it as empty', async () => {
    vi.mocked(approveSubmission).mockRejectedValue(apiError(500, { error: 'Approve gagal' }));
    await ready(); selectSpecies(); fireEvent.click(screen.getByRole('button', { name: 'Setujui Ikan Usulan' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Gagal menyetujui permintaan.');
    expect(screen.getByRole('table')).toBeDefined(); expect(getAllFishSubmissions).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe(speciesId);
  });

  it('requires reject confirmation and cancels without calling its service', async () => {
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Tolak Ikan Usulan' }));
    const dialog = screen.getByRole('alertdialog'); expect(dialog.textContent).toContain('menolak dan menghapus permintaan');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }));
    expect(rejectSubmission).not.toHaveBeenCalled(); expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('rejects with exact ID and refreshes after mocked success', async () => {
    vi.mocked(rejectSubmission).mockResolvedValue({ message: 'OK' });
    await ready(); vi.mocked(getAllFishSubmissions).mockResolvedValue({ message: 'OK', data: [] }); confirmReject();
    expect(rejectSubmission).toHaveBeenCalledWith(largeId);
    expect(await screen.findByText('Permintaan berhasil ditolak.')).toBeDefined();
    expect(await screen.findByText('Belum ada permintaan nama ikan.')).toBeDefined();
    expect(getAllFishSubmissions).toHaveBeenCalledTimes(2);
  });

  it('shows reject message-format failure and preserves the row', async () => {
    vi.mocked(rejectSubmission).mockRejectedValue(apiError(403, { message: 'Tidak berhak menolak' }));
    await ready(); confirmReject(); expect((await screen.findByRole('alert')).textContent).toContain('Tidak berhak menolak');
    expect(screen.getByRole('table')).toBeDefined(); expect(getAllFishSubmissions).toHaveBeenCalledTimes(1);
  });
});
