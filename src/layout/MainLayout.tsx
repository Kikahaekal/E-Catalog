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
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil kata kunci dari URL jika sedang berada di halaman /search
    const queryParams = new URLSearchParams(location.search);
    const queryAwal = queryParams.get('q') || '';

    // State untuk menyimpan teks yang diketik di bilah pencarian
    const [kataKunci, setKataKunci] = useState(queryAwal);

    // Sinkronkan isi search bar jika query URL berubah (misal navigasi mundur/maju)
    useEffect(() => {
        setKataKunci(queryAwal);
    }, [queryAwal]);

    // Fungsi pencarian saat pengguna menekan tombol Enter
    const handleCari = () => {
        const kataBersih = kataKunci.trim();
        if (kataBersih) {
            navigate(`/search?q=${encodeURIComponent(kataBersih)}`);
        } else {
            navigate('/search');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCari();
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        {/* ion menu button nyambung ke app.tsx */}
                        <IonMenuButton />
                    </IonButtons>
                    <IonSearchbar 
                        value={kataKunci}
                        onIonInput={(e) => setKataKunci(e.detail.value ?? '')}
                        onKeyDown={handleKeyDown}
                        onIonClear={() => {
                            setKataKunci('');
                            navigate('/search');
                        }}
                        placeholder="Cari nama ikan lokal..." 
                        animated={true}
                        showClearButton="focus"
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