import { Link } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';

const NotFound = () => (
  <MainLayout>
    <section className="px-6 pt-40 pb-20 text-center text-[#0C1D34]">
      <p className="text-lg font-semibold">404</p>
      <h1 className="text-3xl font-bold mt-4">Halaman tidak ditemukan</h1>
      <p className="mt-4 mb-8">Periksa alamat halaman atau kembali ke beranda.</p>
      <Link className="underline font-semibold" to="/home">Kembali ke beranda</Link>
    </section>
  </MainLayout>
);

export default NotFound;
