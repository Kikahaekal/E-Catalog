import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const title = AdminSidebar.navigation.find((item) => item.path === pathname)?.label || 'Admin';

  return (
    <IonPage className={`admin-shell admin-layout${sidebarOpen ? '' : ' admin-layout--collapsed'}`}>
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminHeader title={title} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <IonContent className="admin-layout__content">
          <main className="admin-layout__body" id="admin-page-content" tabIndex={-1}>{children}</main>
        </IonContent>
      </div>
    </IonPage>
  );
};
