import { describe, expect, it } from 'vitest';
import { isAdminRole } from './roles';

describe('administrator roles', () => {
  it.each(['ADMIN', 'SUPER_ADMIN', 'admin', 'super_admin'])('recognizes %s', (role) => {
    expect(isAdminRole(role)).toBe(true);
  });

  it.each([null, undefined, '', 'USER', 'user', 'SUPERADMIN', 'NOT_ADMIN', 'ADMINISTRATOR'])('rejects %s', (role) => {
    expect(isAdminRole(role)).toBe(false);
  });
});
