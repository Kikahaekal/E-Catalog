import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search/results?name=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/home' || path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-[#031B33]/75 backdrop-blur-xl shadow-lg border-b border-white/15 py-5'
          : 'bg-transparent py-5'
        } translate-y-0`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="font-marhey text-3xl md:text-4xl text-white font-bold tracking-wide drop-shadow-md hover:opacity-90 transition-opacity"
        >
          E-Catalog
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Quick Search Capsule */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <svg
              className="w-4 h-4 text-white/70 absolute left-3.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Cari nama ikan lokal..."
              className="bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-white/75 text-sm rounded-full pl-9 pr-4 py-1.5 w-60 xl:w-72 border border-white/35 focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm transition-all"
            />
          </form>

          {/* Links */}
          <div className="flex items-center gap-6 text-[15px] font-medium text-white">
            <Link
              to="/home"
              className={`relative py-1 transition-colors hover:text-white ${isActive('/home')
                  ? 'text-white font-semibold after:content-[\'\'] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                  : 'text-white/80'
                }`}
            >
              Home
            </Link>

            <Link
              to="/search"
              className={`relative py-1 transition-colors hover:text-white ${isActive('/search')
                  ? 'text-white font-semibold after:content-[\'\'] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                  : 'text-white/80'
                }`}
            >
              Search
            </Link>

            <Link
              to="/tambah-ikan"
              className={`relative py-1 transition-colors hover:text-white ${isActive('/tambah-ikan')
                  ? 'text-white font-semibold after:content-[\'\'] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-white after:rounded-full'
                  : 'text-white/80'
                }`}
            >
              Usulan Nama Ikan
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
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
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden px-6 ${isMenuOpen ? 'max-h-80 opacity-100 pt-3 pb-4' : 'max-h-0 opacity-0 py-0'
          }`}
      >
        <div className="bg-[#031B33]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-1">
            <svg
              className="w-4 h-4 text-white/70 absolute left-3.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Cari nama ikan..."
              className="w-full bg-white/15 text-white placeholder-white/70 text-sm rounded-xl pl-9 pr-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </form>

          <Link
            to="/home"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/home') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/search') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
          >
            Search
          </Link>
          <Link
            to="/tambah-ikan"
            onClick={() => setIsMenuOpen(false)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/tambah-ikan') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
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
