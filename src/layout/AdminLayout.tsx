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

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        {/* ion menu button nyambung ke app.tsx */}
                        <IonMenuButton menu="admin-menu"/>
                    </IonButtons>
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