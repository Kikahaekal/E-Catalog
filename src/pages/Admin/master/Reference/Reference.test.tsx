import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Page from './Reference';
import { getAllReferences as getRecords, createReference as createRecord, editReference as editRecord, deleteReference as deleteRecord } from '../../../../services/reference';
vi.mock('../../../../services/reference', () => ({ getAllReferences: vi.fn(), createReference: vi.fn(), editReference: vi.fn(), deleteReference: vi.fn() }));
vi.mock('../../../../layout/AdminLayout', () => ({ AdminLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
// Keep overlay/input tests deterministic in jsdom; browser checks exercise real Ionic components.
vi.mock('@ionic/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ionic/react')>();
  return {
    ...actual,
    IonButton: ({ children, onClick, disabled, type, 'aria-label': label }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button type={type || 'button'} onClick={onClick} disabled={disabled} aria-label={label}>{children}</button>,
    IonSearchbar: ({ value, onIonInput, placeholder }: { value: string; placeholder: string; onIonInput: (event: { detail: { value: string } }) => void }) => <input aria-label="Cari penulis, judul, sumber, atau kode" placeholder={placeholder} value={value} onChange={(event) => onIonInput({ detail: { value: event.target.value } })} />,
    IonInput: ({ value, onIonInput, required, type, min, max }: { value?: string; required?: boolean; type?: string; min?: number; max?: number; onIonInput?: (event: { detail: { value: string } }) => void }) => <input value={value || ''} required={required} type={type || 'text'} min={min} max={max} onChange={(event) => onIonInput?.({ detail: { value: event.target.value } })} />,
    IonModal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => isOpen ? <section role="dialog">{children}</section> : null,
    IonAlert: ({ isOpen, buttons, onDidDismiss }: { isOpen: boolean; buttons: { text: string; handler?: () => void }[]; onDidDismiss: () => void }) => isOpen ? <section role="alertdialog">{buttons.map((button) => <button key={button.text} onClick={() => { button.handler?.(); onDidDismiss(); }}>{button.text}</button>)}</section> : null,
    IonToast: () => null,
  };
});

const largeId = '9007199254740993123';
const sample = {id:largeId,refCode:21,authors:'Penulis Satu',year:2024,title:'Jurnal Ikan',source:'Sumber ilmiah'};
const other = {id:'2',refCode:null,authors:'Penulis Dua',year:null,title:'Jurnal Laut',source:null};
beforeEach(() => {
  vi.resetAllMocks(); vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.mocked(getRecords).mockResolvedValue({message:'OK',data:[sample,other]});
});
afterEach(() => {cleanup();vi.restoreAllMocks();});
const ready = async () => {render(<Page />);return screen.findByRole('table',{name:"Data Referensi"});};
describe('Reference presentation and preserved CRUD with mocked services',()=>{
 it('preserves every column and existing search fields without refetching',async()=>{
  const table=await ready();expect(within(table).getAllByRole('columnheader').map(n=>n.textContent)).toEqual(["No", "Kode", "Penulis", "Judul", "Tahun", "Aksi"]);
  const search=screen.getByRole('textbox',{name:"Cari penulis, judul, sumber, atau kode"});
  for(const query of ["21", "JURNAL LAUT", "sumber ilmiah", "Penulis Dua"]){fireEvent.change(search,{target:{value:query}});expect(within(table).getAllByRole('row')).toHaveLength(2);}
  expect(getRecords).toHaveBeenCalledTimes(1);
  fireEvent.change(search,{target:{value:'no matching record'}});expect(screen.getByText("Tidak ada referensi yang cocok dengan pencarian.")).toBeDefined();
 });
 it('keeps loading visible until data arrives',()=>{
  vi.mocked(getRecords).mockReturnValue(new Promise(()=>undefined));render(<Page />);expect(screen.getByRole('status')).toBeDefined();expect(screen.queryByRole('table')).toBeNull();
 });
 it('shows an empty state for a successful empty array',async()=>{
  vi.mocked(getRecords).mockResolvedValueOnce({message:'OK',data:[]});render(<Page />);expect(await screen.findByText("Belum ada data referensi.")).toBeDefined();expect(screen.queryByRole('alert')).toBeNull();
 });
 it.each([401,403,404,500])('preserves error %s and retries the existing fetch',async(status)=>{
  vi.mocked(getRecords).mockRejectedValueOnce({response:{status,data:{error:'Request gagal'}}});render(<Page />);
  expect((await screen.findByRole('alert')).textContent).toContain(status === 500 ? 'Gagal memuat' : 'Request gagal');expect(screen.queryByText("Belum ada data referensi.")).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Coba lagi'}));await screen.findByRole('table');expect(getRecords).toHaveBeenCalledTimes(2);
 });
 it('keeps detail values and exact large string ID',async()=>{
  await ready();fireEvent.click(screen.getByRole('button',{name:"Lihat detail Jurnal Ikan"}));const dialog=screen.getByRole('dialog');
  expect(within(dialog).getByText(largeId)).toBeDefined();for(const value of ["21", "Penulis Satu", "2024", "Jurnal Ikan", "Sumber ilmiah"])expect(within(dialog).getByText(value)).toBeDefined();
  fireEvent.click(within(dialog).getByRole('button'));expect(screen.queryByRole('dialog')).toBeNull();
 });
 it('preserves all inputs, required validation, edit values and cancellation',async()=>{
  await ready();fireEvent.click(screen.getByRole('button',{name:'Tambah Data'}));let dialog=screen.getByRole('dialog');
  expect(dialog.querySelectorAll('input')).toHaveLength(["21", "Penulis Satu", "2024", "Jurnal Ikan", "Sumber ilmiah"].length);expect(dialog.querySelectorAll('input[required]')).toHaveLength(2);
  fireEvent.submit(dialog.querySelector('form')!);expect(createRecord).not.toHaveBeenCalled();
  const inputs=dialog.querySelectorAll('input');for(const [i,value] of ["22", " Penulis uji ", "2025", " Judul uji ", " Sumber uji "].entries())fireEvent.change(inputs[i],{target:{value}});
  for(const index of [1, 3]){const saved=inputs[index].value;fireEvent.change(inputs[index],{target:{value:' '}});fireEvent.submit(dialog.querySelector('form')!);expect(createRecord).not.toHaveBeenCalled();fireEvent.change(inputs[index],{target:{value:saved}});}
  fireEvent.click(within(dialog).getByRole('button',{name:'Batal'}));
  fireEvent.click(screen.getByRole('button',{name:'Edit '+"Jurnal Ikan"}));dialog=screen.getByRole('dialog');
  expect(Array.from(dialog.querySelectorAll('input')).map(n=>n.value)).toEqual(["21", "Penulis Satu", "2024", "Jurnal Ikan", "Sumber ilmiah"]);
  fireEvent.change(dialog.querySelectorAll('input')[[1, 3][0]],{target:{value:' '}});fireEvent.submit(dialog.querySelector('form')!);expect(editRecord).not.toHaveBeenCalled();
  fireEvent.click(within(dialog).getByRole('button',{name:'Batal'}));expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Hapus '+"Jurnal Ikan"}));fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button',{name:'Batal'}));expect(deleteRecord).not.toHaveBeenCalled();
 });
 it('preserves create/edit payloads and ID using mocked writes only',async()=>{
  vi.mocked(createRecord).mockResolvedValue({message:'OK',data:sample});vi.mocked(editRecord).mockResolvedValue({message:'OK',data:sample});
  await ready();fireEvent.click(screen.getByRole('button',{name:'Tambah Data'}));let dialog=screen.getByRole('dialog');
  for(const [i,value] of ["22", " Penulis uji ", "2025", " Judul uji ", " Sumber uji "].entries())fireEvent.change(dialog.querySelectorAll('input')[i],{target:{value}});
  fireEvent.submit(dialog.querySelector('form')!);await waitFor(()=>expect(createRecord).toHaveBeenCalledWith({refCode:22,authors:'Penulis uji',year:2025,title:'Judul uji',source:'Sumber uji'}));await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
  await screen.findByRole('table');fireEvent.click(screen.getByRole('button',{name:'Edit '+"Jurnal Ikan"}));dialog=screen.getByRole('dialog');
  fireEvent.change(dialog.querySelectorAll('input')[3],{target:{value:'Updated value'}});fireEvent.submit(dialog.querySelector('form')!);
  await waitFor(()=>expect(editRecord).toHaveBeenCalledWith(largeId, {refCode:21,authors:'Penulis Satu',year:2024,title:'Updated value',source:'Sumber ilmiah'}));
 });
 it('retains backend delete error and exact ID using a mock',async()=>{
  const alert=vi.spyOn(window,'alert').mockImplementation(()=>undefined);vi.mocked(deleteRecord).mockRejectedValue({response:{data:{error:'Data masih digunakan'}}});
  await ready();fireEvent.click(screen.getByRole('button',{name:'Hapus '+"Jurnal Ikan"}));fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button',{name:'Hapus'}));
  await waitFor(()=>expect(alert).toHaveBeenCalledWith('Data masih digunakan'));expect(deleteRecord).toHaveBeenCalledWith(largeId);expect(screen.getByRole('table')).toBeDefined();
 });
 it('preserves optional null values and existing numeric constraints',async()=>{
  vi.mocked(createRecord).mockResolvedValue({message:'OK',data:sample});
  await ready();fireEvent.click(screen.getByRole('button',{name:'Tambah Data'}));
  const dialog=screen.getByRole('dialog');const inputs=dialog.querySelectorAll('input');
  expect(inputs[0].min).toBe('1');expect(inputs[2].min).toBe('1900');expect(inputs[2].max).toBe('2100');
  fireEvent.change(inputs[1],{target:{value:' Penulis '}});fireEvent.change(inputs[3],{target:{value:' Judul '}});
  fireEvent.submit(dialog.querySelector('form')!);
  await waitFor(()=>expect(createRecord).toHaveBeenCalledWith({refCode:null,authors:'Penulis',year:null,title:'Judul',source:null}));
  await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());await screen.findByRole('table');
  fireEvent.click(screen.getByRole('button',{name:'Edit Jurnal Laut'}));
  expect(Array.from(screen.getByRole('dialog').querySelectorAll('input')).map(n=>n.value)).toEqual(['','Penulis Dua','','Jurnal Laut','']);
 });

});
