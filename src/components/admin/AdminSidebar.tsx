import React, { useEffect, useState } from 'react';
import { IonContent, IonMenu, IonMenuToggle } from '@ionic/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../services/user';
import { isAdminRole } from '../../utils/roles';

const navigation = [
  { path: '/admin', label: 'Dashboard', group: 'Dashboard' },
  { path: '/iucn', label: 'IUCN', group: 'Kelola Konten' },
  { path: '/wpp', label: 'Zona WPP', group: 'Kelola Konten' },
  { path: '/referensi', label: 'Referensi', group: 'Kelola Konten' },
  { path: '/spesies', label: 'Data Spesies', group: 'Kelola Konten' },
  { path: '/daerah', label: 'Daerah', group: 'Kelola Konten' },
  { path: '/permintaan-ikan', label: 'Permintaan Ikan', group: 'Layanan Pengguna' },
  { path: '/home', label: 'Halaman Utama', group: 'Layanan Pengguna' },
];

export function AdminSidebar({ variant = 'desktop' }: { variant?: 'desktop' | 'drawer' }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(() => Boolean(localStorage.getItem('token')) && isAdminRole(localStorage.getItem('role')));
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const updateAuth = () => setAuthorized(Boolean(localStorage.getItem('token')) && isAdminRole(localStorage.getItem('role')));
    const media = window.matchMedia('(min-width: 1024px)');
    const updateWidth = () => setDesktop(media.matches);
    media.addEventListener?.('change', updateWidth);
    window.addEventListener('admin-auth-changed', updateAuth);
    window.addEventListener('storage', updateAuth);
    return () => {
      media.removeEventListener?.('change', updateWidth);
      window.removeEventListener('admin-auth-changed', updateAuth);
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout().catch(() => undefined);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.dispatchEvent(new Event('admin-auth-changed'));
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const wrapMenuItem = (content: React.ReactElement, key: string) => variant === 'drawer'
    ? <IonMenuToggle key={key} menu="admin-menu" autoHide={false}>{content}</IonMenuToggle>
    : <React.Fragment key={key}>{content}</React.Fragment>;

  const contents = (
    <div className="admin-sidebar__inner">
      <a className="admin-sidebar__skip" href="#admin-page-content">Langsung ke konten</a>
      <p className="admin-sidebar__brand">E-Catalog</p>
      <nav aria-label="Navigasi Admin" className="admin-sidebar__nav">
        {['Dashboard', 'Kelola Konten', 'Layanan Pengguna'].map((group) => (
          <div className="admin-sidebar__group" key={group}>
            <p className="admin-sidebar__caption">{group}</p>
            {navigation.filter((item) => item.group === group).map((item) => wrapMenuItem(
              <NavLink to={item.path} end className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}>
                {item.path === '/admin' && <img src="/assets/admin/dashboard.svg" alt="" />}
                <span>{item.label}</span>
              </NavLink>, item.path,
            ))}
          </div>
        ))}
      </nav>
      {wrapMenuItem(
        <button className="admin-sidebar__logout" onClick={() => void handleLogout()} disabled={loggingOut}>
          <img src="/assets/admin/logout.svg" alt="" />
          {loggingOut ? 'Keluar…' : 'Log Out'}
        </button>, 'logout',
      )}
    </div>
  );

  if (variant === 'drawer') {
    const adminRoute = navigation.some((item) => item.path !== '/home' && item.path === pathname);
    return (
      <IonMenu className="admin-shell admin-drawer" menuId="admin-menu" contentId="main-content" type="overlay" disabled={desktop || !adminRoute || !authorized}>
        <IonContent>{contents}</IonContent>
      </IonMenu>
    );
  }

  return (
    <aside className="admin-sidebar" aria-label="Sidebar Admin" id="admin-desktop-sidebar">
      <span className="admin-sidebar__divider" aria-hidden="true"><img src="/assets/admin/sidebar-divider.svg" alt="" /></span>
      {contents}
    </aside>
  );
}

// One configuration for the desktop sidebar, Ionic drawer and route-aware header.
AdminSidebar.navigation = navigation;
