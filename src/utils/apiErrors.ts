import { isAxiosError } from 'axios';

const responseOf = (error: unknown): { status?: number; data?: { error?: unknown; message?: unknown } } | undefined => {
  if (!error || typeof error !== 'object' || !('response' in error)) return;
  return error.response as ReturnType<typeof responseOf>;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const response = responseOf(error);
  if (isAxiosError(error) && !response) return 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
  // Never render internal server diagnostics or raw Axios errors/configuration.
  if (response?.status && response.status >= 500) return fallback;
  const message = response?.data?.error || response?.data?.message;
  if (typeof message !== 'string' || !message.trim() || message.length > 240 || [...message].some(char => char.charCodeAt(0) < 32) ||
      /[<>]|bearer\s+\S+|authorization\s*:|(?:password|token)\s*[:=]|eyJ[\w-]+\.[\w-]+\.[\w-]+|prisma|stack trace|\b(?:select|insert|delete)\b.+\b(?:from|into)\b/i.test(message)) return fallback;
  return message.trim();
};

// These exact 404 bodies are explicitly defined by the list controllers.
export const isEmptyMasterList = (error: unknown, resource: 'iucn' | 'wpp'): boolean => {
  const response = responseOf(error);
  return response?.status === 404 && response.data?.error ===
    (resource === 'iucn' ? 'Data IUCN tidak ditemukan' : 'Data wpp tidak ditemukan');
};
