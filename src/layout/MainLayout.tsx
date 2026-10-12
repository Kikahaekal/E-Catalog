import { IonPage, IonContent } from '@ionic/react';
import React from 'react';
import Navbar from '../components/ui/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <IonPage>
      <Navbar />

      <IonContent
        fullscreen
        scrollEvents
        className="[--background:#ffffff]"
        onIonScroll={(event) => {
          window.dispatchEvent(new CustomEvent('app-content-scroll', {
            detail: event.detail.scrollTop,
          }));
        }}
      >
        <div className="min-h-screen flex flex-col justify-between bg-white">
          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-[#031B33] text-gray-300 py-7 text-center text-sm font-medium border-t border-white/10 tracking-wide">
            © 2026 Universitas Maritim Raja Ali Haji
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
};
