import React, { useEffect, useState } from 'react';
import { IonImg, IonSpinner, IonText } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { getSpecies, Species } from '../services/species';
import './SpeciesDetail.css';

const getPhotoUrl = (photo: any): string | undefined => {
  if (typeof photo === 'string') return photo;
  return photo?.url || photo?.imageUrl || photo?.photoUrl || photo?.path || photo?.src;
};

const SpeciesDetailPage: React.FC = () => {
  const { speciesId } = useParams<{ speciesId: string }>();
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!speciesId) return;

    let active = true;
    setLoading(true);
    setError('');
    getSpecies(speciesId)
      .then((response) => {
        if (active) setSpecies(response.data);
      })
      .catch((requestError: any) => {
        if (active) {
          setError(requestError.response?.data?.error || 'Gagal memuat detail spesies.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [speciesId]);

  return (
    <MainLayout>
      <article className="species-detail-page">
        {loading ? (
          <div className="species-detail-message">
            <IonSpinner name="crescent" />
            <IonText color="medium">Memuat detail spesies...</IonText>
          </div>
        ) : error ? (
          <IonText color="danger">{error}</IonText>
        ) : !species ? (
          <IonText color="medium">Data spesies tidak ditemukan.</IonText>
        ) : (
          <>
            <header className="species-detail-heading">
              <h1>{species.commonName}</h1>
              <p><em>{species.scientificName}</em></p>
            </header>

            {!!species.photos?.length && (
              <div className="species-detail-photos">
                {species.photos.map((photo: any, index: number) => {
                  const photoUrl = getPhotoUrl(photo);
                  return photoUrl ? (
                    <IonImg
                      key={photo.id || photoUrl || index}
                      src={photoUrl}
                      alt={photo.alt || photo.caption || species.commonName}
                    />
                  ) : null;
                })}
              </div>
            )}

            <section className="species-detail-section">
              <h2>Nama Lokal</h2>
              {species.localNames?.length ? (
                <ul>
                  {species.localNames.map((localName: any, index: number) => (
                    <li key={localName.id || `${localName.name}-${index}`}>
                      {localName.name || '-'}
                      {localName.dialect ? ` (${localName.dialect})` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada nama lokal.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Wilayah Kabupaten/Kota</h2>
              {species.regencies?.length ? (
                <ul>
                  {species.regencies.map((entry: any, index: number) => (
                    <li key={entry.regency?.id || `${entry.regency?.name}-${index}`}>
                      {entry.regency?.name || '-'}
                      {entry.regency?.province ? `, ${entry.regency.province}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada data wilayah.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Zona WPP</h2>
              {species.wppZones?.length ? (
                <ul>
                  {species.wppZones.map((entry: any, index: number) => (
                    <li key={entry.wppZone?.id || `${entry.wppZone?.code}-${index}`}>
                      {entry.wppZone?.code || '-'}
                      {entry.wppZone?.description ? `: ${entry.wppZone.description}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada data zona WPP.</p>}
            </section>
          </>
        )}
      </article>
    </MainLayout>
  );
};

export default SpeciesDetailPage;
