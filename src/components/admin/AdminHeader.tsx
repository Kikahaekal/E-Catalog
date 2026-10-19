import React from 'react';
import { IonMenuButton } from '@ionic/react';

interface AdminHeaderProps {
  title: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, sidebarOpen, onToggleSidebar }) => (
  <header className="admin-header">
    <div className="admin-header__heading">
      <button className="admin-header__desktop-toggle" type="button" aria-label={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'} aria-expanded={sidebarOpen} aria-controls="admin-desktop-sidebar" onClick={onToggleSidebar}>
        <img src="/assets/admin/menu.svg" alt="" />
      </button>
      <IonMenuButton className="admin-header__mobile-toggle" menu="admin-menu" autoHide={false} aria-label="Buka navigasi Admin">
        <img src="/assets/admin/menu.svg" alt="" />
      </IonMenuButton>
      <h1>{title}</h1>
    </div>
    <span className="admin-header__account" role="img" aria-label="Akun administrator"><img src="/assets/admin/account.svg" alt="" /></span>
  </header>
);
