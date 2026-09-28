// ============================================================
// SpeciesDetail.tsx — Halaman detail informasi satu jenis ikan
// ============================================================
//
// Analogi sederhana:
// Kalau SearchResults itu daftar etalase di toko, maka halaman ini
// adalah halaman saat kita mengambil satu barang dari etalase
// untuk melihat detail lengkapnya:
//   - Nama latin dan nama sehari-hari
//   - Status apakah aman ditangkap atau tidak
//   - Silsilah keluarga ikan (klasifikasi)
//   - Nama julukan di berbagai daerah Kepri
//   - Status kelestarian dunia (IUCN) dan wilayah perairan
//   - Foto ikan (atau kotak pengganti jika belum ada foto)
//
// Halaman ini dibungkus MainLayout agar memiliki header, menu samping,
// dan footer yang seragam dengan halaman lainnya.
// ============================================================

import React from 'react';
import { useParams } from 'react-router-dom';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { MainLayout } from '../../layout/MainLayout';
import { ambilSpesiesById, ambilNamaLokal, labelStatus } from '../../services/speciesService';
import './SpeciesDetail.css';

const SpeciesDetail: React.FC = () => {
  // useParams = alat untuk membaca variabel di alamat URL web.
  // Contoh alamat: /species/2 → id bernilai "2"
  const params = useParams();

  // ------------------------------------------------------------
  // Kenapa id dari URL harus diubah ke angka (Number)?
  //
  // Analogi:
  // Browser selalu membaca teks di alamat URL sebagai huruf (string),
  // jadi angka 2 terbaca sebagai kata "2" (seperti tulisan di kertas).
  // Sedangkan di data kita (species.json), id disimpan sebagai angka (2).
  // Agar komputer bisa mencocokkannya (2 === 2), kita ubah teks "2"
  // menjadi angka asli menggunakan Number(params.id).
  // ------------------------------------------------------------
  const idAngka = Number(params.id);

  // Minta bantuan pustakawan (speciesService) mencari data ikan dan nama lokalnya
  const species = isNaN(idAngka) ? undefined : ambilSpesiesById(idAngka);
  const daftarNamaLokal = species ? ambilNamaLokal(species.id) : [];

  // Jika ID tidak ditemukan (misal pengguna mengetik /species/999)
  if (!species) {
    return (
      <MainLayout>
        <div className="tidak-ditemukan">
          <h2>🐟 Spesies tidak ditemukan</h2>
          <p>Data ikan dengan nomor ID ini tidak ada dalam katalog kami.</p>
          <IonButton routerLink="/search" fill="outline">
            Kembali ke Pencarian
          </IonButton>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="species-detail-container">
        {/* Tombol kembali ke halaman pencarian */}
        <div className="tombol-kembali-wrapper">
          <IonButton routerLink="/search" fill="clear" size="small">
            ← Kembali ke Pencarian
          </IonButton>
        </div>

        {/* a. Nama ilmiah (miring, besar) dan nama umum */}
        <div className="detail-header">
          <h1 className="nama-ilmiah-besar">{species.namaIlmiah}</h1>
          <p className="nama-umum-besar">{species.namaUmum}</p>
        </div>

        {/* b. Status tangkap: titik warna + teks (sama dengan SpeciesCard) */}
        <div className="status-tangkap-detail">
          <span
            className={`status-dot status-${species.statusTangkap}`}
          ></span>
          <span className="status-label">
            {labelStatus[species.statusTangkap]}
          </span>
        </div>

        {/* c. Klasifikasi: Family, Genus, Spesies */}
        <IonCard className="detail-card">
          <IonCardHeader>
            <IonCardTitle>Klasifikasi</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-baris">
              <span className="info-label">Family</span>
              <span className="info-value">{species.family}</span>
            </div>
            <div className="info-baris">
              <span className="info-label">Genus</span>
              <span className="info-value italic">{species.genus}</span>
            </div>
            <div className="info-baris">
              <span className="info-label">Spesies</span>
              <span className="info-value italic">{species.spesies}</span>
            </div>
          </IonCardContent>
        </IonCard>

        {/* d. Nama lokal: daftar julukan di berbagai daerah */}
        <IonCard className="detail-card">
          <IonCardHeader>
            <IonCardTitle>Nama Lokal & Daerah</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {daftarNamaLokal.length > 0 ? (
              <IonList lines="inset" className="daftar-nama-lokal">
                {daftarNamaLokal.map((nl) => (
                  <IonItem key={nl.id}>
                    <IonLabel>
                      <h3>{nl.nama}</h3>
                      <p>
                        {/* Kalau daerah kosong (""), tulis "Daerah belum tercatat" */}
                        {nl.daerah && nl.daerah.trim() !== ''
                          ? nl.daerah
                          : 'Daerah belum tercatat'}
                      </p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <p className="teks-kosong">Belum ada nama lokal tercatat.</p>
            )}
          </IonCardContent>
        </IonCard>

        {/* e. Status IUCN (global) dan wilayah pengelolaan (wpp) */}
        <IonCard className="detail-card">
          <IonCardHeader>
            <IonCardTitle>Status Konservasi & Wilayah</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-baris">
              <span className="info-label">Status IUCN (Global)</span>
              <span className="info-value">{species.statusIUCN}</span>
            </div>
            <div className="info-baris">
              <span className="info-label">Wilayah Pengelolaan (WPP)</span>
              <span className="info-value">
                {/* Kalau array wpp kosong, tulis "Belum ada data" */}
                {species.wpp && species.wpp.length > 0
                  ? species.wpp.join(', ')
                  : 'Belum ada data'}
              </span>
            </div>
          </IonCardContent>
        </IonCard>

        {/* f. Foto dokumentasi atau kotak placeholder jika belum tersedia */}
        <IonCard className="detail-card">
          <IonCardHeader>
            <IonCardTitle>Foto Dokumentasi</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {species.foto && species.foto.length > 0 ? (
              <div className="foto-gallery">
                {species.foto.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${species.namaIlmiah} dokumentasi`}
                    className="foto-ikan"
                  />
                ))}
              </div>
            ) : (
              <div className="foto-placeholder">
                <p>📷 Foto belum tersedia</p>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </div>
    </MainLayout>
  );
};

export default SpeciesDetail;
