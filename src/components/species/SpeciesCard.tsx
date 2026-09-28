// ============================================================
// SpeciesCard.tsx — Kartu untuk menampilkan satu jenis ikan
// ============================================================
//
// Analogi sederhana:
// Bayangkan kartu Pokemon, tapi untuk ikan.
// Di kartu ini ada:
//   - Nama ilmiah (dicetak miring, seperti konvensi biologi)
//   - Nama umum (nama sehari-hari dalam bahasa Inggris)
//   - Family (keluarga taksonomi)
//   - Status tangkap (stiker warna: hijau/kuning/merah/abu-abu)
//
// Komponen ini menerima data satu ikan lewat "props"
// (seperti menyerahkan formulir ke petugas loket).
// ============================================================

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/react';
import { Species } from '../../models/Species';
import { labelStatus } from '../../services/speciesService';
import './SpeciesCard.css';

// Props = data yang diterima komponen ini dari luar
// (seperti formulir yang harus diisi sebelum diserahkan)
interface SpeciesCardProps {
  species: Species;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species }) => {
  return (
    // routerLink membuat kartu bisa diklik dan berpindah halaman ke /species/{id}
    <IonCard routerLink={`/species/${species.id}`} button={true}>
      <IonCardHeader>
        {/* Nama ilmiah selalu dicetak miring (konvensi biologi) */}
        <IonCardTitle className="nama-ilmiah">
          {species.namaIlmiah}
        </IonCardTitle>
        <IonCardSubtitle>{species.namaUmum}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <p className="family-text">Family: {species.family}</p>

        {/* Status tangkap: titik warna + teks penjelasan */}
        <div className="status-tangkap">
          <span
            className={`status-dot status-${species.statusTangkap}`}
          ></span>
          <span className="status-label">
            {labelStatus[species.statusTangkap]}
          </span>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default SpeciesCard;
