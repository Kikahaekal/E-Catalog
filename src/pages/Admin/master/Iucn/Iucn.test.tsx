import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import IucnPage from './Iucn';
import { createIucn, editIucn, deleteIucn, getAllIucn } from '../../../../services/iucn';
vi.mock('../../../../services/iucn', () => ({ getAllIucn: vi.fn(), createIucn: vi.fn(), editIucn: vi.fn(), deleteIucn: vi.fn() }));
vi.mock('../../../../layout/AdminLayout', () => ({ AdminLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
// Keep overlay/input tests deterministic in jsdom; browser checks exercise real Ionic components.
vi.mock('@ionic/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ionic/react')>();
  return {
    ...actual,
    IonButton: ({ children, onClick, disabled, type, 'aria-label': label }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button type={type || 'button'} onClick={onClick} disabled={disabled} aria-label={label}>{children}</button>,
    IonSearchbar: ({ value, onIonInput, placeholder }: { value: string; placeholder: string; onIonInput: (event: { detail: { value: string } }) => void }) => <input aria-label="Cari kode atau nama IUCN" placeholder={placeholder} value={value} onChange={(event) => onIonInput({ detail: { value: event.target.value } })} />,
    IonInput: ({ value, onIonInput, required, type }: { value?: string; required?: boolean; type?: string; onIonInput?: (event: { detail: { value: string } }) => void }) => <input value={value || ''} required={required} type={type || 'text'} onChange={(event) => onIonInput?.({ detail: { value: event.target.value } })} />,
    IonModal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => isOpen ? <section role="dialog">{children}</section> : null,
    IonAlert: ({ isOpen, buttons, onDidDismiss }: { isOpen: boolean; buttons: { text: string; handler?: () => void }[]; onDidDismiss: () => void }) => isOpen ? <section role="alertdialog">{buttons.map((button) => <button key={button.text} onClick={() => { button.handler?.(); onDidDismiss(); }}>{button.text}</button>)}</section> : null,
    IonToast: () => null,
  };
});

const largeId = '9007199254740993123';
const sample = { id: largeId, code: 'EN', name: 'Endangered' };
beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.mocked(getAllIucn).mockResolvedValue({ message: 'OK', data: [sample, { id: '2', code: 'VU', name: 'Vulnerable' }] });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const ready = async () => { render(<IucnPage />); return screen.findByRole('table', { name: 'Data IUCN' }); };
describe('IUCN presentation and CRUD regression with mocked services', () => {
  it('preserves four columns and searches code/name locally', async () => {
    const table = await ready();
    expect(within(table).getAllByRole('columnheader').map(n => n.textContent)).toEqual(['No', 'Kode', 'Nama Status', 'Aksi']);
    const search = screen.getByRole('textbox', { name: 'Cari kode atau nama IUCN' });
    fireEvent.change(search, { target: { value: 'en' } });
    expect(within(table).queryByText('Vulnerable')).toBeNull();
    fireEvent.change(search, { target: { value: 'VULNERABLE' } });
    expect(within(table).getByText('VU')).toBeDefined();
    expect(getAllIucn).toHaveBeenCalledTimes(1);
    fireEvent.change(search, { target: { value: 'missing' } });
    expect(screen.getByText('Tidak ada IUCN yang cocok dengan pencarian.')).toBeDefined();
  });
  it('shows loading until the request settles', () => {
    vi.mocked(getAllIucn).mockReturnValue(new Promise(() => undefined));
    render(<IucnPage />); expect(screen.getByRole('status')).toBeDefined();
  });
  it.each([false, true])('recognizes empty success or verified empty 404: %s', async (notFound) => {
    if (notFound) vi.mocked(getAllIucn).mockRejectedValueOnce({ response: { status: 404, data: { error: 'Data IUCN tidak ditemukan' } } });
    else vi.mocked(getAllIucn).mockResolvedValueOnce({ message: 'OK', data: [] });
    render(<IucnPage />); expect(await screen.findByText('Belum ada data IUCN.')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it.each([401, 403, 404, 500])('retains error status %s and retries', async (status) => {
    vi.mocked(getAllIucn).mockRejectedValueOnce({ response: { status, data: { error: 'Request gagal' } } });
    render(<IucnPage />);
    expect((await screen.findByRole('alert')).textContent).toContain(status === 500 ? 'Gagal memuat' : 'Request gagal');
    expect(screen.queryByText('Belum ada data IUCN.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
    await screen.findByRole('table'); expect(getAllIucn).toHaveBeenCalledTimes(2);
  });
  it('opens detail with the exact string ID and cancels forms/deletion', async () => {
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Lihat detail EN' }));
    expect(within(screen.getByRole('dialog')).getByText(largeId)).toBeDefined();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Data' }));
    let dialog = screen.getByRole('dialog');
    expect(dialog.querySelectorAll('input[required]')).toHaveLength(2);
    fireEvent.submit(dialog.querySelector('form')!);
    expect(createIucn).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit EN' })); dialog = screen.getByRole('dialog');
    expect(within(dialog).getByDisplayValue('EN')).toBeDefined();
    fireEvent.change(dialog.querySelector('input')!, { target: { value: ' ' } });
    fireEvent.submit(dialog.querySelector('form')!); expect(editIucn).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hapus EN' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Batal' }));
    expect(deleteIucn).not.toHaveBeenCalled();
  });
  it('preserves create/edit arguments and exact ID using mocked writes only', async () => {
    vi.mocked(createIucn).mockResolvedValue({ message: 'OK', data: sample });
    vi.mocked(editIucn).mockResolvedValue({ message: 'OK', data: sample });
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Tambah Data' }));
    let dialog = screen.getByRole('dialog'); let inputs = dialog.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: ' CR ' } });
    fireEvent.change(inputs[1], { target: { value: 'Critical' } });
    fireEvent.submit(dialog.querySelector('form')!);
    await waitFor(() => expect(createIucn).toHaveBeenCalledWith(' CR ', 'Critical'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByRole('table'); fireEvent.click(screen.getByRole('button', { name: 'Edit EN' }));
    dialog = screen.getByRole('dialog'); inputs = dialog.querySelectorAll('input');
    fireEvent.change(inputs[1], { target: { value: 'Updated name' } });
    fireEvent.submit(dialog.querySelector('form')!);
    await waitFor(() => expect(editIucn).toHaveBeenCalledWith(largeId, 'EN', 'Updated name'));
  });
  it('preserves the in-use deletion error without calling a real API', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    vi.mocked(deleteIucn).mockRejectedValue({ response: { data: { error: 'IUCN masih digunakan oleh spesies' } } });
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Hapus EN' }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Hapus' }));
    await waitFor(() => expect(alert).toHaveBeenCalledWith('IUCN masih digunakan oleh spesies'));
    expect(deleteIucn).toHaveBeenCalledWith(largeId);
    expect(screen.getByRole('table')).toBeDefined();
  });
});
