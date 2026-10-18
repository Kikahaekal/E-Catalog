// Match backend roles while keeping existing lowercase sessions compatible.
export const isAdminRole = (role: string | null | undefined): boolean => {
  const normalizedRole = role?.toUpperCase();
  return normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN';
};
