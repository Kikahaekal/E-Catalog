import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { AdminSidebar } from './components/admin/AdminSidebar';
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
import ReferencePage from './pages/Admin/master/Reference/Reference';
import SpeciesSearchPage from './pages/SpeciesSearch';
import SpeciesSearchResultsPage from './pages/SpeciesSearchResults';
import SpeciesDetailPage from './pages/SpeciesDetail';
import FishSubmissionPage from './pages/FishSubmission';
import FishSubmissionsAdminPage from './pages/Admin/FishSubmissions/FishSubmissions';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AdminSidebar variant="drawer" />

      <IonRouterOutlet id="main-content">
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SpeciesSearchPage />} />
        <Route path="/search/results" element={<SpeciesSearchResultsPage />} />
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
        <Route path="/referensi" element={
          <AdminRoute>
            <ReferencePage />
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
