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
import './Layout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        {/* ion menu button nyambung ke app.tsx */}
                        <IonMenuButton />
                    </IonButtons>
                    <IonSearchbar placeholder="Cari nama ikan lokal..." animated={true}></IonSearchbar>
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