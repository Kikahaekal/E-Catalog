import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonSearchbar, 
  IonFooter, 
  IonTitle,
  IonButtons,
  IonMenuButton
} from '@ionic/react';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './Layout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const searchValue = location.pathname === '/search'
        ? searchParams.get('name') || ''
        : '';

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        {/* ion menu button nyambung ke app.tsx */}
                        <IonMenuButton menu="main-menu"/>
                    </IonButtons>
                    <IonSearchbar
                        placeholder="Cari nama ikan lokal..."
                        animated={true}
                        debounce={350}
                        value={searchValue}
                        onIonChange={(event) => {
                            const name = event.detail.value?.trim() || '';
                            navigate(name ? `/search?name=${encodeURIComponent(name)}` : '/search');
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                const name = (event.target as HTMLInputElement).value.trim();
                                navigate(name ? `/search?name=${encodeURIComponent(name)}` : '/search');
                            }
                        }}
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {children}
            </IonContent>

            <IonFooter>
                <IonToolbar>
                    <IonTitle className="footer-text ion-text-center ion-text-sm">
                        © 2026 Universitas Maritim Raja Ali Haji
                    </IonTitle>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};