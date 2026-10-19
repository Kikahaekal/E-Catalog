import axios, { isAxiosError } from 'axios';
import { invalidateAuthSession } from '../utils/authSession';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(response => response, (error: unknown) => {
  if (isAxiosError(error) && error.config) {
    const { config, response } = error;
    const base = new URL(config.baseURL || window.location.origin, window.location.origin);
    const url = new URL(config.url || '', base);
    const method = (config.method || 'get').toLowerCase();
    const protectedRequest = url.origin === base.origin && (
      (method === 'get' && /^\/api\/fish\/submissions\/?$/.test(url.pathname)) ||
      (['post', 'put', 'delete'].includes(method) && /^\/api\/(?:species|iucn|wpp|reference|regency)(?:\/[^/]+)?\/?$/.test(url.pathname)) ||
      (method === 'post' && /^\/api\/(?:fish\/approve\/[^/]+|auth\/logout)\/?$/.test(url.pathname)) ||
      (method === 'delete' && /^\/api\/fish\/reject\/[^/]+\/?$/.test(url.pathname))
    );
    const invalidSession = response?.status === 401 ||
      (response?.status === 403 && response.data?.message === 'Token tidak valid atau kadaluwarsa.');
    const token = localStorage.getItem('token');
    if (protectedRequest && invalidSession && token && config.headers.get('Authorization') === `Bearer ${token}`) {
      invalidateAuthSession(token);
    }
  }
  return Promise.reject(error);
});
