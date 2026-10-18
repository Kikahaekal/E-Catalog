import { describe, expect, it } from 'vitest';
import { AxiosError } from 'axios';
import { getApiErrorMessage, isEmptyMasterList } from './apiErrors';
const error = (status: number, data: object) => ({ response: { status, data } });
describe('Safe API error presentation', () => {
  it.each([{ error: 'Email atau password salah' }, { message: 'Akses ditolak' }])('reads backend envelopes %s', data => {
    expect(getApiErrorMessage(error(401, data), 'Fallback')).toBe(Object.values(data)[0]);
  });
  it.each(['password=secret', 'Authorization: Bearer secret', '<html>detail</html>', 'Prisma error', 'eyJaaa.bbb.ccc'])('suppresses sensitive/internal text %s', message => {
    expect(getApiErrorMessage(error(400, { message }), 'Fallback')).toBe('Fallback');
  });
  it('does not display 5xx diagnostics or Axios transport details', () => {
    expect(getApiErrorMessage(error(500, { error: 'Private database trace' }), 'Server gagal')).toBe('Server gagal');
    expect(getApiErrorMessage(new AxiosError('Authorization: private'), 'Fallback')).toContain('Tidak dapat terhubung');
  });
  it('recognizes only exact list-empty controller responses', () => {
    expect(isEmptyMasterList(error(404, { error: 'Data wpp tidak ditemukan' }), 'wpp')).toBe(true);
    expect(isEmptyMasterList(error(404, { error: 'Data IUCN tidak ditemukan' }), 'iucn')).toBe(true);
    for (const status of [401, 403, 500]) expect(isEmptyMasterList(error(status, { error: 'Data wpp tidak ditemukan' }), 'wpp')).toBe(false);
    expect(isEmptyMasterList(error(404, { message: 'Data wpp tidak ditemukan' }), 'wpp')).toBe(false);
    expect(isEmptyMasterList(error(404, { error: 'Endpoint tidak ditemukan' }), 'wpp')).toBe(false);
  });
});
