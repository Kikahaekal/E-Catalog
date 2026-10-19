import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasImageBackground = ['/home', '/search', '/tambah-ikan'].includes(location.pathname);
  const whiteLinkStyle: React.CSSProperties = { color: '#ffffff' };

  useEffect(() => {
    const handleScroll = (event?: Event) => {
      const contentScrollTop = event instanceof CustomEvent ? Number(event.detail) : window.scrollY;
      setIsScrolled(contentScrollTop > 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('app-content-scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('app-content-scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/home' || path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`site-navbar fixed top-0 left-0 z-50 w-full transition-all duration-300 ${hasImageBackground
          ? isScrolled
            ? 'bg-[#00182C]/85 backdrop-blur-xl shadow-lg border-b border-white/15 py-5'
            : 'bg-transparent py-5'
          : 'bg-[#00182C] shadow-md border-b border-white/10 py-5'
        } translate-y-0`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex flex-col items-start text-white drop-shadow-md hover:opacity-90 transition-opacity"
          style={whiteLinkStyle}
        >
          <span className="font-marhey text-3xl md:text-4xl tracking-wide leading-none">FIshKP</span>
          <span className="mt-1 font-sans text-[9px] sm:text-[10px] md:text-xs leading-tight">
            Fisheries Information System Knowledge-based Platform
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-8 text-[15px] font-medium text-white">
            <Link
              to="/home"
              style={whiteLinkStyle}
              className={`relative py-1 transition-colors hover:text-white ${isActive('/home')
                  ? 'text-white font-semibold after:content-[\'\'] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                  : 'text-white'
                }`}
            >
              Home
            </Link>

            <Link
              to="/search"
              style={whiteLinkStyle}
              className={`relative py-1 transition-colors hover:text-white ${isActive('/search')
                  ? 'text-white font-semibold after:content-[\'\'] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                  : 'text-white'
                }`}
            >
              Search
            </Link>

            <Link
              to="/tambah-ikan"
              style={whiteLinkStyle}
              className={`relative py-1 transition-colors hover:text-white ${isActive('/tambah-ikan')
                  ? 'text-white font-semibold after:content-[\'\'] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                  : 'text-white'
                }`}
            >
              Usulan Nama Ikan
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
          aria-controls="public-mobile-navigation"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        id="public-mobile-navigation"
        inert={!isMenuOpen}
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden px-6 ${isMenuOpen ? 'max-h-64 opacity-100 pt-3 pb-4' : 'max-h-0 opacity-0 py-0'
          }`}
      >
        <div className="bg-[#031B33]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          <Link
            to="/home"
            onClick={() => setIsMenuOpen(false)}
            style={whiteLinkStyle}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/home') ? 'bg-white/15 text-white' : 'text-white hover:bg-white/10'
              }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setIsMenuOpen(false)}
            style={whiteLinkStyle}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/search') ? 'bg-white/15 text-white' : 'text-white hover:bg-white/10'
              }`}
          >
            Search
          </Link>
          <Link
            to="/tambah-ikan"
            onClick={() => setIsMenuOpen(false)}
            style={whiteLinkStyle}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/tambah-ikan') ? 'bg-white/15 text-white' : 'text-white hover:bg-white/10'
              }`}
          >
            Usulan Nama Ikan
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
