import { isAdminRole } from './roles';

export const hasAdminSession = (): boolean =>
  Boolean(localStorage.getItem('token')) && isAdminRole(localStorage.getItem('role'));

export const subscribeAuthSession = (notify: () => void): (() => void) => {
  window.addEventListener('admin-auth-changed', notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener('admin-auth-changed', notify);
    window.removeEventListener('storage', notify);
  };
};

// Do not let a delayed response from an older session invalidate a new login.
export const invalidateAuthSession = (expectedToken: string): void => {
  if (localStorage.getItem('token') !== expectedToken) return;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.dispatchEvent(new Event('admin-auth-changed'));
};
