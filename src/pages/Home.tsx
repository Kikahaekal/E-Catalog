import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';

const Home: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full h-[76vh] min-h-[560px] flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 lg:px-24 bg-[#021426] overflow-hidden">
        {/* Background Image & Cinematic Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 motion-safe:animate-pulse transition-transform duration-1000"
          style={{ backgroundImage: "url('/assets/hero-ocean.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#021426]/75 via-[#021426]/40 to-[#021426]/85" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#021426]/30 to-[#021426]/70 pointer-events-none" />

        {/* Hero Slogan & Subtext Content */}
        <div className="relative z-10 my-auto w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Left: 3-Line Tagline in Marhey Font */}
          <div className="md:col-span-6 lg:col-span-5">
            <h1 className="font-marhey text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-white font-bold leading-[1.35] tracking-wide drop-shadow-lg space-y-2">
              <span className="block">Kenali Ikannya</span>
              <span className="block">Kenali Namanya</span>
              <span className="block">Kenali Keprinya</span>
            </h1>
          </div>

          {/* Right: Vertical Divider & Description */}
          <div className="md:col-span-6 lg:col-span-7 md:border-l-2 md:border-white/60 md:pl-8 lg:pl-10">
            <p className="text-white/95 text-base sm:text-lg font-normal leading-relaxed drop-shadow max-w-md">
              Menjelajahi kekayaan ikan dan keberagaman nama lokal masyarakat pesisir
              Kepulauan Riau menghubungkan pengetahuan ilmiah dengan warisan tutur
              bahari yang hidup dari pulau ke pulau.
            </p>
          </div>
        </div>

        {/* Hero Bottom Navigation Link */}
        <div className="relative z-10 w-full flex justify-end pt-6">
          <Link
            to="/search"
            className="inline-flex items-center gap-2.5 text-white/90 hover:text-white font-medium text-base sm:text-lg transition-all group drop-shadow"
          >
            <span>Jelajahi Data Ikan</span>
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-24 sm:py-28 lg:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1080px] mx-auto space-y-28 sm:space-y-32 lg:space-y-36">
          {/* Row 1: About Us Title & Text on Left, Barelang Bridge on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-marhey text-3xl sm:text-4xl font-bold text-slate-900 tracking-wide">
                About Us
              </h2>
              <p className="text-slate-900 text-sm sm:text-[15px] lg:text-base leading-[1.7] text-left">
                Kami adalah pusat data etno-ikhtologi dan keanekaragaman hayati yang secara
                khusus mendokumentasikan nama-nama lokal, dialek, serta sebutan daerah untuk
                berbagai jenis ikan di wilayah Provinsi Kepulauan Riau. Berawal dari kekayaan
                bahari dan keberagaman bahasa lokal di ribuan pulau Kepri—mulai dari Natuna,
                Anambas, Lingga, Bintan, Karimun, hingga Batam dan Tanjungpinang—platform ini
                hadir untuk menjembatani identifikasi ilmiah ikan dengan warisan tutur masyarakat
                pesisir.
              </p>
            </div>
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <img
                src="/assets/barelang-bridge.jpg"
                alt="Jembatan Barelang dan Perahu Nelayan Tradisional Kepri"
                className="w-full max-w-[440px] aspect-[4/3] object-cover rounded-none"
                loading="lazy"
              />
            </div>
          </div>

          {/* Row 2: Tropical Island Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="md:col-span-5 order-2 md:order-1 flex justify-center md:justify-start">
              <img
                src="/assets/pantai-kepri.jpg"
                alt="Pesisir Tropis dan Terumbu Karang Kepulauan Riau"
                className="w-full max-w-[440px] aspect-[4/3] object-cover rounded-none"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <p className="text-slate-900 text-sm sm:text-[15px] lg:text-base leading-[1.7] text-left">
                Saat ini, platform kami menghimpun ribuan data sebutan lokal ikan yang
                dikumpulkan dari ratusan titik pemukiman pesisir dan wilayah pulau terluar.
                Setiap entri dilengkapi dengan penamaan ilmiah (taksonomi), foto dokumentasi,
                wilayah penyebaran spesifik per kabupaten/kota, serta catatan linguistik atau
                asal-usul penamaan daerah setempat.
              </p>
            </div>
          </div>

          {/* Row 3: Text & Link Left, Vortex Fish Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="md:col-span-7 flex flex-col justify-between">
              <p className="text-slate-900 text-sm sm:text-[15px] lg:text-base leading-[1.7] text-left mb-8 sm:mb-10">
                Kehadiran basis data ini dirancang untuk memenuhi kebutuhan berbagai kalangan:
                peneliti kelautan, ahli linguistik, pengambil kebijakan perikanan, pegiat konservasi,
                hingga masyarakat umum. Melalui dokumentasi yang terstruktur, platform ini bertujuan
                melestarikan warisan budaya tutur bahari Kepri, mencegah kepunahan istilah lokal, serta
                mendukung pengelolaan perikanan berkelanjutan berbasis kearifan lokal.
              </p>
              <div>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2.5 text-slate-900 hover:text-sky-700 text-sm sm:text-[15px] font-medium transition-colors group"
                >
                  <span>Jelajahi Data Ikan</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <img
                src="/assets/school-fish.jpg"
                alt="Kawanan Ikan di Perairan Laut Kepulauan Riau"
                className="w-full max-w-[440px] aspect-[4/3] object-cover rounded-none"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
