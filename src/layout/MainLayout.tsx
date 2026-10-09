import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonFooter, 
  IonTitle,
  IonButtons,
    IonButton
} from '@ionic/react';
import React from 'react';
import './Layout.css';
import Navbar from '../components/ui/Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <IonPage>
            <Navbar />

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