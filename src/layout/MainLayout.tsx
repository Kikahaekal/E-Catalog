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

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/home" routerDirection="root">Home</IonButton>
                        <IonButton routerLink="/search" routerDirection="root">Search</IonButton>
                        <IonButton routerLink="/tambah-ikan" routerDirection="root">Usulkan Nama Ikan</IonButton>
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