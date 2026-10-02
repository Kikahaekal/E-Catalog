import React, { useEffect, useState } from 'react';
import { Navigate, Route, useNavigate } from 'react-router-dom';
import { 
  IonApp, 
  IonRouterOutlet, 
  setupIonicReact,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonMenuToggle
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import LoginPage from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AdminPage from './pages/Admin/Admin';
import AdminRoute from './components/AdminRoute';
import IucnPage from './pages/Admin/master/Iucn/Iucn';
import RegencyPage from './pages/Admin/master/Regency/Regency';
import WppZonePage from './pages/Admin/master/WppZone/WppZone';
import SpeciesPage from './pages/Admin/master/Species/Species';
import SpeciesSearchPage from './pages/SpeciesSearch';
import SpeciesDetailPage from './pages/SpeciesDetail';
import FishSubmissionPage from './pages/FishSubmission';
import FishSubmissionsAdminPage from './pages/Admin/FishSubmissions/FishSubmissions';
import { logout } from './services/user';

const AdminLogoutItem: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('role')?.toLowerCase() === 'admin');

  useEffect(() => {
    const updateRole = () => setIsAdmin(localStorage.getItem('role')?.toLowerCase() === 'admin');
    window.addEventListener('admin-auth-changed', updateRole);
    window.addEventListener('storage', updateRole);
    return () => {
      window.removeEventListener('admin-auth-changed', updateRole);
      window.removeEventListener('storage', updateRole);
    };
  }, []);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('admin-auth-changed'));
    navigate('/login', { replace: true });
  };

  if (!isAdmin) return null;

  return (
    <IonMenuToggle>
      <IonItem button onClick={handleLogout}>
        <IonLabel>Logout</IonLabel>
      </IonItem>
    </IonMenuToggle>
  );
};

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      {/* kesini (menu layout) */}
      <IonMenu menuId="main-menu" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Utama</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem routerLink="/home" routerDirection="none">
              <IonLabel>Home</IonLabel>
            </IonItem>

            <IonItem routerLink="/tambah-ikan" routerDirection="none">
              <IonLabel>Usulkan Nama Ikan</IonLabel>
            </IonItem>
            <AdminLogoutItem />

            {/* nanti tambah menu lain disini */}
          </IonList>
        </IonContent>
      </IonMenu>

      {/* menu admin */}
      <IonMenu menuId="admin-menu" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Admin</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem routerLink="/admin" routerDirection="none">
              <IonLabel>Dashboard Admin</IonLabel>
            </IonItem>
            <IonListHeader className="ion-padding-top">
              <IonLabel>Master Data</IonLabel>
            </IonListHeader>
            <IonItem routerLink="/iucn" routerDirection="none">
              <IonLabel>Data IUCN</IonLabel>
            </IonItem>
            <IonItem routerLink="/daerah" routerDirection="none">
              <IonLabel>Data Daerah</IonLabel>
            </IonItem>
            <IonItem routerLink="/wpp" routerDirection="none">
              <IonLabel>Data Zona WPP</IonLabel>
            </IonItem>
            <IonItem routerLink="/spesies" routerDirection="none">
              <IonLabel>Data Spesies</IonLabel>
            </IonItem>
            <IonItem routerLink="/permintaan-ikan" routerDirection="none">
              <IonLabel>Permintaan Nama Ikan</IonLabel>
            </IonItem>
            <IonItem className="ion-padding-top" routerLink="/home" routerDirection="none">
              <IonLabel>Halaman Utama</IonLabel>
            </IonItem>
            <AdminLogoutItem />
          </IonList>
        </IonContent>
      </IonMenu>

      <IonRouterOutlet id="main-content">
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SpeciesSearchPage />} />
        <Route path="/species/:speciesId" element={<SpeciesDetailPage />} />
        <Route path="/tambah-ikan" element={<FishSubmissionPage />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }/>
        <Route path="/iucn" element={
          <AdminRoute>
            <IucnPage />
          </AdminRoute>
        }/>
        <Route path="/daerah" element={
          <AdminRoute>
            <RegencyPage />
          </AdminRoute>
        }/>
        <Route path="/wpp" element={
          <AdminRoute>
            <WppZonePage />
          </AdminRoute>
        }/>
        <Route path="/spesies" element={
          <AdminRoute>
            <SpeciesPage />
          </AdminRoute>
        }/>
        <Route path="/permintaan-ikan" element={
          <AdminRoute>
            <FishSubmissionsAdminPage />
          </AdminRoute>
        }/>
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;