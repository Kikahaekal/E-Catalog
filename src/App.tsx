import { Navigate, Route } from 'react-router-dom';
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
  IonListHeader
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

            {/* belum ada halamannya */}
            <IonItem routerLink="/tambah-ikan" routerDirection="none">
              <IonLabel>Form Tambah Ikan</IonLabel>
            </IonItem>

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
            <IonItem className="ion-padding-top" routerLink="/home" routerDirection="none">
              <IonLabel>Halaman Utama</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonRouterOutlet id="main-content">
        <Route path="/home" element={<Home />} />
        {/* <Route path="/tambah-ikan" element={< />} /> */}
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
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;