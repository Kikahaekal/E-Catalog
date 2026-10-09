import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Sesuaikan jika menggunakan Next.js (import Link from 'next/link')

const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTransparent, setIsTransparent] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight; 

      // Logika menyembunyikan navbar saat scroll ke bawah
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); 
        setIsMenuOpen(false); // Tutup menu mobile saat scroll
      } else {
        setIsVisible(true);  
      }

      // Logika transparansi (berubah warna setelah melewati hero image)
      if (currentScrollY < heroHeight - 80) {
        setIsTransparent(true);
      } else {
        setIsTransparent(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Styling background: Transparan di atas, Biru saat di-scroll
  const navStyles = isTransparent
    ? 'bg-transparent text-white'
    : 'bg-blue-600 text-white shadow-lg'; // Ubah 'bg-blue-600' ke shade biru lain jika diperlukan

  const hoverStyles = isTransparent
    ? 'transition-colors hover:text-gray-300'
    : 'transition-opacity hover:opacity-80';

  return (
    <nav 
      className={`fixed top-0 left-0 z-50 w-full px-6 md:px-12 lg:px-24 py-5 transition-all duration-300 ease-in-out ${navStyles} ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link to="/" className="font-marhey text-3xl md:text-4xl tracking-wide">
            E-Catalog
          </Link>
          
          {/* Hamburger Icon (Mobile) */}
          <button 
            className="block lg:hidden ml-4 focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-lg font-medium">
          <Link to="/" className={hoverStyles}>Home</Link>
          <Link to="/search" className={hoverStyles}>Search</Link>
          <Link to="/tambah-ikan" className={hoverStyles}>Usulan nama ikan</Link>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className={`flex flex-col gap-4 p-5 rounded-xl ${isTransparent ? 'bg-black/80 text-white' : 'bg-blue-700 text-white shadow-inner'}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/search" onClick={() => setIsMenuOpen(false)}>Search</Link>
          <Link to="/tambah-ikan" onClick={() => setIsMenuOpen(false)}>Usulan nama ikan</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;