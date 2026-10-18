import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

test('offers a safe recovery link for missing pages', () => {
  render(<MemoryRouter><NotFound /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Kembali ke beranda' })).toHaveAttribute('href', '/home');
});
