import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { IonImg, IonSpinner, IonText } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { apiClient } from '../services/api';
import { getSpecies, Species, SpeciesLocalName, SpeciesPhoto } from '../services/species';
import './SpeciesDetail.css';

const getPhotoUrl = (photo: SpeciesPhoto | string): string | undefined => {
  const filePath = typeof photo === 'string'
    ? photo
    : photo.filePath || photo.url || photo.imageUrl || photo.photoUrl || photo.path || photo.src;
  if (!filePath || /^(https?:|data:|blob:)/i.test(filePath)) return filePath;

  const baseUrl = apiClient.defaults.baseURL?.replace(/\/+$/, '') || '';
  return `${baseUrl}/${filePath.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

const getLocalName = (localName: SpeciesLocalName | string): string | undefined => {
  if (typeof localName === 'string') return localName;
  const nestedLocalName = localName.localName;
  const nestedName = typeof nestedLocalName === 'string' ? nestedLocalName : nestedLocalName?.name;
  return localName.name || nestedName || localName.submittedName;
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
      .catch((requestError: unknown) => {
        if (active) {
          const message = isAxiosError<{ error?: string }>(requestError)
            ? requestError.response?.data?.error
            : undefined;
          setError(message || 'Gagal memuat detail spesies.');
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

            <section className="species-detail-section">
              <h2>Nama Lokal</h2>
              {species.localNames?.length ? (
                <ul>
                  {species.localNames.map((localName, index) => (
                    <li key={localName.id || `${getLocalName(localName) || 'local-name'}-${index}`}>
                      {getLocalName(localName) || '-'}
                      {localName.regionNote ? ` - ${localName.regionNote}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada nama lokal.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Wilayah Kabupaten/Kota</h2>
              {species.regencies?.length ? (
                <ul>
                  {species.regencies.map((entry, index) => (
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
                  {species.wppZones.map((entry, index) => (
                    <li key={entry.wppZone?.id || `${entry.wppZone?.code}-${index}`}>
                      {entry.wppZone?.code || '-'}
                      {entry.wppZone?.description ? `: ${entry.wppZone.description}` : ''}
                    </li>
                  ))}
                </ul>
              ) : <p>Belum ada data zona WPP.</p>}
            </section>

            <section className="species-detail-section">
              <h2>Referensi</h2>
              {species.references?.length ? (
                <ul>
                  {species.references.map((entry, index) => {
                    const reference = entry.reference;
                    return (
                      <li key={reference?.id || entry.referenceId || `${reference?.title || 'reference'}-${index}`}>
                        {reference?.title || '-'}
                        {reference?.authors ? ` — ${reference.authors}` : ''}
                        {reference?.year ? ` (${reference.year})` : ''}
                        {reference?.source ? ` — ${reference.source}` : ''}
                        {entry.isMainRef ? ' — Referensi utama' : ''}
                      </li>
                    );
                  })}
                </ul>
              ) : <p>Belum ada data referensi.</p>}
            </section>

            {!!species.photos?.length && (
              <section className="species-detail-section species-detail-photo-section">
                <h2>Foto</h2>
                <div className="species-detail-photos">
                  {species.photos.map((photo, index) => {
                    const photoUrl = getPhotoUrl(photo);
                    return photoUrl ? (
                      <IonImg
                        key={(typeof photo === 'string' ? undefined : photo.id) || photoUrl || index}
                        src={photoUrl}
                        alt={(typeof photo === 'string' ? undefined : photo.alt || photo.caption) || species.commonName}
                      />
                    ) : null;
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </article>
    </MainLayout>
  );
};

export default SpeciesDetailPage;
