import { IonImg } from '@ionic/react';
import { MainLayout } from '../layout/MainLayout';
import './Home.css';

const Home: React.FC = () => {
  return (
    <MainLayout>
        <h1>Selamat Datang di E-Catalog</h1>
        <p>Kami adalah pusat data etno-ikhtologi dan keanekaragaman hayati yang secara khusus mendokumentasikan nama-nama lokal, dialek, serta sebutan daerah untuk berbagai jenis ikan di wilayah Provinsi Kepulauan Riau. Berawal dari kekayaan bahari dan keberagaman bahasa lokal di ribuan pulau Kepri—mulai dari Natuna, Anambas, Lingga, Bintan, Karimun, hingga Batam dan Tanjungpinang—platform ini hadir untuk menjembatani identifikasi ilmiah ikan dengan warisan tutur masyarakat pesisir.</p>
        <p>Saat ini, platform kami menghimpun ribuan data sebutan lokal ikan yang dikumpulkan dari ratusan titik pemukiman pesisir dan wilayah pulau terluar. Setiap entri dilengkapi dengan penamaan ilmiah (taksonomi), foto dokumentasi, wilayah penyebaran spesifik per kabupaten/kota, serta catatan linguistik atau asal-usul penamaan daerah setempat.</p>
        <p>Kehadiran basis data ini dirancang untuk memenuhi kebutuhan berbagai kalangan: peneliti kelautan, ahli linguistik, pengambil kebijakan perikanan, pegiat konservasi, hingga masyarakat umum. Melalui dokumentasi yang terstruktur, platform ini bertujuan melestarikan warisan budaya tutur bahari Kepri, mencegah kepunahan istilah lokal, serta mendukung pengelolaan perikanan berkelanjutan berbasis kearifan lokal.</p>
    </MainLayout>
  );
};

export default Home;
