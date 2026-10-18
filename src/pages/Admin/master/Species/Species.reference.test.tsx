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
    IonSelect: ({ children, value, multiple, onIonChange, placeholder }: { children: React.ReactNode; value?: string | number | boolean | (string | number)[]; multiple?: boolean; placeholder?: string; onIonChange: (event: { detail: { value: unknown } }) => void }) => {
      const options = React.Children.toArray(children) as React.ReactElement<{ value: string | number | boolean }>[];
      return <select aria-label={placeholder} multiple={multiple} value={Array.isArray(value) ? value.map(String) : String(value ?? '')} onChange={event => onIonChange({ detail: { value: options.find(option => String(option.props.value) === event.target.value)?.props.value } })}><option value="">Pilih</option>{children}</select>;
    },
    IonSelectOption: ({ children, value }: { children: React.ReactNode; value: string | number | boolean }) => <option value={String(value)}>{children}</option>,
    IonToast: () => null,
  };
});

const largeId = '9007199254740993123';
const referenceId = '9007199254740993125';
const sample: Species = { id: largeId, commonName: 'Ikan Uji', scientificName: 'Species example', iucnStatusId: 1, references: [{ referenceId, isMainRef: true, reference: { id: referenceId, title: 'Jurnal besar' } }] };
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getAllSpecies).mockResolvedValue({ message: 'OK', data: [sample] });
  vi.mocked(getAllIucn).mockResolvedValue({ message: 'OK', data: [{ id: 1, code: 'EN', name: 'Endangered' }] });
  vi.mocked(getAllReferences).mockResolvedValue({ message: 'OK', data: [{ id: referenceId, authors: 'Author', title: 'Jurnal besar' }] });
  vi.mocked(getAllRegencies).mockResolvedValue({ message: 'OK', data: [] });
  vi.mocked(getAllWpp).mockResolvedValue({ message: 'OK', data: [] });
  vi.mocked(createSpecies).mockResolvedValue({ message: 'OK', data: sample });
  vi.mocked(editSpecies).mockResolvedValue({ message: 'OK', data: sample });
});
afterEach(() => { expect(deleteSpecies).not.toHaveBeenCalled(); cleanup(); vi.restoreAllMocks(); });
const ready = async () => { render(<SpeciesPage />); await screen.findByRole('table'); };

describe('Reference BigInt IDs remain strings through forms and mocked payloads', () => {
  it('keeps an existing relation exact when opening and saving edit', async () => {
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Edit Ikan Uji' }));
    const dialog = screen.getByRole('dialog'); const select = within(dialog).getByRole('combobox', { name: 'Pilih referensi' });
    expect((select as HTMLSelectElement).value).toBe(referenceId);
    fireEvent.submit(dialog.querySelector('form')!);
    await waitFor(() => expect(editSpecies).toHaveBeenCalledWith(largeId, expect.objectContaining({ references: [{ referenceId, isMainRef: true }], iucnStatusId: 1 })));
    expect(createSpecies).not.toHaveBeenCalled();
  });
  it('sends selected large IDs unchanged on create and excludes blank reference rows', async () => {
    await ready(); fireEvent.click(screen.getByRole('button', { name: 'Tambah Data' }));
    const dialog = screen.getByRole('dialog'); const inputs = dialog.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'Ikan baru' } }); fireEvent.change(inputs[1], { target: { value: 'Species new' } });
    fireEvent.change(within(dialog).getByRole('combobox', { name: 'Pilih IUCN' }), { target: { value: '1' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Tambah Referensi' }));
    const select = within(dialog).getByRole('combobox', { name: 'Pilih referensi' });
    expect(select.querySelector(`option[value="${referenceId}"]`)).not.toBeNull();
    fireEvent.change(select, { target: { value: referenceId } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Tambah Referensi' }));
    fireEvent.submit(dialog.querySelector('form')!);
    await waitFor(() => expect(createSpecies).toHaveBeenCalledWith(expect.objectContaining({ references: [{ referenceId, isMainRef: false }], iucnStatusId: 1, commonName: 'Ikan baru' })));
    expect(editSpecies).not.toHaveBeenCalled();
  });
});
