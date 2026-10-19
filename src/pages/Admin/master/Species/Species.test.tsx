import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import SpeciesPage from './Species';
import { createSpecies, deleteSpecies, editSpecies, getAllSpecies, Species } from '../../../../services/species';
import { getAllIucn } from '../../../../services/iucn';
import { getAllReferences } from '../../../../services/reference';
import { getAllRegencies } from '../../../../services/regency';
import { getAllWpp } from '../../../../services/wpp';

vi.mock('../../../../services/species', () => ({ getAllSpecies: vi.fn(), createSpecies: vi.fn(), editSpecies: vi.fn(), deleteSpecies: vi.fn() }));
vi.mock('../../../../services/iucn', () => ({ getAllIucn: vi.fn() }));
vi.mock('../../../../services/reference', () => ({ getAllReferences: vi.fn() }));
vi.mock('../../../../services/regency', () => ({ getAllRegencies: vi.fn() }));
vi.mock('../../../../services/wpp', () => ({ getAllWpp: vi.fn() }));
vi.mock('../../../../layout/AdminLayout', () => ({ AdminLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));

// Keep overlay/input tests deterministic in jsdom; browser checks exercise real Ionic components.
vi.mock('@ionic/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ionic/react')>();
  return {
    ...actual,
    IonButton: ({ children, onClick, disabled, type, 'aria-label': label }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button type={type || 'button'} onClick={onClick} disabled={disabled} aria-label={label}>{children}</button>,
    IonSearchbar: ({ value, onIonInput, placeholder }: { value: string; placeholder: string; onIonInput: (event: { detail: { value: string } }) => void }) => <input aria-label="Cari nama spesies" placeholder={placeholder} value={value} onChange={(event) => onIonInput({ detail: { value: event.target.value } })} />,
    IonInput: ({ value, onIonInput, required, type }: { value?: string; required?: boolean; type?: string; onIonInput?: (event: { detail: { value: string } }) => void }) => <input value={value || ''} required={required} type={type || 'text'} onChange={(event) => onIonInput?.({ detail: { value: event.target.value } })} />,
    IonModal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => isOpen ? <section role="dialog">{children}</section> : null,
    IonAlert: ({ isOpen, buttons, onDidDismiss }: { isOpen: boolean; buttons: { text: string; handler?: () => void }[]; onDidDismiss: () => void }) => isOpen ? <section role="alertdialog">{buttons.map((button) => <button key={button.text} onClick={() => { button.handler?.(); onDidDismiss(); }}>{button.text}</button>)}</section> : null,
    IonToast: () => null,
  };
});

const largeId = '9007199254740993123';
const sample: Species = {
  id: largeId, commonName: 'Ikan Sekedung Kading', scientificName: 'Thunnus albacares', author: 'Author contoh', iucnStatusId: 1,
  synonyms: [{ scientificName: 'Sinonim contoh', author: 'Penulis', status: 'Sinonim' }],
  localNames: [{ name: 'Nama lokal contoh', regionNote: 'Bintan' }],
  photos: [{ filePath: 'uploads/example.jpg', caption: 'Foto contoh', isPrimary: true }],
  references: [{ referenceId: 3, isMainRef: true, reference: { id: 3, title: 'Jurnal contoh' } }],
  regencies: [{ id: 4, regency: { id: 4, name: 'Bintan', province: 'Kepri' } }],
  wppZones: [{ id: 5, wppZone: { id: 5, code: '711', description: 'Zona contoh' } }],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [sample, { id: '99', commonName: 'Ikan Lain', scientificName: 'Other species' }] });
  vi.mocked(getAllIucn).mockResolvedValue({ message: 'OK', data: [{ id: 1, code: 'EN', name: 'Endangered' }] });
  vi.mocked(getAllReferences).mockResolvedValue({ message: 'OK', data: [{ id: 3, authors: 'Author', title: 'Jurnal contoh' }] });
  vi.mocked(getAllRegencies).mockResolvedValue({ message: 'OK', data: [{ id: 4, name: 'Bintan', province: 'Kepri' }] });
  vi.mocked(getAllWpp).mockResolvedValue({ message: 'OK', data: [{ id: 5, code: '711', description: 'Zona contoh' }] });
});

afterEach(() => {
  expect(createSpecies).not.toHaveBeenCalled();
  expect(editSpecies).not.toHaveBeenCalled();
  expect(deleteSpecies).not.toHaveBeenCalled();
  cleanup();
  vi.restoreAllMocks();
});

const ready = async () => { render(<SpeciesPage />); return screen.findByRole('table', { name: 'Data spesies' }); };

describe('Data Spesies presentation regression', () => {
  it('renders four columns and filters by common or scientific name without another request', async () => {
    const table = await ready();
    expect(within(table).getAllByRole('columnheader').map((node) => node.textContent)).toEqual(['Nama Umum', 'Nama Ilmiah', 'Status IUCN', 'Aksi']);
    const search = screen.getByRole('textbox', { name: 'Cari nama spesies' });
    fireEvent.change(search, { target: { value: 'sekedung' } });
    expect(within(table).queryByText('Ikan Lain')).toBeNull();
    fireEvent.change(search, { target: { value: 'OTHER SPECIES' } });
    expect(within(table).getByText('Ikan Lain')).toBeDefined();
    expect(getAllSpecies).toHaveBeenCalledTimes(1);
  });

  it('keeps loading visible until the existing request settles', () => {
    vi.mocked(getAllSpecies).mockReturnValue(new Promise(() => undefined));
    render(<SpeciesPage />);
    expect(screen.getByRole('status')).toBeDefined();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('distinguishes an empty database from an unmatched search', async () => {
    vi.mocked(getAllSpecies).mockResolvedValueOnce({ message: 'OK', data: [] });
    render(<SpeciesPage />);
    expect(await screen.findByText('Belum ada spesies terdaftar.')).toBeDefined();
    cleanup();
    await ready();
    fireEvent.change(screen.getByRole('textbox', { name: 'Cari nama spesies' }), { target: { value: 'Tidak cocok' } });
    expect(screen.getByText('Tidak ada spesies yang cocok dengan pencarian.')).toBeDefined();
  });

  it('retries using the existing fetch flow after an API error', async () => {
    vi.mocked(getAllSpecies).mockRejectedValueOnce({ response: { data: { error: 'Server tidak tersedia' } } });
    render(<SpeciesPage />);
    expect((await screen.findByRole('alert')).textContent).toContain('Server tidak tersedia');
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
    await screen.findByRole('table');
    expect(getAllSpecies).toHaveBeenCalledTimes(2);
    expect(getAllWpp).toHaveBeenCalledTimes(2);
  });

  it('shows the main list but disables forms when a lookup fails', async () => {
    vi.mocked(getAllWpp).mockRejectedValueOnce(new Error('WPP failed'));
    render(<SpeciesPage />);
    await screen.findByRole('alert');
    expect(screen.getByRole('table')).toBeDefined();
    expect((screen.getByRole('button', { name: 'Tambah Data' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: `Edit ${sample.commonName}` }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('opens detail with the exact large string ID and all relationship groups', async () => {
    await ready();
    fireEvent.click(screen.getByRole('button', { name: `Lihat detail ${sample.commonName}` }));
    const detail = screen.getByRole('dialog');
    expect(within(detail).getByText(largeId)).toBeDefined();
    for (const label of ['Sinonim', 'Nama Lokal', 'Foto', 'Referensi', 'Wilayah', 'Zona WPP']) expect(within(detail).getByText(label)).toBeDefined();
    expect(within(detail).getByText('Jurnal contoh (utama)')).toBeDefined();
    fireEvent.click(within(detail).getByRole('button'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens and cancels add/edit forms, preserves fields, and blocks invalid submissions', async () => {
    await ready();
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Data' }));
    let dialog = screen.getByRole('dialog');
    expect(dialog.querySelectorAll('input').length).toBeGreaterThan(25);
    fireEvent.submit(dialog.querySelector('form')!);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: `Edit ${sample.commonName}` }));
    dialog = screen.getByRole('dialog');
    expect((dialog.querySelector('input') as HTMLInputElement).value).toBe(sample.commonName);
    expect(within(dialog).getByDisplayValue('Nama lokal contoh')).toBeDefined();
    expect(within(dialog).getByDisplayValue('uploads/example.jpg')).toBeDefined();
    fireEvent.change(dialog.querySelector('input')!, { target: { value: ' ' } });
    fireEvent.submit(dialog.querySelector('form')!);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('allows delete cancellation without invoking the mutation', async () => {
    await ready();
    fireEvent.click(screen.getByRole('button', { name: `Hapus ${sample.commonName}` }));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('table')).toBeDefined();
  });
});

describe('Supporting lookup safety', () => {
  it.each(['iucn', 'reference', 'regency', 'wpp'])('keeps species/details safe when %s fails, then retries', async resource => {
    const service = { iucn: getAllIucn, reference: getAllReferences, regency: getAllRegencies, wpp: getAllWpp }[resource];
    vi.mocked(service!).mockRejectedValueOnce({response:{status:503,data:{error:'Internal detail'}}});
    await ready(); expect((screen.getByRole('alert').textContent)).toContain('Tambah/edit dinonaktifkan');
    fireEvent.click(screen.getByRole('button',{name:`Edit ${sample.commonName}`})); expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:`Lihat detail ${sample.commonName}`})); expect(within(screen.getByRole('dialog')).getByText('Jurnal contoh (utama)')).toBeDefined();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button'));
    fireEvent.click(screen.getByRole('button',{name:'Muat ulang lookup'})); await waitFor(()=>expect(screen.queryByRole('alert')).toBeNull());
    expect((screen.getByRole('button',{name:'Tambah Data'}) as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByRole('button',{name:`Edit ${sample.commonName}`})); expect(within(screen.getByRole('dialog')).getByDisplayValue('Nama lokal contoh')).toBeDefined();
  });
  it('normalizes only verified empty IUCN/WPP and keeps main data visible',async()=>{
    vi.mocked(getAllIucn).mockRejectedValueOnce({response:{status:404,data:{error:'Data IUCN tidak ditemukan'}}});
    vi.mocked(getAllWpp).mockRejectedValueOnce({response:{status:404,data:{error:'Data wpp tidak ditemukan'}}});
    await ready(); expect(screen.getByRole('alert').textContent).toContain('Belum ada IUCN');
    expect((screen.getByRole('button',{name:'Tambah Data'}) as HTMLButtonElement).disabled).toBe(true);
  });
});
